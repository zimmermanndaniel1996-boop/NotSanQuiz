import Link from "next/link";
import RequireStudent from "../../../components/RequireStudent";
import CategoryTile from "../../../components/CategoryTile";
import { categoryGroups } from "../../../data/questions";
import { getGroupedCategories } from "../../../lib/quizCatalog";

export function generateStaticParams() {
  return Object.keys(categoryGroups).map((slug) => ({ group: slug }));
}

export default async function CategoryGroupPage({ params }) {
  const { group: groupSlug } = await params;
  const meta = categoryGroups[groupSlug];
  const members = getGroupedCategories(groupSlug);

  if (!meta || members.length === 0) {
    return (
      <main>
        <div className="page-header">
          <h1>Bereich nicht gefunden</h1>
          <p>Diesen Bereich gibt es (noch) nicht.</p>
        </div>
        <Link href="/fachbereiche" className="primary-button">
          Zurück zur Fachbereichsauswahl
        </Link>
      </main>
    );
  }

  return (
    <RequireStudent>
      <main>
        <Link href="/fachbereiche" className="back-link">
          ← Zurück zur Fachbereichsauswahl
        </Link>

        <div className="page-header">
          <h1>
            {meta.emoji} {meta.title}
          </h1>
          <p>{meta.description || "Wähle einen Unterbereich aus"}</p>
        </div>

        <div className="category-grid">
          {members.map((member) => (
            <CategoryTile
              key={member.slug}
              slug={member.slug}
              title={member.title}
              emoji={member.emoji}
            />
          ))}
        </div>
      </main>
    </RequireStudent>
  );
}
