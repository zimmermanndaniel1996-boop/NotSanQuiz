// Gedeckte Akzentfarbe je Fachbereich für die Fortschritts-Ringe auf der
// Startseite (Vitalmonitor-Ästhetik: jeder Bereich bekommt einen eigenen,
// ruhigen Farbton statt eines bunten Verlaufs).
const CATEGORY_COLORS = {
  pharmakologie: "#b8791a", // Amber
  recht: "#4f6d8c", // gedecktes Blaugrau
  physiologie: "#2f7a72", // Physiologie (zusammengefasst) - Petrol
  "physiologie-herz": "#c15a4e", // Korallrot
  "physiologie-lunge": "#2f7a72", // Petrol/Teal
  "physiologie-neurologie": "#7a5fa0", // Violett
  "physiologie-haut": "#a56a4c", // Terrakotta
};

export function getCategoryColor(slug) {
  return CATEGORY_COLORS[slug] || "#2f6f62";
}
