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

-- Freies Feedback (z. B. für einen Usertest). Jeder darf welches abschicken,
-- aber NICHT das Feedback anderer lesen - sonst könnte jeder im Browser
-- fremdes (ggf. anonymes) Feedback einsehen. Der PAL-Bereich liest es über
-- /api/pal/feedback mit dem Service-Role-Key, der Row Level Security umgeht.
create table if not exists feedback_responses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete set null,
  student_name text,
  is_anonymous boolean not null default false,
  message text not null,
  created_at timestamptz not null default now()
);

alter table feedback_responses enable row level security;

create policy "public insert feedback" on feedback_responses
  for insert with check (true);

revoke select, update, delete on feedback_responses from anon, authenticated;
grant insert on feedback_responses to anon, authenticated;

-- "The Brain"-Modus: Punktestand pro Runde. Jeder darf einen Score
-- einfügen und alle Scores lesen (fürs Leaderboard) - anders als bei
-- Passwörtern/Feedback gibt es hier keine sensiblen Daten, ein falscher
-- Score schadet niemandem außer der Bestenliste selbst.
-- "week_key" wird von Postgres automatisch aus dem Einfüge-Zeitpunkt
-- berechnet (ISO-Kalenderwoche, z. B. "2026-W33") und bleibt dauerhaft an
-- der Zeile - so bleiben alte Wochen im Hintergrund erhalten, falls es
-- später mal ein Archiv geben soll. Welche Woche gerade "aktuell" ist,
-- wird beim Anzeigen des Leaderboards separat berechnet (siehe
-- lib/weekRange.js), nicht über einen Textvergleich mit week_key.
create table if not exists brain_scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete set null,
  student_name text not null,
  score int not null check (score >= 0 and score <= 450),
  created_at timestamptz not null default now(),
  week_key text generated always as (to_char(created_at, 'IYYY-"W"IW')) stored
);

create index if not exists brain_scores_created_idx on brain_scores (created_at);

alter table brain_scores enable row level security;

create policy "public insert brain_scores" on brain_scores
  for insert with check (true);

create policy "public read brain_scores" on brain_scores
  for select using (true);

revoke update, delete on brain_scores from anon, authenticated;
