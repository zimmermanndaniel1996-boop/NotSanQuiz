// Gedeckte, aber auf dunklem Hintergrund gut sichtbare Akzentfarbe je
// Fachbereich für die Fortschritts-Ringe auf der Startseite.
const CATEGORY_COLORS = {
  pharmakologie: "#d9932a", // Amber
  recht: "#6a8caf", // gedecktes Blaugrau
  physiologie: "#3a8f7f", // Physiologie (zusammengefasst) - Petrol
  "physiologie-herz": "#d9756a", // Korallrot
  "physiologie-lunge": "#3a8f7f", // Petrol/Teal
  "physiologie-neurologie": "#9678c2", // Violett
  "physiologie-haut": "#c48462", // Terrakotta
};

export function getCategoryColor(slug) {
  return CATEGORY_COLORS[slug] || "#3a8f7f";
}
