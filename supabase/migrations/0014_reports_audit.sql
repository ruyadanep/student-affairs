-- Reports and audit tools. Reports are computed inside the database so staff see totals, not other people's records.

-- Staff actions that are not table updates (exports, role changes) are recorded through this.
create or replace function log_event(p_action text, p_entity text, p_meta jsonb default '{}') returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_staff() then raise exception 'Staff only.'; end if;
  insert into audit_log(action, entity, entity_id, meta) values (p_action, p_entity, null, coalesce(p_meta, '{}'));
end $$;
grant execute on function log_event(text, text, jsonb) to authenticated;

create or replace function report_overview() returns jsonb language plpgsql stable security definer set search_path = public as $$
declare cur_id uuid; cur_session text; result jsonb;
begin
  if not (has_role('dean_office') or has_role('hostel_officer')) then raise exception 'You cannot view reports.'; end if;
  select id, academic_session into cur_id, cur_session from hostel_sessions where is_current limit 1;
  result := jsonb_build_object(
    'session', cur_session,
    'occupancy', (select coalesce(jsonb_agg(jsonb_build_object('name', h.name, 'gender', h.gender,
        'beds', (select count(*) from bed_spaces b join rooms r on r.id = b.room_id where r.hostel_id = h.id),
        'occupied', (select count(*) from allocations a join bed_spaces b on b.id = a.bed_space_id join rooms r on r.id = b.room_id where r.hostel_id = h.id and a.status = 'active')) order by h.name), '[]'::jsonb)
      from hostels h where h.active),
    'pipeline', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) from (select status, count(*) n from hostel_applications where session_id = cur_id group by status) p),
    'avg_days_to_allocation', (select round(avg(extract(epoch from (al.created_at - ha.created_at)) / 86400)::numeric, 1) from allocations al join hostel_applications ha on ha.id = al.application_id where ha.session_id = cur_id),
    'clearance', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) from (select status, count(*) n from clearance_requests where academic_session = cur_session group by status) c),
    'clearance_units', (select coalesce(jsonb_agg(jsonb_build_object('name', cu.name,
        'pending', (select count(*) from clearance_steps s join clearance_requests r on r.id = s.request_id where s.unit_id = cu.id and s.status = 'pending' and r.academic_session = cur_session),
        'avg_days', (select round(avg(extract(epoch from (s.acted_at - r.created_at)) / 86400)::numeric, 1) from clearance_steps s join clearance_requests r on r.id = s.request_id where s.unit_id = cu.id and s.status = 'approved' and r.academic_session = cur_session)) order by cu.sequence), '[]'::jsonb)
      from clearance_units cu),
    'letters', jsonb_build_object(
      'by_status', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) from (select status, count(*) n from document_requests group by status) l),
      'avg_hours_to_issue', (select round(avg(extract(epoch from (issued_at - created_at)) / 3600)::numeric, 1) from document_requests where status = 'approved' and issued_at is not null)),
    'tickets', jsonb_build_object(
      'by_status', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) from (select status, count(*) n from maintenance_tickets group by status) t),
      'open_by_category', (select coalesce(jsonb_object_agg(category, n), '{}'::jsonb) from (select category, count(*) n from maintenance_tickets where status in ('open','assigned','in_progress') group by category) c),
      'avg_days_to_fix', (select round(avg(extract(epoch from (resolved_at - created_at)) / 86400)::numeric, 1) from maintenance_tickets where resolved_at is not null)),
    'adoption', jsonb_build_object(
      'total', (select count(*) from enrolled_students), 'registered', (select count(*) from enrolled_students where claimed_by is not null),
      'by_faculty', (select coalesce(jsonb_agg(jsonb_build_object('faculty', f, 'total', n, 'registered', reg) order by f), '[]'::jsonb)
        from (select coalesce(faculty, 'Not recorded') f, count(*) n, count(*) filter (where claimed_by is not null) reg from enrolled_students group by 1) x)),
    -- Welfare numbers are counts only, and any group smaller than 5 is hidden so no one can be identified.
    'support', case when has_role('dean_office') or has_role('welfare_officer') then
      (select coalesce(jsonb_agg(jsonb_build_object('kind', kind, 'total', case when n < 5 then null else n end, 'resolved', case when n < 5 then null else resolved end)), '[]'::jsonb)
       from (select kind, count(*) n, count(*) filter (where status in ('resolved','closed')) resolved from support_requests group by kind) k) else null end
  );
  return result;
end $$;
grant execute on function report_overview() to authenticated;
