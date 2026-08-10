-- Einmalig im Supabase SQL-Editor ausführen, wenn die App VOR der
-- Passwort-Einführung schon eingerichtet war (die "students"-Tabelle also
-- schon existiert). Fügt die Passwort-Spalte hinzu und schränkt den
-- Lesezugriff darauf ein - siehe Kommentare in supabase/schema.sql.

alter table students add column if not exists password_hash text;

revoke select, insert, update, delete on students from anon, authenticated;
grant select (id, name, created_at) on students to anon, authenticated;
