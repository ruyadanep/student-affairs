-- Student Affairs Platform: Phase 1 schema
create extension if not exists pgcrypto;

create type app_role as enum ('student','hostel_officer','clearance_officer','org_officer','welfare_officer','dean_office','super_admin');
create type request_status as enum ('draft','submitted','under_review','approved','rejected','returned','cancelled');

-- People ------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  matric_no text unique, full_name text not null, email text, phone text,
  gender text check (gender in ('male','female')),
  faculty text, department text, level int,
  is_fresh boolean default false, is_final_year boolean default false,
  priority_category text check (priority_category in ('none','medical','union_leader','other')) default 'none',
  created_at timestamptz default now()
);
create table user_roles (
  user_id uuid references profiles on delete cascade, role app_role not null,
  primary key (user_id, role)
);
create function has_role(r app_role) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from user_roles where user_id = auth.uid() and role in (r,'super_admin')) $$;
create function is_staff() returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from user_roles where user_id = auth.uid() and role <> 'student') $$;

-- Audit ---------------------------------------------------------------
create table audit_log (
  id bigserial primary key, actor uuid default auth.uid(), action text not null,
  entity text not null, entity_id text, meta jsonb, created_at timestamptz default now()
);
create function audit_change() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into audit_log(action, entity, entity_id, meta)
  values (tg_op, tg_table_name, coalesce(new.id::text, old.id::text), to_jsonb(coalesce(new, old)));
  return coalesce(new, old);
end $$;

-- Hostels ---------------------------------------------------------------
create table hostels (
  id uuid primary key default gen_random_uuid(), name text not null unique,
  gender text check (gender in ('male','female','mixed')) not null, fee numeric(12,2), active boolean default true
);
create table rooms (
  id uuid primary key default gen_random_uuid(), hostel_id uuid not null references hostels on delete cascade,
  block text, room_no text not null, unique (hostel_id, block, room_no)
);
create table bed_spaces (
  id uuid primary key default gen_random_uuid(), room_id uuid not null references rooms on delete cascade,
  label text not null, unique (room_id, label)
);
create table hostel_sessions (
  id uuid primary key default gen_random_uuid(), academic_session text unique not null,
  opens_at timestamptz, closes_at timestamptz, fresh_and_final_only boolean default false, is_current boolean default false
);
-- Payment status mirrored from plasu.edu.ng (this platform never collects money)
create table payment_records (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references profiles,
  academic_session text not null, reference text not null, amount numeric(12,2),
  status text not null check (status in ('pending_check','verified','rejected','reversed')) default 'pending_check',
  source text not null check (source in ('api','manual')) default 'manual',
  verified_by uuid references profiles, verified_at timestamptz, created_at timestamptz default now(),
  unique (reference)
);
create table hostel_applications (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references profiles,
  session_id uuid not null references hostel_sessions, payment_id uuid references payment_records,
  preference_1 uuid references hostels, preference_2 uuid references hostels,
  status text not null check (status in ('draft','submitted','eligible','allocated','waitlisted','rejected')) default 'draft',
  reason text, created_at timestamptz default now(), unique (student_id, session_id)
);
create table allocations (
  id uuid primary key default gen_random_uuid(), application_id uuid not null references hostel_applications,
  bed_space_id uuid not null references bed_spaces, status text not null check (status in ('active','vacated','revoked')) default 'active',
  allocated_by uuid default auth.uid(), checked_in_at timestamptz, checked_out_at timestamptz, created_at timestamptz default now()
);
create unique index one_active_allocation_per_bed on allocations (bed_space_id) where status = 'active';
create unique index one_active_allocation_per_application on allocations (application_id) where status = 'active';
create table room_change_requests (
  id uuid primary key default gen_random_uuid(), allocation_id uuid not null references allocations,
  reason text not null, status request_status default 'submitted', decided_by uuid references profiles, created_at timestamptz default now()
);
create table maintenance_tickets (
  id uuid primary key default gen_random_uuid(), reporter_id uuid not null references profiles default auth.uid(),
  hostel_id uuid references hostels, room_id uuid references rooms, category text not null,
  description text not null, status text not null check (status in ('open','assigned','in_progress','resolved','closed')) default 'open',
  assigned_to uuid references profiles, created_at timestamptz default now(), resolved_at timestamptz
);
create table ticket_comments (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references maintenance_tickets on delete cascade,
  author_id uuid not null references profiles default auth.uid(), body text not null, created_at timestamptz default now()
);

