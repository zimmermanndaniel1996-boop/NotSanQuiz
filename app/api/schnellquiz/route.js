import { getAllPublicQuestions } from "../../../lib/quizCatalog";
import { weightedSample } from "../../../lib/weightedSample";

const QUESTION_COUNT = 20;

// Wählt die Fragen fürs Schnellquiz serverseitig aus, damit der Browser
// nie den kompletten Fragenpool (mit Lösungen) laden muss - nur die
// tatsächlich gezogenen Fragen, und die auch ohne Lösung.
export async function POST(request) {
  const { progress } = await request.json();
  const progressMap = progress || {};

  const allQuestions = getAllPublicQuestions();
  // Niedrige Lernstufe (oder noch nie geübt) -> höheres Gewicht, damit
  // diese Fragen im Schnellquiz häufiger drankommen.
  const weights = allQuestions.map((q) => {
    const level = progressMap[q.id]?.level ?? 1;
    return 6 - level;
  });
  const count = Math.min(QUESTION_COUNT, allQuestions.length);
  const selected = weightedSample(allQuestions, weights, count);

  return Response.json({ questions: selected });
}
