-- Operations: payment reconciliation, auto-allocation, bed swaps, priority, bulk clearance.
-- Run on its own in the Supabase SQL editor, after 0015.

create or replace function reconcile_payments(p_rows jsonb, p_min numeric default 0) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r jsonb; pr payment_records; ref text; amt numeric;
        v int := 0; mism int := 0; nf int := 0; skipped int := 0; problems jsonb := '[]'::jsonb;
begin
  if not has_role('hostel_officer') then raise exception 'Only hostel officers can reconcile payments.'; end if;
  for r in select * from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) loop
    ref := trim(coalesce(r->>'reference', ''));
    if ref = '' then continue; end if;
    begin amt := nullif(trim(coalesce(r->>'amount', '')), '')::numeric; exception when others then amt := null; end;
    select * into pr from payment_records where lower(reference) = lower(ref);
    if pr.id is null then
      nf := nf + 1; problems := problems || jsonb_build_object('reference', ref, 'issue', 'not found');
    elsif pr.status = 'verified' then
      skipped := skipped + 1;
    elsif amt is null or amt < coalesce(p_min, 0) or (pr.amount is not null and amt < pr.amount) then
      mism := mism + 1; problems := problems || jsonb_build_object('reference', ref, 'issue', 'amount too low or missing');
    else
      update payment_records set status = 'verified', verified_by = auth.uid(), verified_at = now(), source = 'api' where id = pr.id;
      v := v + 1;
    end if;
  end loop;
  return jsonb_build_object('verified', v, 'mismatched', mism, 'not_found', nf, 'already_verified', skipped, 'problems', problems);
end $$;
grant execute on function reconcile_payments(jsonb, numeric) to authenticated;

-- Priority: medical > union leader > other > final-year > fresh > first come
create or replace function auto_allocate() returns jsonb
language plpgsql security definer set search_path = public as $$
declare cur hostel_sessions; a record; bed uuid; placed int := 0; wl int := 0; pref uuid; hs uuid[];
begin
  if not has_role('hostel_officer') then raise exception 'Only hostel officers can allocate.'; end if;
  perform pg_advisory_xact_lock(7160016);
  select * into cur from hostel_sessions where is_current limit 1;
  if cur.id is null then raise exception 'No current hostel session is set.'; end if;
  for a in
    select ha.id, ha.student_id, ha.preference_1, ha.preference_2, p.gender
    from hostel_applications ha
    join profiles p on p.id = ha.student_id
    join payment_records pay on pay.id = ha.payment_id and pay.status = 'verified'
    where ha.session_id = cur.id and ha.status in ('submitted', 'eligible')
    order by case when p.priority_category = 'medical' then 0 when p.priority_category = 'union_leader' then 1
                  when p.priority_category = 'other' then 2 when p.is_final_year then 3 when p.is_fresh then 4 else 5 end,
             ha.created_at
  loop
    bed := null;
    hs := array_remove(array[a.preference_1, a.preference_2], null);
    foreach pref in array hs loop
      select b.id into bed from bed_spaces b
        join rooms rm on rm.id = b.room_id join hostels h on h.id = rm.hostel_id
        where rm.hostel_id = pref and h.active and (h.gender = 'mixed' or h.gender = a.gender)
          and not exists (select 1 from allocations x where x.bed_space_id = b.id and x.status = 'active')
          and not exists (select 1 from allocations y join hostel_applications ya on ya.id = y.application_id
                          where y.bed_space_id = b.id and ya.student_id = a.student_id)
        order by rm.block, rm.room_no, b.label limit 1;
      exit when bed is not null;
    end loop;
    if bed is null then
      update hostel_applications set status = 'waitlisted', reason = 'No bed free in your preferred hostels.' where id = a.id;
      insert into notifications(user_id, title, body) values (a.student_id, 'Hostel waitlist', 'No bed was free in your chosen hostels. You are on the waitlist.');
      wl := wl + 1;
    else
      insert into allocations(application_id, bed_space_id) values (a.id, bed);
      update hostel_applications set status = 'allocated', reason = null where id = a.id;
      insert into notifications(user_id, title, body) values (a.student_id, 'Hostel allocated', 'You have been given a bed. Open My hostel to see it.');
      placed := placed + 1;
    end if;
  end loop;
  return jsonb_build_object('allocated', placed, 'waitlisted', wl);
end $$;
grant execute on function auto_allocate() to authenticated;

