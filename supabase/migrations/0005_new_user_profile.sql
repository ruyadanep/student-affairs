-- Every new sign-up gets a profile and the student role automatically.
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles(id, full_name, email, matric_no)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email, new.raw_user_meta_data->>'matric_no')
  on conflict (id) do nothing;
  insert into user_roles(user_id, role) values (new.id, 'student') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- Backfill accounts created before this trigger existed
insert into profiles(id, full_name, email) select id, split_part(email, '@', 1), email from auth.users on conflict (id) do nothing;
insert into user_roles(user_id, role) select id, 'student' from profiles on conflict do nothing;

-- Make yourself the first super admin (replace the email, then run once):
-- insert into user_roles(user_id, role) select id, 'super_admin' from profiles where email = 'you@example.com' on conflict do nothing;
