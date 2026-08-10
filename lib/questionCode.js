// Kurze, lesbare Kennung pro Fachbereich für die Anzeige im Quiz
// (z. B. "Herz-23"), damit sich einzelne Fragen leicht melden lassen.
// Beim Anlegen eines neuen Fachbereichs in data/questions.js bitte hier
// ein passendes Kürzel ergänzen - sonst wird der Kategorie-Schlüssel
// unverändert als Kürzel verwendet (funktioniert auch, ist nur weniger schön).
const SHORT_LABELS = {
  pharmakologie: "Pharma",
  recht: "Recht",
  "physiologie-herz": "Herz",
  "physiologie-lunge": "Lunge",
  "physiologie-neurologie": "Neuro",
  "physiologie-haut": "Haut",
};

// Fragen-IDs haben immer die Form "<kategorie>-<laufendeNummer>"
// (z. B. "physiologie-herz-23"). Daraus wird die Anzeige-Kennung gebaut.
export function getQuestionCode(questionId) {
  if (!questionId) return null;
  const match = questionId.match(/^(.*)-(\d+)$/);
  if (!match) return questionId;
  const [, categorySlug, indexStr] = match;
  const label = SHORT_LABELS[categorySlug] || categorySlug;
  return `${label}-${parseInt(indexStr, 10) + 1}`;
}
