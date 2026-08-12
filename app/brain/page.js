import RequireStudent from "../../components/RequireStudent";
import BrainGame from "../../components/BrainGame";
import { getRandomPublicQuestions } from "../../lib/quizCatalog";

const QUESTION_COUNT = 30;

export default function BrainPage() {
  const questions = getRandomPublicQuestions(QUESTION_COUNT);
  return (
    <RequireStudent>
      <BrainGame questions={questions} />
    </RequireStudent>
  );
}
