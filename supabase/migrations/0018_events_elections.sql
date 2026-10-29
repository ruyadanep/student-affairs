-- Events calendar and Students' Union elections. Run on its own after 0017.
-- Elections are administered by dean_office (no new enum values are needed).

create table events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations on delete set null,
  title text not null, description text, venue text not null,
  starts_at timestamptz not null, ends_at timestamptz, capacity int,
  status text not null check (status in ('requested', 'approved', 'rejected', 'cancelled')) default 'requested',
  requested_by uuid not null references profiles default auth.uid(), decision_note text, decided_by uuid references profiles,
  created_at timestamptz default now()
);
create table event_rsvps (
  event_id uuid references events on delete cascade, student_id uuid references profiles on delete cascade default auth.uid(),
  checked_in_at timestamptz, primary key (event_id, student_id)
);
alter table events enable row level security;
alter table event_rsvps enable row level security;
create policy events_read on events for select using (status = 'approved' or requested_by = auth.uid() or is_staff());
create policy events_request on events for insert with check (requested_by = auth.uid() and status = 'requested' and auth.uid() is not null);
create policy rsvp_read on event_rsvps for select using (student_id = auth.uid() or is_staff());
create policy rsvp_add on event_rsvps for insert with check (student_id = auth.uid()
  and exists (select 1 from events e where e.id = event_id and e.status = 'approved' and e.starts_at > now() - interval '1 day'));
create policy rsvp_remove on event_rsvps for delete using (student_id = auth.uid());
create trigger audit_events after update on events for each row execute function audit_change();

create function decide_event(p_id uuid, p_approve boolean, p_note text default null) returns void
language plpgsql security definer set search_path = public as $$
declare e events;
begin
  if not (has_role('dean_office') or has_role('org_officer')) then raise exception 'You cannot decide event requests.'; end if;
  if not p_approve and coalesce(trim(p_note), '') = '' then raise exception 'Give a reason for declining.'; end if;
  update events set status = case when p_approve then 'approved' else 'rejected' end, decision_note = p_note, decided_by = auth.uid()
    where id = p_id and status = 'requested' returning * into e;
  if e.id is null then raise exception 'That request was already decided.'; end if;
  insert into notifications(user_id, title, body) values (e.requested_by, case when p_approve then 'Event approved' else 'Event declined' end,
    e.title || coalesce(': ' || p_note, ''));
end $$;
grant execute on function decide_event(uuid, boolean, text) to authenticated;

create function checkin_event(p_event uuid, p_matric text) returns text
language plpgsql security definer set search_path = public as $$
declare pid uuid; nm text;
begin
  if not (has_role('dean_office') or has_role('org_officer')) then raise exception 'You cannot check people in.'; end if;
  select id, full_name into pid, nm from profiles where lower(matric_no) = lower(trim(p_matric));
  if pid is null then raise exception 'No student with that matric number.'; end if;
  insert into event_rsvps(event_id, student_id, checked_in_at) values (p_event, pid, now())
  on conflict (event_id, student_id) do update set checked_in_at = coalesce(event_rsvps.checked_in_at, now());
  return nm;
end $$;
grant execute on function checkin_event(uuid, text) to authenticated;

-- Elections ---------------------------------------------------------------
create table elections (
  id uuid primary key default gen_random_uuid(), title text not null,
  status text not null check (status in ('draft', 'open', 'closed', 'published')) default 'draft',
  opens_at timestamptz, closes_at timestamptz, created_by uuid references profiles default auth.uid(), created_at timestamptz default now()
);
create table election_positions (
  id uuid primary key default gen_random_uuid(), election_id uuid not null references elections on delete cascade, title text not null, seq int not null default 0
);
create table election_candidates (
  id uuid primary key default gen_random_uuid(), position_id uuid not null references election_positions on delete cascade,
  name text not null, matric_no text, manifesto text
);
create table voter_roll (
  election_id uuid references elections on delete cascade, student_id uuid references profiles on delete cascade,
  voted_at timestamptz, primary key (election_id, student_id)
);
-- Ballots carry no voter id and no timestamp: a vote cannot be traced back to a student.
create table ballots (
  id uuid primary key default gen_random_uuid(), position_id uuid not null references election_positions on delete cascade,
  candidate_id uuid references election_candidates on delete cascade
);
alter table elections enable row level security;
alter table election_positions enable row level security;
alter table election_candidates enable row level security;
alter table voter_roll enable row level security;
alter table ballots enable row level security;   -- no policies: only cast_votes and election_results touch it

create function election_visible(eid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from elections e where e.id = eid and (e.status = 'published' or (auth.uid() is not null and e.status in ('open', 'closed')) or has_role('dean_office')))
$$;
grant execute on function election_visible(uuid) to anon, authenticated;
create policy el_read on elections for select using (election_visible(id));
create policy pos_read on election_positions for select using (election_visible(election_id));
create policy cand_read on election_candidates for select using (exists (select 1 from election_positions p where p.id = position_id and election_visible(p.election_id)));
create policy roll_read on voter_roll for select using (student_id = auth.uid() or has_role('dean_office'));

create function create_election(p_title text, p_opens timestamptz, p_closes timestamptz) returns uuid
language plpgsql security definer set search_path = public as $$
declare id uuid;
begin
  if not has_role('dean_office') then raise exception 'Only the Dean''s office runs elections.'; end if;
  if coalesce(trim(p_title), '') = '' then raise exception 'Give the election a title.'; end if;
  if p_opens is null or p_closes is null or p_closes <= p_opens then raise exception 'Closing time must be after opening time.'; end if;
  insert into elections(title, opens_at, closes_at) values (trim(p_title), p_opens, p_closes) returning elections.id into id;
  return id;
