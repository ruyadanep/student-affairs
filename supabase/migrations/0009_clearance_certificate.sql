-- Clearance certificates: a verification code is created automatically when a student becomes fully cleared.
alter table clearance_requests add column verification_code text unique;

create function set_clearance_code() returns trigger language plpgsql as $$
begin
  if new.status = 'cleared' and new.verification_code is null then
    new.verification_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
  end if;
  return new;
end $$;
create trigger clearance_code before update on clearance_requests for each row execute function set_clearance_code();

-- Backfill students who were already cleared (the update fires the trigger)
update clearance_requests set status = status where status = 'cleared' and verification_code is null;

-- The public QR check now covers letters and clearance certificates
create or replace function verify_document(code text) returns table (doc_type text, student_name text, issued_at timestamptz, valid boolean)
language sql stable security definer set search_path = public as $$
  select d.doc_type, p.full_name, d.issued_at, (d.status = 'approved')
  from document_requests d join profiles p on p.id = d.student_id where d.verification_code = code
  union all
  select 'clearance'::text, p.full_name, c.cleared_at, (c.status = 'cleared')
  from clearance_requests c join profiles p on p.id = c.student_id where c.verification_code = code
$$;
