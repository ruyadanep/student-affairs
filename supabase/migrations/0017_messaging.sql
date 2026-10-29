-- Email/SMS delivery queue, templates, scheduled announcements, key alerts, digest.
-- Run on its own after 0016.

alter table profiles add column if not exists email_alerts boolean not null default true;
alter table profiles add column if not exists sms_alerts boolean not null default false;

create table outbound_messages (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email', 'sms')),
  user_id uuid references profiles on delete set null,
  to_address text not null, subject text, body text not null,
  status text not null check (status in ('queued', 'sent', 'failed')) default 'queued',
  attempts int not null default 0, error text,
  created_at timestamptz not null default now(), sent_at timestamp with time zone
);
create index outbound_queue on outbound_messages (status, created_at);
alter table outbound_messages enable row level security;   -- no policies: only the server's service key touches it

create table announcement_templates (
  id uuid primary key default gen_random_uuid(), name text not null unique, title text not null, body text not null,
  created_by uuid references profiles default auth.uid(), created_at timestamptz default now()
);
alter table announcement_templates enable row level security;
create policy read_templates on announcement_templates for select using (has_role('dean_office') or has_role('hostel_officer'));

create table scheduled_announcements (
  id uuid primary key default gen_random_uuid(), title text not null, body text not null,
  hostels uuid[] not null default '{}', levels int[] not null default '{}', faculties text[] not null default '{}',
  channels text[] not null default '{in_app}', send_at timestamptz not null,
  status text not null check (status in ('scheduled', 'sent', 'cancelled')) default 'scheduled',
  created_by uuid references profiles default auth.uid(), created_at timestamptz default now()
);
alter table scheduled_announcements enable row level security;
create policy read_scheduled on scheduled_announcements for select using (has_role('dean_office') or has_role('hostel_officer'));

-- Recipient rules without a login check (used by the scheduler); never granted to users.
create function announcement_recipients_core(p_hostels uuid[], p_levels int[], p_faculties text[]) returns setof uuid
language sql stable security definer set search_path = public as $$
  select p.id from profiles p
  where exists (select 1 from user_roles r where r.user_id = p.id and r.role = 'student')
    and (coalesce(cardinality(p_levels), 0) = 0 or p.level = any(p_levels))
    and (coalesce(cardinality(p_faculties), 0) = 0 or p.faculty = any(p_faculties))
    and (coalesce(cardinality(p_hostels), 0) = 0 or exists (
      select 1 from allocations al
      join hostel_applications ha on ha.id = al.application_id
      join bed_spaces b on b.id = al.bed_space_id
      join rooms rm on rm.id = b.room_id
      where al.status = 'active' and ha.student_id = p.id and rm.hostel_id = any(p_hostels)))
$$;
revoke all on function announcement_recipients_core(uuid[], int[], text[]) from public, anon, authenticated;

create function deliver_announcement(p_title text, p_body text, p_hostels uuid[], p_levels int[], p_faculties text[], p_channels text[], p_by uuid) returns int
language plpgsql security definer set search_path = public as $$
declare aid uuid; n int;
begin
  insert into announcements(title, body, audience, channels, created_by, published_at)
  values (trim(p_title), trim(p_body),
    jsonb_build_object('hostel_ids', to_jsonb(coalesce(p_hostels, '{}'::uuid[])), 'levels', to_jsonb(coalesce(p_levels, '{}'::int[])), 'faculties', to_jsonb(coalesce(p_faculties, '{}'::text[]))),
    coalesce(p_channels, '{in_app}'), p_by, now()) returning id into aid;
  insert into notifications(user_id, announcement_id, title, body)
  select x, aid, trim(p_title), trim(p_body) from announcement_recipients_core(p_hostels, p_levels, p_faculties) x;
  get diagnostics n = row_count;
  if 'email' = any(p_channels) then
    insert into outbound_messages(channel, user_id, to_address, subject, body)
    select 'email', p.id, p.email, trim(p_title), trim(p_body) from profiles p
    where p.id in (select announcement_recipients_core(p_hostels, p_levels, p_faculties)) and p.email_alerts and coalesce(p.email, '') <> '';
  end if;
  if 'sms' = any(p_channels) then
    insert into outbound_messages(channel, user_id, to_address, body)
    select 'sms', p.id, p.phone, left(trim(p_title) || ': ' || trim(p_body), 300) from profiles p
    where p.id in (select announcement_recipients_core(p_hostels, p_levels, p_faculties)) and p.sms_alerts and coalesce(p.phone, '') <> '';
  end if;
  return n;
end $$;
revoke all on function deliver_announcement(text, text, uuid[], int[], text[], text[], uuid) from public, anon, authenticated;

create function announce_channels(p_email boolean, p_sms boolean) returns text[] language sql immutable as $$
  select array_remove(array_remove(array['in_app', case when p_email then 'email' end, case when p_sms then 'sms' end], null), null)
$$;

create function send_announcement_v2(p_title text, p_body text, p_hostel uuid, p_level int, p_faculty text, p_email boolean, p_sms boolean) returns int
language plpgsql security definer set search_path = public as $$
begin
  if not (has_role('dean_office') or has_role('hostel_officer')) then raise exception 'You cannot send announcements.'; end if;
  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_body), '') = '' then raise exception 'Enter a title and a message.'; end if;
  return deliver_announcement(p_title, p_body, case when p_hostel is null then '{}'::uuid[] else array[p_hostel] end,
    case when p_level is null then '{}'::int[] else array[p_level] end,
    case when coalesce(trim(p_faculty), '') = '' then '{}'::text[] else array[trim(p_faculty)] end,
    announce_channels(p_email, p_sms), auth.uid());
