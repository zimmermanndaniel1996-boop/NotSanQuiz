// Berechnet Anfang (Montag 00:00 Uhr) und Ende der aktuellen Kalenderwoche,
// damit das "The Brain"-Leaderboard nur Scores aus der laufenden Woche
// zeigt und sich jeden Montag automatisch zurücksetzt. Alte Scores bleiben
// in der Datenbank erhalten (siehe week_key-Spalte in supabase/schema.sql),
// sie werden hier nur nicht mehr in den Zeitraum-Filter fallen.
export function getCurrentWeekRange(now = new Date()) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNum = d.getUTCDay() || 7; // Montag=1 ... Sonntag=7
  d.setUTCDate(d.getUTCDate() - (dayNum - 1)); // zurück auf Montag dieser Woche
  const start = d;
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 7);
  return { start, end };
}
