-- Students can leave an organisation they joined
create policy leave_org on organisation_members for delete using (student_id = auth.uid());
