import { findQuestionById } from "../../../lib/quizCatalog";

// Prüft eine Antwort serverseitig, damit die Lösung (correctIndex,
// Erklärung) nie unaufgefordert an den Browser geschickt wird - nur für
// genau die Frage, die gerade beantwortet wurde.
export async function POST(request) {
  const { questionId, options, selectedIndex } = await request.json();

  const real = findQuestionById(questionId);
  if (!real || !Array.isArray(options) || typeof selectedIndex !== "number") {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const correctText = real.options[real.correctIndex];
  const correctIndex = options.findIndex((option) => option === correctText);
  const selectedText = options[selectedIndex];
  const correct = selectedText === correctText;

  return Response.json({ correct, correctIndex, explanation: real.explanation });
}