create or replace function swap_beds(p_matric_a text, p_matric_b text) returns void
language plpgsql security definer set search_path = public as $$
declare pa profiles; pb profiles; aa allocations; ab allocations; ga text; gb text;
begin
  if not has_role('hostel_officer') then raise exception 'Only hostel officers can swap beds.'; end if;
  if lower(trim(p_matric_a)) = lower(trim(p_matric_b)) then raise exception 'Choose two different students.'; end if;
  select * into pa from profiles where lower(matric_no) = lower(trim(p_matric_a));
  select * into pb from profiles where lower(matric_no) = lower(trim(p_matric_b));
  if pa.id is null or pb.id is null then raise exception 'Both matric numbers must exist.'; end if;
  select al.* into aa from allocations al join hostel_applications ha on ha.id = al.application_id where ha.student_id = pa.id and al.status = 'active';
  select al.* into ab from allocations al join hostel_applications ha on ha.id = al.application_id where ha.student_id = pb.id and al.status = 'active';
  if aa.id is null or ab.id is null then raise exception 'Both students need an active bed.'; end if;
  select h.gender into ga from bed_spaces b join rooms r on r.id = b.room_id join hostels h on h.id = r.hostel_id where b.id = ab.bed_space_id;
  select h.gender into gb from bed_spaces b join rooms r on r.id = b.room_id join hostels h on h.id = r.hostel_id where b.id = aa.bed_space_id;
  if ga <> 'mixed' and ga <> pa.gender then raise exception 'The first student cannot move to that hostel (gender).'; end if;
  if gb <> 'mixed' and gb <> pb.gender then raise exception 'The second student cannot move to that hostel (gender).'; end if;
  update allocations set status = 'vacated', checked_out_at = now() where id in (aa.id, ab.id);
  insert into allocations(application_id, bed_space_id) values (aa.application_id, ab.bed_space_id), (ab.application_id, aa.bed_space_id);
  insert into notifications(user_id, title, body) values
    (pa.id, 'Bed swapped', 'Your bed was changed by the hostel office. Open My hostel.'),
    (pb.id, 'Bed swapped', 'Your bed was changed by the hostel office. Open My hostel.');
  insert into audit_log(action, entity, meta) values ('swap_beds', 'allocations', jsonb_build_object('a', pa.matric_no, 'b', pb.matric_no));
end $$;
grant execute on function swap_beds(text, text) to authenticated;

create or replace function set_priority(p_matric text, p_category text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not (has_role('hostel_officer') or has_role('dean_office')) then raise exception 'You cannot set priority.'; end if;
  if p_category not in ('none', 'medical', 'union_leader', 'other') then raise exception 'Unknown category.'; end if;
  update profiles set priority_category = p_category where lower(matric_no) = lower(trim(p_matric));
  if not found then raise exception 'No student with that matric number.'; end if;
  insert into audit_log(action, entity, meta) values ('set_priority', 'profiles', jsonb_build_object('matric', p_matric, 'category', p_category));
end $$;
grant execute on function set_priority(text, text) to authenticated;

-- Approve every pending step at a unit whose earlier units have already cleared
create or replace function approve_ready_steps(p_unit uuid) returns int
language plpgsql security definer set search_path = public as $$
declare s record; n int := 0; seq int;
begin
  if not (exists (select 1 from unit_officers where user_id = auth.uid() and unit_id = p_unit) or has_role('super_admin')) then
    raise exception 'You are not an officer for this unit.'; end if;
  select sequence into seq from clearance_units where id = p_unit;
  for s in
    select cs.id from clearance_steps cs
    join clearance_requests cr on cr.id = cs.request_id
    where cs.unit_id = p_unit and cs.status = 'pending' and cr.status <> 'cleared'
      and not exists (select 1 from clearance_steps x join clearance_units cu on cu.id = x.unit_id
                      where x.request_id = cs.request_id and cu.sequence < seq and x.status <> 'approved')
  loop
    perform decide_clearance_step(s.id, true, null);
    n := n + 1;
  end loop;
  return n;
end $$;
grant execute on function approve_ready_steps(uuid) to authenticated;

-- Workload: open items per officer (for the Dean's view)
create or replace function staff_workload() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not (has_role('dean_office') or has_role('hostel_officer')) then raise exception 'Not allowed.'; end if;
  return jsonb_build_object(
    'tickets', coalesce((select jsonb_agg(jsonb_build_object('name', coalesce(p.full_name, 'Unassigned'), 'open', c.n, 'oldest', c.oldest))
       from (select assigned_to, count(*) n, min(created_at) oldest from maintenance_tickets where status in ('open','assigned','in_progress') group by assigned_to) c
       left join profiles p on p.id = c.assigned_to), '[]'::jsonb),
    'clearance', coalesce((select jsonb_agg(jsonb_build_object('unit', u.name, 'pending', c.n, 'oldest', c.oldest))
       from (select unit_id, count(*) n, min(r.created_at) oldest from clearance_steps s join clearance_requests r on r.id = s.request_id
             where s.status = 'pending' and r.status <> 'cleared' group by unit_id) c join clearance_units u on u.id = c.unit_id), '[]'::jsonb),
    'documents', (select count(*) from document_requests where status = 'submitted'),
    'room_changes', (select count(*) from room_change_requests where status = 'submitted')
  );
end $$;
grant execute on function staff_workload() to authenticated;
