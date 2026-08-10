import Link from "next/link";
import RequireStudent from "../../components/RequireStudent";
import CategoryTile from "../../components/CategoryTile";
import { getTopLevelEntries } from "../../lib/quizCatalog";

export default function FachbereichePage() {
  const entries = getTopLevelEntries();

  return (
    <RequireStudent>
      <main>
        <Link href="/" className="back-link">
          ← Zurück zum Hauptmenü
        </Link>

        <div className="page-header">
          <h1>Fachbereichs-Quiz</h1>
          <p>Wähle einen Fachbereich aus</p>
        </div>

        <div className="category-grid">
          {entries.map((entry) => (
            <CategoryTile
              key={entry.slug}
              slug={entry.slug}
              title={entry.title}
              emoji={entry.emoji}
              href={entry.isGroup ? `/fachbereiche/${entry.slug}` : undefined}
            />
          ))}
        </div>
      </main>
    </RequireStudent>
  );
}
