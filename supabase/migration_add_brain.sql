-- Einmalig im Supabase SQL-Editor ausführen, um den "The Brain"-Modus mit
-- Bestenliste freizuschalten. Siehe Kommentare in supabase/schema.sql.

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
