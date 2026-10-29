-- Private bucket for issued letters. The app reads and writes it with the service role after checking permissions.
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict (id) do nothing;
