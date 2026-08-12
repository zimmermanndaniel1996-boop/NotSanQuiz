// Baut den Pfad für einen anatomisch korrekten Sinusrhythmus:
// P-Welle, PQ-Strecke, schmaler QRS-Komplex (Q/R/S), ST-Strecke, T-Welle,
// danach eine lange isoelektrische Ruhephase bis zum nächsten Zyklus.
function buildSinusRhythmPath(cycles) {
  const CYCLE_WIDTH = 280;
  const BASELINE = 48;
  let d = `M0,${BASELINE}`;

  for (let i = 0; i < cycles; i++) {
    const o = i * CYCLE_WIDTH;
    d +=
      ` L${o + 24},${BASELINE}` +
      // P-Welle: sanfte, runde Erhebung
      ` C${o + 28},${BASELINE} ${o + 30},39 ${o + 37},39` +
      ` C${o + 44},39 ${o + 46},${BASELINE} ${o + 50},${BASELINE}` +
      // PQ-Strecke (isoelektrisch)
      ` L${o + 64},${BASELINE}` +
      // QRS-Komplex: schmal - Q-Zacke, R-Zacke, S-Zacke
      ` L${o + 68},52` +
      ` L${o + 74},10` +
      ` L${o + 80},58` +
      ` L${o + 86},${BASELINE}` +
      // ST-Strecke (isoelektrisch)
      ` L${o + 110},${BASELINE}` +
      // T-Welle: breite, runde Erhebung
      ` C${o + 118},${BASELINE} ${o + 122},35 ${o + 135},35` +
      ` C${o + 148},35 ${o + 152},${BASELINE} ${o + 160},${BASELINE}` +
      // Ruhephase bis zum nächsten Zyklus
      ` L${o + CYCLE_WIDTH},${BASELINE}`;
  }

  return d;
}

const CYCLES = 2;
const CYCLE_WIDTH = 280;
const STRIP_WIDTH = CYCLES * CYCLE_WIDTH;
const PATH = buildSinusRhythmPath(CYCLES);

export default function SinusRhythmStrip() {
  return (
    <svg
      className="rhythm-strip"
      viewBox={`0 0 ${STRIP_WIDTH} 80`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={PATH}
        fill="none"
        stroke="var(--color-ecg)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
