// Reine Statistik-Funktionen, die nur mit Fragen-IDs und dem Fortschritt
// arbeiten - bewusst OHNE Import von data/questions.js, damit diese Datei
// gefahrlos auch von "use client"-Komponenten genutzt werden kann (Fragen
// und Lösungen sollen nicht im Browser-Bundle landen, siehe lib/quizCatalog.js).

// Prozentsatz der Fragen, die auf Lernstufe 4 oder 5 stehen.
export function percentSecure(questionIds, progressMap) {
  if (questionIds.length === 0) return 0;
  const secureCount = questionIds.filter((id) => {
    const entry = progressMap[id];
    return entry && entry.level >= 4;
  }).length;
  return (secureCount / questionIds.length) * 100;
}

// Wie viele Fragen wurden schon mindestens einmal geübt (unabhängig von der
// erreichten Lernstufe) - zeigt frühzeitig Bewegung, noch bevor eine Frage
// die "sicher gelernt"-Schwelle (Stufe 4) erreicht.
export function percentStarted(questionIds, progressMap) {
  if (questionIds.length === 0) return 0;
  const startedCount = questionIds.filter((id) => Boolean(progressMap[id])).length;
  return (startedCount / questionIds.length) * 100;
}

// Wandelt Datenbank-Zeilen (times_correct, times_wrong, ...) in ein
// Nachschlage-Objekt { [questionId]: { level, timesCorrect, timesWrong } } um.
export function progressRowsToMap(rows) {
  const map = {};
  for (const row of rows) {
    map[row.question_id] = {
      level: row.level,
      timesCorrect: row.times_correct,
      timesWrong: row.times_wrong,
    };
  }
  return map;
}