end $$;
grant execute on function send_announcement_v2(text, text, uuid, int, text, boolean, boolean) to authenticated;

create function schedule_announcement(p_title text, p_body text, p_hostel uuid, p_level int, p_faculty text, p_email boolean, p_sms boolean, p_send_at timestamptz) returns uuid
language plpgsql security definer set search_path = public as $$
declare id uuid;
begin
  if not (has_role('dean_office') or has_role('hostel_officer')) then raise exception 'You cannot schedule announcements.'; end if;
  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_body), '') = '' then raise exception 'Enter a title and a message.'; end if;
  if p_send_at is null or p_send_at < now() then raise exception 'Choose a time in the future.'; end if;
  insert into scheduled_announcements(title, body, hostels, levels, faculties, channels, send_at)
  values (trim(p_title), trim(p_body), case when p_hostel is null then '{}'::uuid[] else array[p_hostel] end,
    case when p_level is null then '{}'::int[] else array[p_level] end,
    case when coalesce(trim(p_faculty), '') = '' then '{}'::text[] else array[trim(p_faculty)] end,
    announce_channels(p_email, p_sms), p_send_at) returning scheduled_announcements.id into id;
  return id;
end $$;
grant execute on function schedule_announcement(text, text, uuid, int, text, boolean, boolean, timestamptz) to authenticated;

create function cancel_scheduled(p_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  if not (has_role('dean_office') or has_role('hostel_officer')) then raise exception 'Not allowed.'; end if;
  update scheduled_announcements set status = 'cancelled' where id = p_id and status = 'scheduled';
end $$;
grant execute on function cancel_scheduled(uuid) to authenticated;

create function save_template(p_name text, p_title text, p_body text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not (has_role('dean_office') or has_role('hostel_officer')) then raise exception 'Not allowed.'; end if;
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_title), '') = '' or coalesce(trim(p_body), '') = '' then raise exception 'Fill in all three boxes.'; end if;
  insert into announcement_templates(name, title, body) values (trim(p_name), trim(p_title), trim(p_body))
  on conflict (name) do update set title = excluded.title, body = excluded.body;
end $$;
grant execute on function save_template(text, text, text) to authenticated;

create function delete_template(p_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  if not (has_role('dean_office') or has_role('hostel_officer')) then raise exception 'Not allowed.'; end if;
  delete from announcement_templates where id = p_id;
end $$;
grant execute on function delete_template(uuid) to authenticated;

-- Server-only jobs (service key): send due scheduled announcements, and build the Dean's digest.
create function process_scheduled() returns int language plpgsql security definer set search_path = public as $$
declare s record; n int := 0;
begin
  for s in select * from scheduled_announcements where status = 'scheduled' and send_at <= now() order by send_at for update skip locked loop
    perform deliver_announcement(s.title, s.body, s.hostels, s.levels, s.faculties, s.channels, s.created_by);
    update scheduled_announcements set status = 'sent' where id = s.id;
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function process_scheduled() from public, anon, authenticated;
grant execute on function process_scheduled() to service_role;

create function digest_summary() returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'applications', (select count(*) from hostel_applications where created_at > now() - interval '30 days'),
    'allocated', (select count(*) from allocations where created_at > now() - interval '30 days'),
    'waitlisted', (select count(*) from hostel_applications where status = 'waitlisted'),
    'tickets_opened', (select count(*) from maintenance_tickets where created_at > now() - interval '30 days'),
    'tickets_open_now', (select count(*) from maintenance_tickets where status in ('open', 'assigned', 'in_progress')),
    'cleared', (select count(*) from clearance_requests where cleared_at > now() - interval '30 days'),
    'clearance_waiting', (select count(*) from clearance_steps where status = 'pending'),
    'letters_waiting', (select count(*) from document_requests where status = 'submitted'),
    'support_open', (select count(*) from support_requests where status <> 'closed')
  )
$$;
revoke all on function digest_summary() from public, anon, authenticated;
grant execute on function digest_summary() to service_role;

-- Student alert preferences
create function set_my_alerts(p_email boolean, p_sms boolean, p_phone text) returns void language plpgsql security definer set search_path = public as $$
declare ph text := regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g');
begin
  if auth.uid() is null then raise exception 'Sign in first.'; end if;
  if p_sms and ph = '' then raise exception 'Add a phone number to receive SMS.'; end if;
  update profiles set email_alerts = coalesce(p_email, true), sms_alerts = coalesce(p_sms, false),
    phone = case when ph <> '' then ph else phone end where id = auth.uid();
end $$;
grant execute on function set_my_alerts(boolean, boolean, text) to authenticated;

-- Key alerts: email a student when something important happens (switch on in app_settings)
insert into app_settings(key, value) values ('email_key_alerts', 'false') on conflict do nothing;
create function queue_key_alert() returns trigger language plpgsql security definer set search_path = public as $$
declare em text; ok boolean;
begin
  if coalesce((select value from app_settings where key = 'email_key_alerts'), 'false') <> 'true' then return new; end if;
  if new.title not in ('Clearance complete', 'Clearance returned', 'Hostel allocated', 'Hostel waitlist', 'Bed swapped') then return new; end if;
  select email, email_alerts into em, ok from profiles where id = new.user_id;
  if ok and coalesce(em, '') <> '' then
    insert into outbound_messages(channel, user_id, to_address, subject, body) values ('email', new.user_id, em, new.title, coalesce(new.body, new.title));
  end if;
  return new;
end $$;
create trigger notifications_key_alert after insert on notifications for each row execute function queue_key_alert();
