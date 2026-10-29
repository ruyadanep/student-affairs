-- Welfare and support: counselling appointments, special-needs support, complaints, hardship requests.
-- Access is by kind: counselling and special-needs records are visible to welfare officers only.
-- The Dean's office also sees complaints and hardship requests.
create table support_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles default auth.uid(),
  kind text not null check (kind in ('counselling','special_needs','complaint','hardship')),
  subject text not null check (char_length(subject) between 1 and 150),
  details text not null check (char_length(details) between 1 and 4000),
  preferred_times text check (char_length(preferred_times) <= 300),
  status text not null check (status in ('submitted','in_review','scheduled','resolved','closed')) default 'submitted',
  scheduled_at timestamptz, assigned_to uuid references profiles, resolution_note text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table support_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references support_requests on delete cascade,
  author_id uuid not null references profiles default auth.uid(),
  body text not null check (char_length(body) between 1 and 3000), created_at timestamptz default now()
);
alter table support_requests enable row level security;
alter table support_messages enable row level security;

create function can_access_support(p_request uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from support_requests s where s.id = p_request and (
    s.student_id = auth.uid() or has_role('welfare_officer') or (s.kind in ('complaint','hardship') and has_role('dean_office'))))
$$;
create policy read_support on support_requests for select using (student_id = auth.uid() or has_role('welfare_officer') or (kind in ('complaint','hardship') and has_role('dean_office')));
create policy add_support on support_requests for insert with check (student_id = auth.uid() and status = 'submitted');
create policy staff_support on support_requests for update using (has_role('welfare_officer') or (kind in ('complaint','hardship') and has_role('dean_office')));
create policy read_support_msgs on support_messages for select using (can_access_support(request_id));
create policy add_support_msg on support_messages for insert with check (author_id = auth.uid() and can_access_support(request_id));

-- Audit log records only the category and status, never the student's words.
create function audit_support_change() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into audit_log(action, entity, entity_id, meta)
  values (tg_op, 'support_requests', new.id::text, jsonb_build_object('kind', new.kind, 'status', new.status, 'scheduled_at', new.scheduled_at));
  return new;
end $$;
create trigger audit_support after update on support_requests for each row execute function audit_support_change();
