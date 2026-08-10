-- Einmalig im Supabase SQL-Editor ausführen, um das Feedback-Formular
-- freizuschalten. Siehe Kommentare in supabase/schema.sql.

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
