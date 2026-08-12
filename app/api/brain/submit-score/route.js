import { supabase, isSupabaseConfigured } from "../../../../lib/supabaseClient";

// 30 Fragen x max. 15 Punkte (10 Grundpunkte + 5 Zeitbonus) - Werte
// außerhalb dieser Spanne sind unplausibel und werden gekappt.
const MAX_PLAUSIBLE_SCORE = 30 * 15;

export async function POST(request) {
  const { studentId, studentName, score } = await request.json();

  if (!isSupabaseConfigured) {
    return Response.json({ error: "Datenbank ist nicht eingerichtet." }, { status: 500 });
  }
  if (!studentId || !studentName || typeof score !== "number") {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const safeScore = Math.max(0, Math.min(Math.round(score), MAX_PLAUSIBLE_SCORE));

  const { error } = await supabase.from("brain_scores").insert({
    student_id: studentId,
    student_name: studentName,
    score: safeScore,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
