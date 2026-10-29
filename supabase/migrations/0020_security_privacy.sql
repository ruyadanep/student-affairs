-- Security, NDPA privacy tools, editable settings, visitor log, lost and found, inventory.
-- Run on its own after 0019.

-- Login history ---------------------------------------------------------------
create table login_events (
  id bigserial primary key, user_id uuid not null references profiles on delete cascade default auth.uid(),
  email text, ip text, user_agent text, created_at timestamptz not null default now()
);
create index login_events_user on login_events (user_id, created_at desc);
alter table login_events enable row level security;
create policy login_insert on login_events for insert with check (user_id = auth.uid());
create policy login_read on login_events for select using (user_id = auth.uid() or has_role('super_admin'));

-- Two-person approval for super admin -------------------------------------------
create table admin_grant_requests (
  id uuid primary key default gen_random_uuid(), target_user uuid not null references profiles,
  requested_by uuid not null references profiles default auth.uid(), decided_by uuid references profiles,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz default now(), decided_at timestamptz
);
alter table admin_grant_requests enable row level security;
create policy grant_read on admin_grant_requests for select using (has_role('super_admin'));

-- Once two super admins exist, a super_admin role can only be added through approve_super_admin().
create function guard_super_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role = 'super_admin' and coalesce(current_setting('app.super_grant', true), '') <> 'on'
     and (select count(*) from user_roles where role = 'super_admin') >= 2 then
    raise exception 'Granting super admin needs a second super admin to approve it (Staff > Security).';
  end if;
  return new;
end $$;
create trigger guard_super_admin before insert on user_roles for each row execute function guard_super_admin();

create function request_super_admin(p_email text) returns text language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not has_role('super_admin') then raise exception 'Only a super admin can do this.'; end if;
  select id into uid from profiles where lower(email) = lower(trim(p_email));
  if uid is null then raise exception 'No account with that email.'; end if;
  if exists (select 1 from user_roles where user_id = uid and role = 'super_admin') then raise exception 'They are already a super admin.'; end if;
  if (select count(*) from user_roles where role = 'super_admin') < 2 then
    perform set_config('app.super_grant', 'on', true);
    insert into user_roles(user_id, role) values (uid, 'super_admin');
    insert into audit_log(action, entity, entity_id, meta) values ('grant_super_admin', 'user_roles', uid::text, '{"mode":"direct"}');
    return 'granted';
  end if;
  insert into admin_grant_requests(target_user) values (uid);
  return 'requested';
end $$;
grant execute on function request_super_admin(text) to authenticated;

create function approve_super_admin(p_id uuid) returns void language plpgsql security definer set search_path = public as $$
declare r admin_grant_requests;
begin
  if not has_role('super_admin') then raise exception 'Only a super admin can do this.'; end if;
  select * into r from admin_grant_requests where id = p_id and status = 'pending' for update;
  if r.id is null then raise exception 'That request is not pending.'; end if;
  if r.requested_by = auth.uid() then raise exception 'A different super admin must approve this.'; end if;
  perform set_config('app.super_grant', 'on', true);
  insert into user_roles(user_id, role) values (r.target_user, 'super_admin') on conflict do nothing;
  update admin_grant_requests set status = 'approved', decided_by = auth.uid(), decided_at = now() where id = p_id;
  insert into audit_log(action, entity, entity_id, meta) values ('grant_super_admin', 'user_roles', r.target_user::text, jsonb_build_object('mode', 'two_person', 'requested_by', r.requested_by));
end $$;
grant execute on function approve_super_admin(uuid) to authenticated;

