import PalContent from "../../components/PalContent";
import { getTopLevelEntries } from "../../lib/quizCatalog";

export default function PalPage() {
  const categories = getTopLevelEntries();
  return <PalContent categories={categories} />;
}
