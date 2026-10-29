-- Run this in the Supabase SQL editor. Every row should say "ok". Any "MISSING" row tells you which migration to run.
select migration, case when exists_ then 'ok' else 'MISSING' end as status from (values
  ('0014 reports_audit',   to_regproc('public.log_event') is not null),
  ('0015 security_ops',    to_regclass('public.app_settings') is not null),
  ('0016 operations',      to_regproc('public.auto_allocate') is not null),
  ('0017 messaging',       to_regclass('public.outbound_messages') is not null),
  ('0018 events_elections',to_regclass('public.elections') is not null),
  ('0019 discipline',      to_regclass('public.discipline_cases') is not null),
  ('0020 security_privacy',to_regclass('public.login_events') is not null)
) as t(migration, exists_)
union all
select '0021 units: ' || count(*) || ' of 6 present', case when count(*) = 6 then 'ok' else 'MISSING' end
from clearance_units where name in ('Accommodation Unit','Guidance and Counselling Unit','Identity Card Unit','NYSC Unit','Record Unit','Sports Unit');
