-- Dieses Skript einmalig im Supabase SQL-Editor ausführen (siehe README.md).
-- Es legt zwei Tabellen an: eine für die Schüler-Namen und eine für den
-- Lernfortschritt pro Schüler und Frage (Leitner-System).

create extension if not exists "pgcrypto";

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  password_hash text,
  created_at timestamptz not null default now()
);

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  question_id text not null,
  level int not null default 1 check (level between 1 and 5),
  times_correct int not null default 0,
  times_wrong int not null default 0,
  last_reviewed_at timestamptz,
  unique (student_id, question_id)
);

-- Row Level Security aktivieren. Der Login prüft zwar jetzt ein Passwort
-- (siehe unten), aber "progress" bleibt bewusst offen für alle: es gibt
-- keine Sitzung/Token, das eine Anfrage serverseitig einem bestimmten
-- Schüler zuordnet, die App vertraut der student_id aus dem Browser. Für
-- eine interne Übungs-App unter Azubis (keine echten Patientendaten) ist
-- das okay, aber bewusst KEINE hochsichere Lösung.
alter table students enable row level security;
alter table progress enable row level security;

create policy "public read/write students" on students
  for all using (true) with check (true);

create policy "public read/write progress" on progress
  for all using (true) with check (true);

-- Der Login (Name + Passwort, Account anlegen) läuft ausschließlich über
-- die App-eigene API-Route mit dem Service-Role-Key, der Row Level Security
-- umgeht - der normale Anon-Key braucht auf "students" nur noch Lesezugriff
-- (fürs Anzeigen im PAL-Bereich), und zwar OHNE die Passwort-Spalte. Ohne
-- diese Einschränkung könnte sonst jeder im Browser per Konsole
-- "supabase.from('students').select('password_hash')" aufrufen und die
-- Hashes einsehen.
revoke select, insert, update, delete on students from anon, authenticated;
grant select (id, name, created_at) on students to anon, authenticated;
