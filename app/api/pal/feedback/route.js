import { supabaseAdmin, isSupabaseAdminConfigured } from "../../../../lib/supabaseAdmin";

// Liest alle Feedback-Antworten über den Service-Role-Key, damit niemand
// über den öffentlichen Anon-Key fremdes (ggf. anonymes) Feedback einsehen
// kann - Einfügen ist über die App-Tabelle öffentlich, Lesen nicht.
export async function GET() {
  if (!isSupabaseAdminConfigured) {
    return Response.json({ error: "Nicht eingerichtet (SUPABASE_SERVICE_ROLE_KEY fehlt)." }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from("feedback_responses")
    .select("id, student_name, is_anonymous, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const feedback = data.map((row) => ({
    id: row.id,
    name: row.is_anonymous ? null : row.student_name,
    message: row.message,
    created_at: row.created_at,
  }));

  return Response.json({ feedback });
}
