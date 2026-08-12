import { supabase, isSupabaseConfigured } from "../../../../lib/supabaseClient";
import { getCurrentWeekRange } from "../../../../lib/weekRange";

// Top 5 der laufenden Kalenderwoche, absteigend sortiert.
export async function GET() {
  if (!isSupabaseConfigured) {
    return Response.json({ error: "Datenbank ist nicht eingerichtet." }, { status: 500 });
  }

  const { start, end } = getCurrentWeekRange();

  const { data, error } = await supabase
    .from("brain_scores")
    .select("student_name, score")
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString())
    .order("score", { ascending: false })
    .limit(5);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const leaderboard = data.map((row) => ({ name: row.student_name, score: row.score }));
  return Response.json({ leaderboard });
}
