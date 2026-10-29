-- Clearance: unit officers, plus two functions that enforce the process inside the database.
create table unit_officers (
  user_id uuid references profiles on delete cascade, unit_id uuid references clearance_units on delete cascade,
  primary key (user_id, unit_id)
);
alter table unit_officers enable row level security;
create policy read_unit_officers on unit_officers for select using (user_id = auth.uid() or has_role('dean_office'));
create policy admin_unit_officers on unit_officers for all using (has_role('dean_office')) with check (has_role('dean_office'));

-- Student starts clearance: creates the request and one step per unit
create function start_clearance(p_session text) returns uuid language plpgsql security definer set search_path = public as $$
declare rid uuid;
begin
  if auth.uid() is null then raise exception 'Sign in first.'; end if;
  insert into clearance_requests(student_id, academic_session) values (auth.uid(), p_session)
    on conflict (student_id, academic_session) do update set student_id = excluded.student_id returning id into rid;
  insert into clearance_steps(request_id, unit_id) select rid, id from clearance_units on conflict do nothing;
  return rid;
end $$;
grant execute on function start_clearance(text) to authenticated;

-- Officer approves or returns a step. Order is enforced: earlier units must approve first.
create function decide_clearance_step(p_step uuid, p_approve boolean, p_reason text default null) returns void
language plpgsql security definer set search_path = public as $$
declare s clearance_steps; u clearance_units; r clearance_requests; blocked int;
begin
  select * into s from clearance_steps where id = p_step;
  if s.id is null then raise exception 'Step not found.'; end if;
  if not (exists (select 1 from unit_officers where user_id = auth.uid() and unit_id = s.unit_id) or has_role('super_admin')) then
    raise exception 'You are not an officer for this unit.'; end if;
  select * into u from clearance_units where id = s.unit_id;
  select count(*) into blocked from clearance_steps x join clearance_units cu on cu.id = x.unit_id
    where x.request_id = s.request_id and cu.sequence < u.sequence and x.status <> 'approved';
  if p_approve and blocked > 0 then raise exception 'Earlier units must clear this student first.'; end if;
  if not p_approve and coalesce(trim(p_reason), '') = '' then raise exception 'Give a reason for returning.'; end if;
  update clearance_steps set status = case when p_approve then 'approved' else 'returned' end,
    reason = case when p_approve then null else p_reason end, officer_id = auth.uid(), acted_at = now() where id = p_step;
  select * into r from clearance_requests where id = s.request_id;
  if p_approve then
    if not exists (select 1 from clearance_steps where request_id = r.id and status <> 'approved') then
      update clearance_requests set status = 'cleared', cleared_at = now() where id = r.id;
      insert into notifications(user_id, title, body) values (r.student_id, 'Clearance complete', 'Every unit has cleared you.');
    else
      update clearance_requests set status = 'in_progress' where id = r.id;
    end if;
  else
    update clearance_requests set status = 'returned' where id = r.id;
    insert into notifications(user_id, title, body) values (r.student_id, 'Clearance returned', u.name || ' returned your clearance: ' || p_reason);
  end if;
end $$;
grant execute on function decide_clearance_step(uuid, boolean, text) to authenticated;

-- Example units (replace with the Division's real list and order):
-- insert into clearance_units(name, sequence) values ('Department', 1), ('Library', 2), ('Bursary', 3), ('Hostel office', 4), ('Student Affairs', 5);
