import Link from "next/link";
import RequireStudent from "../../../components/RequireStudent";
import QuizGame from "../../../components/QuizGame";
import questions, { categoryGroups } from "../../../data/questions";
import { getPublicQuestions } from "../../../lib/quizCatalog";

export function generateStaticParams() {
  return Object.keys(questions).map((slug) => ({ category: slug }));
}

export default async function QuizPage({ params }) {
  const { category: categorySlug } = await params;
  const category = questions[categorySlug];

  if (!category) {
    return (
      <main>
        <div className="page-header">
          <h1>Kategorie nicht gefunden</h1>
          <p>Diese Kategorie gibt es (noch) nicht.</p>
        </div>
        <Link href="/" className="primary-button">
          Zurück zum Hauptmenü
        </Link>
      </main>
    );
  }

  const groupMeta = category.group ? categoryGroups[category.group] : null;
  const backHref = groupMeta ? `/fachbereiche/${category.group}` : "/fachbereiche";
  const backLabel = groupMeta
    ? `Zurück zu ${groupMeta.title}`
    : "Zurück zur Fachbereichsauswahl";

  return (
    <RequireStudent>
      <QuizGame
        title={category.title}
        questions={getPublicQuestions(categorySlug)}
        backHref={backHref}
        backLabel={backLabel}
      />
    </RequireStudent>
  );
}
