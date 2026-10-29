-- Security and operations: optional two-step verification for staff, and academic session rollover.
create table if not exists app_settings (key text primary key, value text not null, updated_at timestamptz default now());
alter table app_settings enable row level security;
drop policy if exists read_settings on app_settings;
create policy read_settings on app_settings for select using (auth.uid() is not null);
drop policy if exists admin_settings on app_settings;
create policy admin_settings on app_settings for all using (has_role('super_admin')) with check (has_role('super_admin'));
insert into app_settings(key, value) values ('require_staff_mfa', 'false') on conflict do nothing;

-- When enforcement is on, staff powers only work for sessions that passed two-step verification (aal2).
create or replace function mfa_ok() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2' or coalesce((select value from app_settings where key = 'require_staff_mfa'), 'false') <> 'true'
$$;
create or replace function has_role(r app_role) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from user_roles where user_id = auth.uid() and role in (r, 'super_admin')) and mfa_ok() $$;
create or replace function is_staff() returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from user_roles where user_id = auth.uid() and role <> 'student') and mfa_ok() $$;

create or replace function rollover_session(p_new text, p_opens timestamptz, p_closes timestamptz, p_vacate boolean, p_reset_fresh boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
declare vacated int := 0; freshers int := 0;
begin
  if not has_role('dean_office') then raise exception 'Only the Dean''s office can start a new session.'; end if;
  if coalesce(trim(p_new), '') = '' then raise exception 'Enter the new session, for example 2027/2028.'; end if;
  if exists (select 1 from hostel_sessions where academic_session = trim(p_new)) then raise exception 'That session already exists.'; end if;
  update hostel_sessions set is_current = false where is_current;
  insert into hostel_sessions(academic_session, opens_at, closes_at, is_current) values (trim(p_new), p_opens, p_closes, true);
  if p_vacate then
    update allocations set status = 'vacated', checked_out_at = coalesce(checked_out_at, now()) where status = 'active';
    get diagnostics vacated = row_count;
  end if;
  if p_reset_fresh then
    update profiles set is_fresh = false where is_fresh; get diagnostics freshers = row_count;
    update enrolled_students set is_fresh = false where is_fresh;
  end if;
  insert into audit_log(action, entity, entity_id, meta) values ('rollover', 'hostel_sessions', null, jsonb_build_object('new_session', trim(p_new), 'allocations_vacated', vacated, 'fresh_flags_reset', freshers));
  return jsonb_build_object('vacated', vacated, 'fresh_reset', freshers);
end $$;
grant execute on function rollover_session(text, timestamptz, timestamptz, boolean, boolean) to authenticated;
