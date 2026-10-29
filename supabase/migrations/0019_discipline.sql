-- Discipline and case management with clearance holds. Run on its own after 0018.
-- Run by the Dean's office; other staff see a case only when assigned to it.

create sequence discipline_case_seq;
create table discipline_cases (
  id uuid primary key default gen_random_uuid(),
  case_no text not null unique default ('DC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('discipline_case_seq')::text, 4, '0')),
  student_id uuid not null references profiles, category text not null, summary text not null,
  status text not null check (status in ('open', 'hearing', 'decided', 'appealed', 'closed')) default 'open',
  opened_by uuid references profiles default auth.uid(), notified_at timestamptz, created_at timestamptz default now()
);
create table case_assignments (case_id uuid references discipline_cases on delete cascade, user_id uuid references profiles on delete cascade, primary key (case_id, user_id));
create table case_events (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references discipline_cases on delete cascade,
  note text not null, visible_to_student boolean not null default false, author uuid references profiles default auth.uid(), created_at timestamptz default now()
);
create table case_hearings (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references discipline_cases on delete cascade,
  scheduled_at timestamptz not null, venue text not null, outcome_note text, created_at timestamptz default now()
);
create table case_sanctions (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references discipline_cases on delete cascade,
  kind text not null, details text, ends_on date, created_at timestamptz default now()
);
create table case_appeals (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references discipline_cases on delete cascade,
  grounds text not null, status text not null check (status in ('submitted', 'upheld', 'dismissed')) default 'submitted',
  decision_note text, decided_by uuid references profiles, created_at timestamptz default now()
);
create table clearance_holds (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references profiles,
  case_id uuid references discipline_cases on delete set null, reason text not null,
  placed_by uuid references profiles default auth.uid(), placed_at timestamptz default now(), lifted_at timestamptz, lifted_by uuid references profiles
);
create index holds_active on clearance_holds (student_id) where lifted_at is null;

create function can_access_case(cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select has_role('dean_office') or (is_staff() and exists (select 1 from case_assignments a where a.case_id = cid and a.user_id = auth.uid()))
$$;
create function case_of_student(cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from discipline_cases c where c.id = cid and c.student_id = auth.uid() and c.notified_at is not null)
$$;
grant execute on function can_access_case(uuid), case_of_student(uuid) to authenticated;

alter table discipline_cases enable row level security; alter table case_assignments enable row level security;
alter table case_events enable row level security; alter table case_hearings enable row level security;
alter table case_sanctions enable row level security; alter table case_appeals enable row level security;
alter table clearance_holds enable row level security;
create policy c_read on discipline_cases for select using (can_access_case(id) or (student_id = auth.uid() and notified_at is not null));
create policy a_read on case_assignments for select using (user_id = auth.uid() or has_role('dean_office'));
create policy e_read on case_events for select using (can_access_case(case_id) or (visible_to_student and case_of_student(case_id)));
create policy h_read on case_hearings for select using (can_access_case(case_id) or case_of_student(case_id));
create policy s_read on case_sanctions for select using (can_access_case(case_id) or case_of_student(case_id));
create policy ap_read on case_appeals for select using (can_access_case(case_id) or case_of_student(case_id));
create policy hold_read on clearance_holds for select using (student_id = auth.uid() or has_role('dean_office') or has_role('clearance_officer'));
create trigger audit_cases after insert or update on discipline_cases for each row execute function audit_change();
create trigger audit_holds after insert or update on clearance_holds for each row execute function audit_change();
create trigger audit_sanctions after insert on case_sanctions for each row execute function audit_change();

create function open_case(p_matric text, p_category text, p_summary text) returns uuid language plpgsql security definer set search_path = public as $$
declare sid uuid; cid uuid;
begin
  if not has_role('dean_office') then raise exception 'Only the Dean''s office opens cases.'; end if;
  if coalesce(trim(p_category), '') = '' or coalesce(trim(p_summary), '') = '' then raise exception 'Give a category and a summary.'; end if;
  select id into sid from profiles where lower(matric_no) = lower(trim(p_matric));
  if sid is null then raise exception 'No student with that matric number.'; end if;
  insert into discipline_cases(student_id, category, summary) values (sid, trim(p_category), trim(p_summary)) returning id into cid;
  return cid;
end $$;
grant execute on function open_case(text, text, text) to authenticated;

create function assign_case(p_case uuid, p_email text) returns void language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  select p.id into uid from profiles p where lower(p.email) = lower(trim(p_email)) and exists (select 1 from user_roles r where r.user_id = p.id and r.role <> 'student');
  if uid is null then raise exception 'No staff member with that email.'; end if;
  insert into case_assignments values (p_case, uid) on conflict do nothing;
end $$;
grant execute on function assign_case(uuid, text) to authenticated;

create function add_case_event(p_case uuid, p_note text, p_visible boolean) returns void language plpgsql security definer set search_path = public as $$
begin
  if not can_access_case(p_case) then raise exception 'You do not have access to this case.'; end if;
  if coalesce(trim(p_note), '') = '' then raise exception 'Write a note.'; end if;
  insert into case_events(case_id, note, visible_to_student) values (p_case, trim(p_note), coalesce(p_visible, false));
end $$;
grant execute on function add_case_event(uuid, text, boolean) to authenticated;

create function schedule_hearing(p_case uuid, p_at timestamptz, p_venue text) returns void language plpgsql security definer set search_path = public as $$
declare c discipline_cases;
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  select * into c from discipline_cases where id = p_case;
  insert into case_hearings(case_id, scheduled_at, venue) values (p_case, p_at, trim(p_venue));
  update discipline_cases set status = 'hearing' where id = p_case and status = 'open';
  if c.notified_at is not null then
    insert into notifications(user_id, title, body) values (c.student_id, 'Hearing scheduled', 'A hearing is set for ' || to_char(p_at, 'DD Mon YYYY HH24:MI') || ' at ' || trim(p_venue) || '.');
  end if;
end $$;
grant execute on function schedule_hearing(uuid, timestamptz, text) to authenticated;

create function add_sanction(p_case uuid, p_kind text, p_details text, p_ends date) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('dean_office') then raise exception 'Only the Dean''s office records sanctions.'; end if;
  insert into case_sanctions(case_id, kind, details, ends_on) values (p_case, trim(p_kind), nullif(trim(p_details), ''), p_ends);
  update discipline_cases set status = 'decided' where id = p_case and status in ('open', 'hearing');
end $$;
grant execute on function add_sanction(uuid, text, text, date) to authenticated;

create function set_case_status(p_case uuid, p_status text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  if p_status not in ('open', 'hearing', 'decided', 'appealed', 'closed') then raise exception 'Unknown status.'; end if;
  update discipline_cases set status = p_status where id = p_case;
end $$;
grant execute on function set_case_status(uuid, text) to authenticated;

create function notify_student_of_case(p_case uuid) returns void language plpgsql security definer set search_path = public as $$
declare c discipline_cases;
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  update discipline_cases set notified_at = coalesce(notified_at, now()) where id = p_case returning * into c;
  insert into notifications(user_id, title, body) values (c.student_id, 'Student Affairs case notice', 'The Dean''s office has opened a case (' || c.case_no || '). Open "My case" to read it.');
end $$;
grant execute on function notify_student_of_case(uuid) to authenticated;

create function submit_appeal(p_case uuid, p_grounds text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not case_of_student(p_case) then raise exception 'You can only appeal your own case.'; end if;
  if not exists (select 1 from discipline_cases where id = p_case and status = 'decided') then raise exception 'You can appeal once a decision has been made.'; end if;
  if exists (select 1 from case_appeals where case_id = p_case and status = 'submitted') then raise exception 'You already have an appeal waiting.'; end if;
  if length(coalesce(trim(p_grounds), '')) < 20 then raise exception 'Explain your grounds in at least a sentence.'; end if;
  insert into case_appeals(case_id, grounds) values (p_case, trim(p_grounds));
  update discipline_cases set status = 'appealed' where id = p_case;
end $$;
grant execute on function submit_appeal(uuid, text) to authenticated;

create function decide_appeal(p_appeal uuid, p_uphold boolean, p_note text) returns void language plpgsql security definer set search_path = public as $$
declare a case_appeals; c discipline_cases;
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  if coalesce(trim(p_note), '') = '' then raise exception 'Write the reason for the decision.'; end if;
  update case_appeals set status = case when p_uphold then 'upheld' else 'dismissed' end, decision_note = trim(p_note), decided_by = auth.uid()
    where id = p_appeal and status = 'submitted' returning * into a;
  if a.id is null then raise exception 'That appeal was already decided.'; end if;
  update discipline_cases set status = 'closed' where id = a.case_id returning * into c;
  insert into notifications(user_id, title, body) values (c.student_id, 'Appeal decided', 'Your appeal on ' || c.case_no || ' was ' || case when p_uphold then 'upheld' else 'dismissed' end || '. Open "My case".');
end $$;
grant execute on function decide_appeal(uuid, boolean, text) to authenticated;

create function place_hold(p_matric text, p_reason text, p_case uuid) returns void language plpgsql security definer set search_path = public as $$
declare sid uuid;
begin
  if not has_role('dean_office') then raise exception 'Only the Dean''s office places holds.'; end if;
  if coalesce(trim(p_reason), '') = '' then raise exception 'Give a reason.'; end if;
  select id into sid from profiles where lower(matric_no) = lower(trim(p_matric));
  if sid is null then raise exception 'No student with that matric number.'; end if;
  insert into clearance_holds(student_id, case_id, reason) values (sid, p_case, trim(p_reason));
  insert into notifications(user_id, title, body) values (sid, 'Clearance hold', 'A hold was placed on your clearance. Contact the Dean''s office.');
end $$;
grant execute on function place_hold(text, text, uuid) to authenticated;

create function lift_hold(p_hold uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  update clearance_holds set lifted_at = now(), lifted_by = auth.uid() where id = p_hold and lifted_at is null;
end $$;
grant execute on function lift_hold(uuid) to authenticated;

-- Clearance now refuses to approve a student who has an active hold.
create or replace function decide_clearance_step(p_step uuid, p_approve boolean, p_reason text default null) returns void
language plpgsql security definer set search_path = public as $$
declare s clearance_steps; u clearance_units; r clearance_requests; blocked int;
begin
  select * into s from clearance_steps where id = p_step;
  if s.id is null then raise exception 'Step not found.'; end if;
  if not (exists (select 1 from unit_officers where user_id = auth.uid() and unit_id = s.unit_id) or has_role('super_admin')) then
    raise exception 'You are not an officer for this unit.'; end if;
  select * into r from clearance_requests where id = s.request_id;
  if p_approve and exists (select 1 from clearance_holds h where h.student_id = r.student_id and h.lifted_at is null) then
    raise exception 'This student has a hold. Contact the Dean''s office before approving.'; end if;
  select * into u from clearance_units where id = s.unit_id;
  select count(*) into blocked from clearance_steps x join clearance_units cu on cu.id = x.unit_id
    where x.request_id = s.request_id and cu.sequence < u.sequence and x.status <> 'approved';
  if p_approve and blocked > 0 then raise exception 'Earlier units must clear this student first.'; end if;
  if not p_approve and coalesce(trim(p_reason), '') = '' then raise exception 'Give a reason for returning.'; end if;
  update clearance_steps set status = case when p_approve then 'approved' else 'returned' end,
    reason = case when p_approve then null else p_reason end, officer_id = auth.uid(), acted_at = now() where id = p_step;
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

-- Bulk approval skips students with holds instead of failing
create or replace function approve_ready_steps(p_unit uuid) returns int
language plpgsql security definer set search_path = public as $$
declare s record; n int := 0; seq int;
begin
  if not (exists (select 1 from unit_officers where user_id = auth.uid() and unit_id = p_unit) or has_role('super_admin')) then
    raise exception 'You are not an officer for this unit.'; end if;
  select sequence into seq from clearance_units where id = p_unit;
  for s in
    select cs.id from clearance_steps cs join clearance_requests cr on cr.id = cs.request_id
    where cs.unit_id = p_unit and cs.status = 'pending' and cr.status <> 'cleared'
      and not exists (select 1 from clearance_holds h where h.student_id = cr.student_id and h.lifted_at is null)
      and not exists (select 1 from clearance_steps x join clearance_units cu on cu.id = x.unit_id
                      where x.request_id = cs.request_id and cu.sequence < seq and x.status <> 'approved')
  loop
    perform decide_clearance_step(s.id, true, null);
    n := n + 1;
  end loop;
  return n;
end $$;
