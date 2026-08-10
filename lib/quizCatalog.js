// Diese Datei greift auf die vollen Fragedaten (inkl. Lösungen) zu.
// WICHTIG: Nur aus Server-Code (page.js ohne "use client", Route Handler)
// importieren - niemals aus einer "use client"-Datei, sonst landen die
// Lösungen im Browser-Bundle und jeder könnte sie per Devtools auslesen.
import questions, { categoryGroups } from "../data/questions";

// Fachbereiche als flache Liste, aber ohne Fragetexte/Lösungen - nur
// die IDs, damit Fortschritts-Prozentsätze berechnet werden können.
function getCategoryList() {
  return Object.entries(questions).map(([slug, data]) => ({
    slug,
    title: data.title,
    emoji: data.emoji,
    group: data.group,
    questionIds: data.questions.map((q) => q.id),
  }));
}

// Fachbereiche, die zu einem bestimmten übergeordneten Reiter gehören.
export function getGroupedCategories(groupSlug) {
  return getCategoryList().filter((c) => c.group === groupSlug);
}

// Oberste Ebene für Startseite/PAL-Übersicht (siehe frühere Version in
// progressStats.js - Verhalten unverändert, nur ohne Fragetexte/Lösungen).
export function getTopLevelEntries() {
  const list = getCategoryList();
  const standalone = list.filter((c) => !c.group);
  const groupSlugs = [...new Set(list.filter((c) => c.group).map((c) => c.group))];

  const groupEntries = groupSlugs.map((groupSlug) => {
    const members = list.filter((c) => c.group === groupSlug);
    const meta = categoryGroups[groupSlug] || { title: groupSlug, emoji: "📁" };
    return {
      slug: groupSlug,
      title: meta.title,
      emoji: meta.emoji,
      isGroup: true,
      questionIds: members.flatMap((m) => m.questionIds),
      members,
    };
  });

  return [...standalone, ...groupEntries];
}

// Fragen einer Kategorie OHNE Lösung - für die Quiz-Anzeige im Browser.
export function getPublicQuestions(categorySlug) {
  const category = questions[categorySlug];
  if (!category) return null;
  return category.questions.map(({ id, question, options }) => ({ id, question, options }));
}

// Alle Fragen aus allen Fachbereichen OHNE Lösung, flach - fürs Schnellquiz.
export function getAllPublicQuestions() {
  return Object.values(questions).flatMap((category) =>
    category.questions.map(({ id, question, options }) => ({ id, question, options }))
  );
}

// Frage per ID MIT Lösung - nur serverseitig verwenden (Antwortprüfung)!
export function findQuestionById(id) {
  for (const category of Object.values(questions)) {
    const found = category.questions.find((q) => q.id === id);
    if (found) return found;
  }
  return null;
}

// Fragetext + Fachbereich zu einer ID, OHNE Lösung - für den PAL-Bereich
// (Liste "Fragen auf niedriger Lernstufe").
export function getPublicQuestionInfo(id) {
  for (const [slug, data] of Object.entries(questions)) {
    const found = data.questions.find((q) => q.id === id);
    if (found) {
      return {
        id: found.id,
        question: found.question,
        categorySlug: slug,
        categoryTitle: data.title,
        categoryEmoji: data.emoji,
      };
    }
  }
  return null;
}