create function reject_super_admin(p_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('super_admin') then raise exception 'Only a super admin can do this.'; end if;
  update admin_grant_requests set status = 'rejected', decided_by = auth.uid(), decided_at = now() where id = p_id and status = 'pending';
end $$;
grant execute on function reject_super_admin(uuid) to authenticated;

-- Settings ------------------------------------------------------------------
create function set_setting(p_key text, p_value text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('super_admin') then raise exception 'Only a super admin can change settings.'; end if;
  if p_key not in ('require_staff_mfa', 'email_key_alerts', 'idle_minutes', 'overdue_days') then raise exception 'Unknown setting.'; end if;
  if p_key in ('idle_minutes', 'overdue_days') and p_value !~ '^[0-9]{1,3}$' then raise exception 'Use a whole number.'; end if;
  if p_key in ('require_staff_mfa', 'email_key_alerts') and p_value not in ('true', 'false') then raise exception 'Use true or false.'; end if;
  insert into app_settings(key, value, updated_at) values (p_key, p_value, now()) on conflict (key) do update set value = excluded.value, updated_at = now();
  insert into audit_log(action, entity, entity_id, meta) values ('set_setting', 'app_settings', p_key, jsonb_build_object('value', p_value));
end $$;
grant execute on function set_setting(text, text) to authenticated;
insert into app_settings(key, value) values ('idle_minutes', '30'), ('overdue_days', '3') on conflict do nothing;

-- NDPA: data requests and anonymisation ---------------------------------------
create table data_requests (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references profiles default auth.uid(),
  kind text not null check (kind in ('correction', 'deletion')), details text not null,
  status text not null check (status in ('submitted', 'done', 'rejected')) default 'submitted',
  decision_note text, decided_by uuid references profiles, created_at timestamptz default now(), decided_at timestamptz
);
alter table data_requests enable row level security;
create policy dr_read on data_requests for select using (student_id = auth.uid() or has_role('dean_office') or has_role('super_admin'));
create policy dr_insert on data_requests for insert with check (student_id = auth.uid() and status = 'submitted');

create function decide_data_request(p_id uuid, p_done boolean, p_note text) returns void language plpgsql security definer set search_path = public as $$
declare r data_requests;
begin
  if not (has_role('dean_office') or has_role('super_admin')) then raise exception 'Not allowed.'; end if;
  if coalesce(trim(p_note), '') = '' then raise exception 'Write a note for the student.'; end if;
  update data_requests set status = case when p_done then 'done' else 'rejected' end, decision_note = trim(p_note), decided_by = auth.uid(), decided_at = now()
    where id = p_id and status = 'submitted' returning * into r;
  if r.id is null then raise exception 'Already decided.'; end if;
  insert into notifications(user_id, title, body) values (r.student_id, 'Data request ' || case when p_done then 'completed' else 'declined' end, trim(p_note));
end $$;
grant execute on function decide_data_request(uuid, boolean, text) to authenticated;

-- Removes personal details but keeps records the University must retain (allocations, clearance, audit) under a pseudonym.
create function anonymise_student(p_matric text) returns uuid language plpgsql security definer set search_path = public as $$
declare p profiles;
begin
  if not has_role('super_admin') then raise exception 'Only a super admin can anonymise a student.'; end if;
  select * into p from profiles where lower(matric_no) = lower(trim(p_matric));
  if p.id is null then raise exception 'No student with that matric number.'; end if;
  if exists (select 1 from user_roles where user_id = p.id and role <> 'student') then raise exception 'Staff accounts cannot be anonymised here.'; end if;
  if exists (select 1 from allocations a join hostel_applications ha on ha.id = a.application_id where ha.student_id = p.id and a.status = 'active') then raise exception 'The student still holds a bed.'; end if;
  if exists (select 1 from clearance_holds where student_id = p.id and lifted_at is null) then raise exception 'The student has an active clearance hold.'; end if;
  update profiles set full_name = 'Anonymised student', email = null, phone = null, matric_no = 'ANON-' || substr(p.id::text, 1, 8),
    faculty = null, department = null, email_alerts = false, sms_alerts = false where id = p.id;
  delete from notifications where user_id = p.id;
  delete from login_events where user_id = p.id;
  update outbound_messages set to_address = 'removed', body = '(removed)', subject = null where user_id = p.id;
  update data_requests set details = '(removed)' where student_id = p.id;
  insert into audit_log(action, entity, entity_id, meta) values ('anonymise_student', 'profiles', p.id::text, '{}');
  return p.id;
end $$;
grant execute on function anonymise_student(text) to authenticated;

-- Hostel desk: visitors, lost and found, inventory -----------------------------
create table visitor_log (
  id uuid primary key default gen_random_uuid(), hostel_id uuid not null references hostels, visitor_name text not null,
  resident_matric text, purpose text, in_at timestamptz not null default now(), out_at timestamptz, logged_by uuid references profiles default auth.uid()
);
create table lost_items (
  id uuid primary key default gen_random_uuid(), description text not null, found_where text, found_on date not null default current_date,
  status text not null check (status in ('found', 'claimed')) default 'found', claimed_by text, created_by uuid references profiles default auth.uid()
);
create table hostel_inventory (
  id uuid primary key default gen_random_uuid(), hostel_id uuid not null references hostels, item text not null, quantity int not null default 0 check (quantity >= 0),
  condition text not null default 'good', updated_at timestamptz default now(), unique (hostel_id, item)
);
alter table visitor_log enable row level security; alter table lost_items enable row level security; alter table hostel_inventory enable row level security;
create policy visitors_staff on visitor_log for select using (has_role('hostel_officer'));
create policy lost_read on lost_items for select using (auth.uid() is not null);
create policy inv_staff on hostel_inventory for select using (has_role('hostel_officer'));

create function log_visitor(p_hostel uuid, p_name text, p_matric text, p_purpose text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('hostel_officer') then raise exception 'Not allowed.'; end if;
  if coalesce(trim(p_name), '') = '' then raise exception 'Enter the visitor''s name.'; end if;
  insert into visitor_log(hostel_id, visitor_name, resident_matric, purpose) values (p_hostel, trim(p_name), nullif(trim(p_matric), ''), nullif(trim(p_purpose), ''));
end $$;
grant execute on function log_visitor(uuid, text, text, text) to authenticated;
create function checkout_visitor(p_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('hostel_officer') then raise exception 'Not allowed.'; end if;
  update visitor_log set out_at = now() where id = p_id and out_at is null;
end $$;
grant execute on function checkout_visitor(uuid) to authenticated;
create function add_lost_item(p_description text, p_where text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_staff() then raise exception 'Not allowed.'; end if;
  if coalesce(trim(p_description), '') = '' then raise exception 'Describe the item.'; end if;
  insert into lost_items(description, found_where) values (trim(p_description), nullif(trim(p_where), ''));
end $$;
grant execute on function add_lost_item(text, text) to authenticated;
create function resolve_lost_item(p_id uuid, p_claimant text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_staff() then raise exception 'Not allowed.'; end if;
  if coalesce(trim(p_claimant), '') = '' then raise exception 'Record who collected it.'; end if;
  update lost_items set status = 'claimed', claimed_by = trim(p_claimant) where id = p_id and status = 'found';
end $$;
grant execute on function resolve_lost_item(uuid, text) to authenticated;
create function add_inventory(p_hostel uuid, p_item text, p_qty int, p_condition text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('hostel_officer') then raise exception 'Not allowed.'; end if;
  insert into hostel_inventory(hostel_id, item, quantity, condition) values (p_hostel, trim(p_item), greatest(coalesce(p_qty, 0), 0), coalesce(nullif(trim(p_condition), ''), 'good'))
  on conflict (hostel_id, item) do update set quantity = excluded.quantity, condition = excluded.condition, updated_at = now();
end $$;
grant execute on function add_inventory(uuid, text, int, text) to authenticated;
create function update_inventory(p_id uuid, p_qty int, p_condition text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not has_role('hostel_officer') then raise exception 'Not allowed.'; end if;
  update hostel_inventory set quantity = greatest(coalesce(p_qty, 0), 0), condition = coalesce(nullif(trim(p_condition), ''), condition), updated_at = now() where id = p_id;
end $$;
grant execute on function update_inventory(uuid, int, text) to authenticated;
