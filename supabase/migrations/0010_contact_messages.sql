-- Public contact form messages
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  topic text check (char_length(topic) <= 80),
  message text not null check (char_length(message) between 1 and 3000),
  handled boolean default false, created_at timestamptz default now()
);
alter table contact_messages enable row level security;
create policy send_message on contact_messages for insert with check (handled = false);
create policy read_messages on contact_messages for select using (has_role('dean_office'));
create policy handle_messages on contact_messages for update using (has_role('dean_office'));
