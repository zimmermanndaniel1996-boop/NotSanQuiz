// Wählt "count" Einträge zufällig aus, ohne Wiederholung, wobei Einträge
// mit höherem Gewicht eher gezogen werden (Effizientes Reservoir-Sampling,
// A-ES-Algorithmus). Wird genutzt, damit im Schnellquiz Fragen mit
// niedriger Lernstufe häufiger vorkommen.
export function weightedSample(items, weights, count) {
  const keyed = items.map((item, i) => ({
    item,
    key: Math.pow(Math.random(), 1 / Math.max(weights[i], 0.0001)),
  }));
  keyed.sort((a, b) => b.key - a.key);
  return keyed.slice(0, count).map((entry) => entry.item);
}
