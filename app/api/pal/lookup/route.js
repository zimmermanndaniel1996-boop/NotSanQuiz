import { getAllPublicQuestions, getPublicQuestionInfo } from "../../../../lib/quizCatalog";

// Liefert Fragetext + Fachbereich zu jeder Frage-ID (ohne Lösung) für die
// PAL-Detailansicht ("Fragen auf niedriger Lernstufe"). Läuft serverseitig,
// damit data/questions.js nicht ins Browser-Bundle des PAL-Bereichs muss.
export async function GET() {
  const lookup = {};
  for (const { id } of getAllPublicQuestions()) {
    const info = getPublicQuestionInfo(id);
    if (info) lookup[id] = info;
  }

  return Response.json({ lookup });
}
