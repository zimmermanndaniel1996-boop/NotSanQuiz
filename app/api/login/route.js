import { supabaseAdmin, isSupabaseAdminConfigured } from "../../../lib/supabaseAdmin";
import { hashPassword, verifyPassword } from "../../../lib/passwordHash";

const MIN_PASSWORD_LENGTH = 4;

// Meldet einen Schüler an. Läuft serverseitig mit dem Service-Role-Key,
// damit der Passwort-Hash nie über den öffentlichen Anon-Key auslesbar ist
// (die students-Tabelle ist per RLS für alle lesbar, siehe supabase/schema.sql).
export async function POST(request) {
  const { name, password } = await request.json();
  const trimmedName = (name || "").trim();
  const trimmedPassword = (password || "").trim();

  if (!trimmedName) {
    return Response.json({ error: "Bitte gib einen Namen oder ein Kürzel ein." }, { status: 400 });
  }
  if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
    return Response.json(
      { error: `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen haben.` },
      { status: 400 }
    );
  }
  if (!isSupabaseAdminConfigured) {
    return Response.json(
      { error: "Login ist nicht eingerichtet (SUPABASE_SERVICE_ROLE_KEY fehlt in .env.local)." },
      { status: 500 }
    );
  }

  const { data: existing, error: findError } = await supabaseAdmin
    .from("students")
    .select("id, name, password_hash")
    .ilike("name", trimmedName)
    .maybeSingle();

  if (findError) {
    return Response.json(
      { error: "Verbindung zur Datenbank fehlgeschlagen: " + findError.message },
      { status: 500 }
    );
  }

  if (!existing) {
    const { data: created, error: insertError } = await supabaseAdmin
      .from("students")
      .insert({ name: trimmedName, password_hash: hashPassword(trimmedPassword) })
      .select("id, name")
      .single();
    if (insertError) {
      return Response.json({ error: "Anlegen fehlgeschlagen: " + insertError.message }, { status: 500 });
    }
    return Response.json({ student: created });
  }

  // Accounts von vor der Passwort-Einführung haben noch keinen Hash -
  // das eingegebene Passwort wird dann einmalig als ihr Passwort übernommen.
  if (!existing.password_hash) {
    const { error: updateError } = await supabaseAdmin
      .from("students")
      .update({ password_hash: hashPassword(trimmedPassword) })
      .eq("id", existing.id);
    if (updateError) {
      return Response.json(
        { error: "Passwort konnte nicht gesetzt werden: " + updateError.message },
        { status: 500 }
      );
    }
    return Response.json({ student: { id: existing.id, name: existing.name } });
  }

  if (!verifyPassword(trimmedPassword, existing.password_hash)) {
    return Response.json({ error: "Falscher Name oder falsches Passwort." }, { status: 401 });
  }

  return Response.json({ student: { id: existing.id, name: existing.name } });
}
