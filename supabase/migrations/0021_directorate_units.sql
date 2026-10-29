-- The six units of the Student Affairs directorate as clearance units.
-- Run on its own after 0020. Safe to re-run.
-- ORDER BELOW IS A PROPOSAL: clearance runs in this sequence, so change the numbers if the Dean wants a different order.

insert into clearance_units(name, sequence) values
  ('Accommodation Unit', 1),
  ('Identity Card Unit', 2),
  ('Sports Unit', 3),
  ('Guidance and Counselling Unit', 4),
  ('NYSC Unit', 5),
  ('Record Unit', 6)
on conflict (name) do update set sequence = excluded.sequence;

-- Remove the old example units (Department, Library, Bursary, Hostel office, Student Affairs) ONLY if no clearance
-- request has used them. Units already used by a request are left alone and listed by the query below.
delete from clearance_units u
where u.name in ('Department', 'Library', 'Bursary', 'Hostel office', 'Student Affairs')
  and not exists (select 1 from clearance_steps s where s.unit_id = u.id);

-- Check: should show exactly your six units (plus any old unit that could not be removed).
select name, sequence from clearance_units order by sequence;
