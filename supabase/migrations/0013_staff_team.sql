-- Public team page: staff bios and photos. Photos live in a public bucket; bios are shown only when published.
create table staff_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references profiles on delete set null,
  full_name text not null check (char_length(full_name) between 1 and 120),
  title text check (char_length(title) <= 120), unit text check (char_length(unit) <= 120),
  bio text check (char_length(bio) <= 2500),
  email text check (char_length(email) <= 200), phone text check (char_length(phone) <= 40),
  photo_path text, sort_order int not null default 100, published boolean not null default false,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table staff_members enable row level security;
create policy read_team on staff_members for select using (published or has_role('dean_office') or user_id = auth.uid());
create policy admin_team on staff_members for all using (has_role('dean_office')) with check (has_role('dean_office'));
create policy self_team on staff_members for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Photos are resized and converted to WebP by the app before upload (max 1 MB here as a second safeguard).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('staff-photos', 'staff-photos', true, 1048576, array['image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
