import RequireStudent from "../components/RequireStudent";
import HomeContent from "../components/HomeContent";
import { getTopLevelEntries } from "../lib/quizCatalog";

export default function HomePage() {
  const categories = getTopLevelEntries();
  return (
    <RequireStudent>
      <HomeContent categories={categories} />
    </RequireStudent>
  );
}
