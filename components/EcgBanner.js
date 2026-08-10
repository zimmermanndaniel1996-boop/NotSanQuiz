// Baut den Pfad für einen sich wiederholenden EKG-Streifen (QRS-Komplex).
// Jeder Takt ist 200 Einheiten breit; "cycles" Takte werden aneinandergereiht.
function buildEcgPath(cycles) {
  const CYCLE_WIDTH = 200;
  let d = "M0,30";

  for (let i = 0; i < cycles; i++) {
    const x = i * CYCLE_WIDTH;
    d +=
      ` L${x + 20},30` +
      ` C${x + 24},30 ${x + 26},22 ${x + 30},22` +
      ` C${x + 34},22 ${x + 36},30 ${x + 40},30` +
      ` L${x + 54},30` +
      ` L${x + 60},30 L${x + 64},38 L${x + 68},6 L${x + 72},54 L${x + 76},26 L${x + 80},30` +
      ` L${x + 96},30` +
      ` C${x + 104},30 ${x + 106},14 ${x + 114},14` +
      ` C${x + 122},14 ${x + 124},30 ${x + 132},30` +
      ` L${x + 200},30`;
  }

  return d;
}

const CYCLES_PER_STRIP = 4;
const STRIP_WIDTH = CYCLES_PER_STRIP * 200;
const PATH = buildEcgPath(CYCLES_PER_STRIP);

function EcgStrip() {
  return (
    <svg
      viewBox={`0 0 ${STRIP_WIDTH} 60`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={PATH} fill="none" stroke="var(--color-ecg)" strokeWidth="2.5" />
    </svg>
  );
}

export default function EcgBanner() {
  return (
    <div className="ecg-banner" aria-hidden="true">
      <div className="ecg-banner-track">
        <EcgStrip />
        <EcgStrip />
      </div>
    </div>
  );
}
