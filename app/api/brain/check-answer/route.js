import { findQuestionById } from "../../../../lib/quizCatalog";

const BASE_POINTS = 10;
const FAST_BONUS = 5;
const FAST_THRESHOLD_MS = 5000;
const MEDIUM_BONUS = 2;
const MEDIUM_THRESHOLD_MS = 10000;
// Schutz gegen unplausible (0 oder negative) Zeitangaben vom Client.
const MIN_ELAPSED_MS = 300;

// Prüft eine Antwort im "The Brain"-Modus und berechnet die Punktzahl
// serverseitig (Grundpunkte + Zeitbonus), damit die Lösung wie beim
// normalen Quiz nie an den Browser geht (siehe /api/check-answer).
export async function POST(request) {
  const { questionId, options, selectedIndex, elapsedMs } = await request.json();

  const real = findQuestionById(questionId);
  if (!real || !Array.isArray(options) || typeof selectedIndex !== "number") {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const safeElapsedMs = Math.max(Number(elapsedMs) || 0, MIN_ELAPSED_MS);
  const correctText = real.options[real.correctIndex];
  const correctIndex = options.findIndex((option) => option === correctText);
  const selectedText = options[selectedIndex];
  const correct = selectedText === correctText;

  let points = 0;
  if (correct) {
    points = BASE_POINTS;
    if (safeElapsedMs < FAST_THRESHOLD_MS) {
      points += FAST_BONUS;
    } else if (safeElapsedMs < MEDIUM_THRESHOLD_MS) {
      points += MEDIUM_BONUS;
    }
  }

  return Response.json({ correct, correctIndex, explanation: real.explanation, points });
}