-- Clearance ---------------------------------------------------------------
create table clearance_units (
  id uuid primary key default gen_random_uuid(), name text not null unique, sequence int not null, officer_role app_role not null default 'clearance_officer'
);
create table clearance_requests (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references profiles default auth.uid(),
  academic_session text not null, status text not null check (status in ('in_progress','cleared','returned')) default 'in_progress',
  created_at timestamptz default now(), cleared_at timestamptz, unique (student_id, academic_session)
);
create table clearance_steps (
  id uuid primary key default gen_random_uuid(), request_id uuid not null references clearance_requests on delete cascade,
  unit_id uuid not null references clearance_units, status text not null check (status in ('pending','approved','returned')) default 'pending',
  reason text, officer_id uuid references profiles, acted_at timestamptz, unique (request_id, unit_id)
);

-- Student organisations -------------------------------------------------
create table organisations (
  id uuid primary key default gen_random_uuid(), name text not null unique, category text, description text,
  submitted_by uuid references profiles default auth.uid(), status request_status default 'submitted',
  reviewed_by uuid references profiles, review_note text, created_at timestamptz default now()
);
create table organisation_members (
  organisation_id uuid references organisations on delete cascade, student_id uuid references profiles on delete cascade,
  position text default 'member', primary key (organisation_id, student_id)
);

-- Letters and attestations (QR verified) ------------------------------
create table document_requests (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references profiles default auth.uid(),
  doc_type text not null check (doc_type in ('good_standing','character_reference','attestation','other')),
  purpose text not null, addressee text, status request_status default 'submitted',
  verification_code text unique, pdf_path text, decided_by uuid references profiles,
  issued_at timestamptz, created_at timestamptz default now()
);

-- Targeted notifications ---------------------------------------------------
create table announcements (
  id uuid primary key default gen_random_uuid(), title text not null, body text not null,
  audience jsonb not null default '{"all":true}',  -- e.g. {"hostel_ids":[..],"levels":[100],"faculties":[".."]}
  channels text[] not null default '{in_app}', created_by uuid references profiles default auth.uid(), published_at timestamptz
);
create table notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles on delete cascade,
  announcement_id uuid references announcements on delete set null, title text not null, body text, read_at timestamptz, created_at timestamptz default now()
);

-- Audit triggers on decisions that must be traceable
create trigger audit_alloc after insert or update on allocations for each row execute function audit_change();
create trigger audit_payment after insert or update on payment_records for each row execute function audit_change();
create trigger audit_steps after update on clearance_steps for each row execute function audit_change();
create trigger audit_docs after update on document_requests for each row execute function audit_change();
create trigger audit_orgs after update on organisations for each row execute function audit_change();

-- Public QR verification: exposes only what a verifier needs
create function verify_document(code text) returns table (doc_type text, student_name text, issued_at timestamptz, valid boolean)
language sql stable security definer set search_path = public as $$
  select d.doc_type, p.full_name, d.issued_at, (d.status = 'approved')
  from document_requests d join profiles p on p.id = d.student_id where d.verification_code = code
$$;
grant execute on function verify_document(text) to anon, authenticated;

-- Row-level security ---------------------------------------------------------
do $$ declare t text; begin
  for t in select unnest(array['profiles','user_roles','audit_log','hostels','rooms','bed_spaces','hostel_sessions','payment_records','hostel_applications','allocations','room_change_requests','maintenance_tickets','ticket_comments','clearance_units','clearance_requests','clearance_steps','organisations','organisation_members','document_requests','announcements','notifications'])
  loop execute format('alter table %I enable row level security', t); end loop;
end $$;

-- Reference data
create policy read_hostels on hostels for select using (true);
create policy read_sessions on hostel_sessions for select using (true);
create policy read_units on clearance_units for select using (true);
create policy read_orgs on organisations for select using (status = 'approved' or submitted_by = auth.uid() or is_staff());
create policy staff_hostels on hostels for all using (has_role('hostel_officer') or has_role('dean_office')) with check (has_role('hostel_officer') or has_role('dean_office'));
create policy staff_rooms on rooms for all using (has_role('hostel_officer') or has_role('dean_office')) with check (has_role('hostel_officer') or has_role('dean_office'));
create policy read_rooms on rooms for select using (auth.uid() is not null);
create policy staff_beds on bed_spaces for all using (has_role('hostel_officer') or has_role('dean_office')) with check (has_role('hostel_officer') or has_role('dean_office'));
create policy read_beds on bed_spaces for select using (auth.uid() is not null);
create policy staff_sessions on hostel_sessions for all using (has_role('hostel_officer') or has_role('dean_office')) with check (has_role('hostel_officer') or has_role('dean_office'));
create policy admin_units on clearance_units for all using (has_role('dean_office')) with check (has_role('dean_office'));

