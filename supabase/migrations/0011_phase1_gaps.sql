-- Room changes, and resubmitting a returned clearance step
alter table room_change_requests add column decision_note text;

create function decide_room_change(p_id uuid, p_approve boolean, p_note text default null) returns void
language plpgsql security definer set search_path = public as $$
declare r room_change_requests; a allocations; app hostel_applications;
begin
  if not has_role('hostel_officer') then raise exception 'You cannot decide room changes.'; end if;
  select * into r from room_change_requests where id = p_id and status = 'submitted';
  if r.id is null then raise exception 'This request was already decided.'; end if;
  if not p_approve and coalesce(trim(p_note), '') = '' then raise exception 'Give a reason for rejecting.'; end if;
  select * into a from allocations where id = r.allocation_id;
  select * into app from hostel_applications where id = a.application_id;
  update room_change_requests set status = case when p_approve then 'approved'::request_status else 'rejected'::request_status end, decided_by = auth.uid(), decision_note = p_note where id = p_id;
  if p_approve then
    update allocations set status = 'vacated' where id = a.id;
    update hostel_applications set status = 'eligible', reason = 'Room change approved. Waiting for a new room.' where id = app.id;
    insert into notifications(user_id, title, body) values (app.student_id, 'Room change approved', 'Your current bed has been released. The hostel office will place you in a new room.');
  else
    insert into notifications(user_id, title, body) values (app.student_id, 'Room change not approved', p_note);
  end if;
end $$;
grant execute on function decide_room_change(uuid, boolean, text) to authenticated;

create function resubmit_clearance_step(p_step uuid) returns void language plpgsql security definer set search_path = public as $$
declare s clearance_steps; r clearance_requests;
begin
  select * into s from clearance_steps where id = p_step and status = 'returned';
  if s.id is null then raise exception 'Nothing to resubmit.'; end if;
  select * into r from clearance_requests where id = s.request_id;
  if r.student_id <> auth.uid() then raise exception 'This is not your clearance.'; end if;
  update clearance_steps set status = 'pending', reason = null, officer_id = null, acted_at = null where id = p_step;
  update clearance_requests set status = 'in_progress' where id = r.id;
end $$;
grant execute on function resubmit_clearance_step(uuid) to authenticated;
