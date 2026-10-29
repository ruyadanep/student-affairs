-- Targeted announcements. Recipients are worked out and notified inside the database in one step.
drop policy if exists read_announcements on announcements;
create policy read_announcements on announcements for select using (is_staff());  -- students read their own notifications instead

create function announcement_recipients(p_hostels uuid[], p_levels int[], p_faculties text[]) returns setof uuid
language sql stable security definer set search_path = public as $$
  select p.id from profiles p
  where (has_role('dean_office') or has_role('hostel_officer'))
    and exists (select 1 from user_roles r where r.user_id = p.id and r.role = 'student')
    and (coalesce(cardinality(p_levels), 0) = 0 or p.level = any(p_levels))
    and (coalesce(cardinality(p_faculties), 0) = 0 or p.faculty = any(p_faculties))
    and (coalesce(cardinality(p_hostels), 0) = 0 or exists (
      select 1 from allocations al
      join hostel_applications ha on ha.id = al.application_id
      join bed_spaces b on b.id = al.bed_space_id
      join rooms rm on rm.id = b.room_id
      where al.status = 'active' and ha.student_id = p.id and rm.hostel_id = any(p_hostels)))
$$;

create function count_announcement_recipients(p_hostels uuid[], p_levels int[], p_faculties text[]) returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from announcement_recipients(p_hostels, p_levels, p_faculties)
$$;

create function send_announcement(p_title text, p_body text, p_hostels uuid[], p_levels int[], p_faculties text[]) returns int
language plpgsql security definer set search_path = public as $$
declare aid uuid; n int;
begin
  if not (has_role('dean_office') or has_role('hostel_officer')) then raise exception 'You cannot send announcements.'; end if;
  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_body), '') = '' then raise exception 'Enter a title and a message.'; end if;
  insert into announcements(title, body, audience, channels, created_by, published_at)
  values (trim(p_title), trim(p_body),
    jsonb_build_object('hostel_ids', to_jsonb(coalesce(p_hostels, '{}'::uuid[])), 'levels', to_jsonb(coalesce(p_levels, '{}'::int[])), 'faculties', to_jsonb(coalesce(p_faculties, '{}'::text[]))),
    '{in_app}', auth.uid(), now()) returning id into aid;
  insert into notifications(user_id, announcement_id, title, body)
  select x, aid, trim(p_title), trim(p_body) from announcement_recipients(p_hostels, p_levels, p_faculties) x;
  get diagnostics n = row_count;
  return n;
end $$;

grant execute on function announcement_recipients(uuid[], int[], text[]) to authenticated;
grant execute on function count_announcement_recipients(uuid[], int[], text[]) to authenticated;
grant execute on function send_announcement(text, text, uuid[], int[], text[]) to authenticated;