end $$;
grant execute on function create_election(text, timestamptz, timestamptz) to authenticated;

create function add_position(p_election uuid, p_title text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  if not exists (select 1 from elections where id = p_election and status = 'draft') then raise exception 'Positions can only be added while the election is a draft.'; end if;
  insert into election_positions(election_id, title, seq) values (p_election, trim(p_title), (select coalesce(max(seq), 0) + 1 from election_positions where election_id = p_election));
end $$;
grant execute on function add_position(uuid, text) to authenticated;

create function add_candidate(p_position uuid, p_name text, p_matric text, p_manifesto text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  if not exists (select 1 from election_positions ps join elections e on e.id = ps.election_id where ps.id = p_position and e.status = 'draft') then raise exception 'Candidates can only be added while the election is a draft.'; end if;
  insert into election_candidates(position_id, name, matric_no, manifesto) values (p_position, trim(p_name), nullif(trim(p_matric), ''), nullif(trim(p_manifesto), ''));
end $$;
grant execute on function add_candidate(uuid, text, text, text) to authenticated;

create function load_voter_roll(p_election uuid, p_level int, p_faculty text) returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  if not exists (select 1 from elections where id = p_election and status = 'draft') then raise exception 'The voter roll can only change while the election is a draft.'; end if;
  insert into voter_roll(election_id, student_id)
  select p_election, p.id from profiles p where exists (select 1 from user_roles r where r.user_id = p.id and r.role = 'student')
    and (p_level is null or p.level = p_level) and (coalesce(trim(p_faculty), '') = '' or p.faculty = trim(p_faculty))
  on conflict do nothing;
  select count(*) into n from voter_roll where election_id = p_election;
  return n;
end $$;
grant execute on function load_voter_roll(uuid, int, text) to authenticated;

create function set_election_state(p_election uuid, p_state text) returns void language plpgsql security definer set search_path = public as $$
declare e elections;
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  select * into e from elections where id = p_election for update;
  if e.id is null then raise exception 'Election not found.'; end if;
  if not ((e.status = 'draft' and p_state = 'open') or (e.status = 'open' and p_state = 'closed') or (e.status = 'closed' and p_state = 'published')) then
    raise exception 'An election moves draft, open, closed, published in that order.'; end if;
  if p_state = 'open' and (not exists (select 1 from election_positions where election_id = p_election)
     or exists (select 1 from election_positions p where p.election_id = p_election and (select count(*) from election_candidates c where c.position_id = p.id) < 1)
     or not exists (select 1 from voter_roll where election_id = p_election)) then
    raise exception 'Add positions with candidates and load the voter roll first.'; end if;
  update elections set status = p_state where id = p_election;
  insert into audit_log(action, entity, entity_id, meta) values ('election_' || p_state, 'elections', p_election::text, '{}');
end $$;
grant execute on function set_election_state(uuid, text) to authenticated;

create function cast_votes(p_election uuid, p_choices jsonb) returns void language plpgsql security definer set search_path = public as $$
declare e elections; v voter_roll; ps record; ch text; cid uuid;
begin
  select * into e from elections where id = p_election;
  if e.id is null or e.status <> 'open' or now() < e.opens_at or now() > e.closes_at then raise exception 'Voting is not open.'; end if;
  select * into v from voter_roll where election_id = p_election and student_id = auth.uid() for update;
  if v.student_id is null then raise exception 'You are not on the voter roll.'; end if;
  if v.voted_at is not null then raise exception 'You have already voted.'; end if;
  for ps in select id from election_positions where election_id = p_election loop
    ch := p_choices ->> ps.id::text; cid := null;
    if ch is not null and ch <> 'abstain' then
      cid := ch::uuid;
      if not exists (select 1 from election_candidates where id = cid and position_id = ps.id) then raise exception 'Invalid choice.'; end if;
    end if;
    insert into ballots(position_id, candidate_id) values (ps.id, cid);
  end loop;
  update voter_roll set voted_at = now() where election_id = p_election and student_id = auth.uid();
end $$;
grant execute on function cast_votes(uuid, jsonb) to authenticated;

create function election_results(p_election uuid) returns table (position_id uuid, position_title text, candidate_id uuid, candidate_name text, votes bigint)
language plpgsql stable security definer set search_path = public as $$
declare st text;
begin
  select status into st from elections where id = p_election;
  if st is null then return; end if;
  if not (st = 'published' or (st = 'closed' and has_role('dean_office'))) then raise exception 'Results are not available yet.'; end if;
  return query select ps.id, ps.title, c.id, c.name, count(b.id) from election_positions ps join election_candidates c on c.position_id = ps.id
    left join ballots b on b.candidate_id = c.id where ps.election_id = p_election group by ps.id, ps.title, ps.seq, c.id, c.name order by ps.seq, count(b.id) desc;
end $$;
grant execute on function election_results(uuid) to anon, authenticated;

create function election_turnout(p_election uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not has_role('dean_office') then raise exception 'Not allowed.'; end if;
  return jsonb_build_object('eligible', (select count(*) from voter_roll where election_id = p_election), 'voted', (select count(*) from voter_roll where election_id = p_election and voted_at is not null));
end $$;
grant execute on function election_turnout(uuid) to authenticated;
