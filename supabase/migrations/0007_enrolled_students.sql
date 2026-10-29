-- Official list of enrolled students (imported by the Dean's office). Sign-up is checked against it.
create table enrolled_students (
  matric_no text primary key, full_name text not null, email text,
  gender text check (gender in ('male','female')), faculty text, department text, level int,
  is_fresh boolean default false, is_final_year boolean default false,
  claimed_by uuid references profiles on delete set null, created_at timestamptz default now()
);
alter table enrolled_students enable row level security;
create policy staff_enrolled on enrolled_students for all using (has_role('dean_office')) with check (has_role('dean_office'));

-- Anyone can ask "may this matric number register with this email?" and get only a reason code back.
create function check_registration(p_matric text, p_email text) returns text language plpgsql security definer set search_path = public as $$
declare e enrolled_students;
begin
  select * into e from enrolled_students where matric_no = upper(trim(p_matric));
  if e.matric_no is null then return 'unknown'; end if;
  if e.claimed_by is not null then return 'claimed'; end if;
  if e.email is not null and lower(e.email) <> lower(trim(p_email)) then return 'email_mismatch'; end if;
  return 'ok';
end $$;
grant execute on function check_registration(text, text) to anon, authenticated;

-- New accounts take their details from the enrolled list when the matric number (and email, if on record) match.
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare e enrolled_students; m text := upper(trim(new.raw_user_meta_data->>'matric_no'));
begin
  select * into e from enrolled_students where matric_no = m and claimed_by is null and (email is null or lower(email) = lower(new.email));
  insert into profiles(id, full_name, email, matric_no, gender, faculty, department, level, is_fresh, is_final_year)
  values (new.id, coalesce(e.full_name, new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email, e.matric_no, e.gender, e.faculty, e.department, e.level, coalesce(e.is_fresh, false), coalesce(e.is_final_year, false))
  on conflict (id) do nothing;
  if e.matric_no is not null then update enrolled_students set claimed_by = new.id where matric_no = e.matric_no; end if;
  insert into user_roles(user_id, role) values (new.id, 'student') on conflict do nothing;
  return new;
end $$;