-- Profiles and roles
create policy own_profile on profiles for select using (id = auth.uid() or is_staff());
create policy edit_own_profile on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy own_roles on user_roles for select using (user_id = auth.uid() or has_role('dean_office'));
create policy admin_roles on user_roles for all using (has_role('super_admin')) with check (has_role('super_admin'));

-- Hostel workflow
create policy own_payments on payment_records for select using (student_id = auth.uid() or has_role('hostel_officer') or has_role('dean_office'));
create policy add_payment on payment_records for insert with check (student_id = auth.uid() and status = 'pending_check' and source = 'manual');
create policy staff_payments on payment_records for update using (has_role('hostel_officer') or has_role('dean_office'));
create policy own_apps on hostel_applications for select using (student_id = auth.uid() or has_role('hostel_officer') or has_role('dean_office'));
create policy add_app on hostel_applications for insert with check (student_id = auth.uid() and status in ('draft','submitted'));
create policy edit_app on hostel_applications for update using ((student_id = auth.uid() and status in ('draft','submitted')) or has_role('hostel_officer'));
create policy own_alloc on allocations for select using (exists (select 1 from hostel_applications a where a.id = application_id and a.student_id = auth.uid()) or has_role('hostel_officer') or has_role('dean_office'));
create policy staff_alloc on allocations for all using (has_role('hostel_officer')) with check (has_role('hostel_officer'));
create policy own_rcr on room_change_requests for select using (exists (select 1 from allocations l join hostel_applications a on a.id = l.application_id where l.id = allocation_id and a.student_id = auth.uid()) or has_role('hostel_officer'));
create policy add_rcr on room_change_requests for insert with check (exists (select 1 from allocations l join hostel_applications a on a.id = l.application_id where l.id = allocation_id and a.student_id = auth.uid()));
create policy staff_rcr on room_change_requests for update using (has_role('hostel_officer'));
create policy own_tickets on maintenance_tickets for select using (reporter_id = auth.uid() or has_role('hostel_officer'));
create policy add_ticket on maintenance_tickets for insert with check (reporter_id = auth.uid());
create policy staff_tickets on maintenance_tickets for update using (has_role('hostel_officer'));
create policy ticket_thread on ticket_comments for select using (exists (select 1 from maintenance_tickets t where t.id = ticket_id and (t.reporter_id = auth.uid() or has_role('hostel_officer'))));
create policy add_comment on ticket_comments for insert with check (author_id = auth.uid() and exists (select 1 from maintenance_tickets t where t.id = ticket_id and (t.reporter_id = auth.uid() or has_role('hostel_officer'))));

-- Clearance
create policy own_clearance on clearance_requests for select using (student_id = auth.uid() or has_role('clearance_officer') or has_role('dean_office'));
create policy start_clearance on clearance_requests for insert with check (student_id = auth.uid());
create policy staff_clearance on clearance_requests for update using (has_role('clearance_officer') or has_role('dean_office'));
create policy own_steps on clearance_steps for select using (exists (select 1 from clearance_requests r where r.id = request_id and r.student_id = auth.uid()) or has_role('clearance_officer') or has_role('dean_office'));
create policy officer_steps on clearance_steps for update using (has_role('clearance_officer')) with check (has_role('clearance_officer'));

-- Organisations
create policy submit_org on organisations for insert with check (submitted_by = auth.uid() and status = 'submitted');
create policy review_org on organisations for update using (has_role('org_officer') or has_role('dean_office'));
create policy read_members on organisation_members for select using (auth.uid() is not null);
create policy join_org on organisation_members for insert with check (student_id = auth.uid());

-- Documents
create policy own_docs on document_requests for select using (student_id = auth.uid() or is_staff());
create policy request_doc on document_requests for insert with check (student_id = auth.uid() and status = 'submitted');
create policy decide_docs on document_requests for update using (has_role('dean_office') or has_role('welfare_officer'));

-- Notifications
create policy read_announcements on announcements for select using (published_at is not null or is_staff());
create policy write_announcements on announcements for all using (has_role('dean_office') or has_role('hostel_officer')) with check (has_role('dean_office') or has_role('hostel_officer'));
create policy own_notifs on notifications for select using (user_id = auth.uid());
create policy mark_read on notifications for update using (user_id = auth.uid());

-- Audit log: dean's office can read; nobody writes through the API
create policy read_audit on audit_log for select using (has_role('dean_office'));
