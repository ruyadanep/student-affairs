-- Staff can notify students about decisions on their requests
create policy staff_notify on notifications for insert with check (is_staff());
