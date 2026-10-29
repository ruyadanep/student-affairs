-- TEST DATA ONLY. Run after all migrations. Safe to run twice. Remove with the cleanup block in TESTING.md.
insert into hostel_sessions(academic_session, opens_at, closes_at, is_current)
values ('2026/2027', now() - interval '1 day', now() + interval '30 days', true)
on conflict (academic_session) do update set is_current = true, opens_at = excluded.opens_at, closes_at = excluded.closes_at;

insert into hostels(name, gender, fee) values ('Test Hall A', 'male', 50000), ('Test Hall B', 'female', 50000) on conflict (name) do nothing;
insert into rooms(hostel_id, block, room_no)
  select h.id, 'A', n::text from hostels h, generate_series(1, 10) n where h.name in ('Test Hall A', 'Test Hall B')
  on conflict do nothing;
insert into bed_spaces(room_id, label)
  select r.id, l from rooms r, unnest(array['A', 'B', 'C', 'D']) l
  where r.hostel_id in (select id from hostels where name in ('Test Hall A', 'Test Hall B'))
  on conflict do nothing;

insert into clearance_units(name, sequence) values ('Department', 1), ('Library', 2), ('Bursary', 3), ('Hostel office', 4), ('Student Affairs', 5) on conflict (name) do nothing;

insert into enrolled_students(matric_no, full_name, gender, faculty, department, level, is_fresh, is_final_year) values
  ('PLASU/TEST/0001', 'Test Student One', 'male', 'Natural and Applied Sciences', 'Computer Science', 200, true, false),
  ('PLASU/TEST/0002', 'Test Student Two', 'female', 'Natural and Applied Sciences', 'Biology', 200, true, false),
  ('PLASU/TEST/0003', 'Test Student Three', 'male', 'Management Sciences', 'Accounting', 400, false, true)
on conflict (matric_no) do nothing;
