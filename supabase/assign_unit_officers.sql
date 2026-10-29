-- Give a staff account the clearance role and link it to one directorate unit.
-- 1. Create the person first: Supabase > Authentication > Users > Add user (tick Auto Confirm User).
-- 2. Edit the email and unit name below, then run. Repeat for each unit (one block per person).
-- Units: Accommodation Unit, Identity Card Unit, Sports Unit, Guidance and Counselling Unit, NYSC Unit, Record Unit

with p as (select id from profiles where lower(email) = lower('officer@plasu.edu.ng')),
     r as (insert into user_roles(user_id, role) select id, 'clearance_officer' from p on conflict do nothing returning 1)
insert into unit_officers(user_id, unit_id)
select p.id, u.id from p, clearance_units u where u.name = 'Accommodation Unit'
on conflict do nothing;

-- Check: who is linked to which unit
select u.name as unit, pr.full_name, pr.email
from unit_officers uo join clearance_units u on u.id = uo.unit_id join profiles pr on pr.id = uo.user_id
order by u.sequence;
