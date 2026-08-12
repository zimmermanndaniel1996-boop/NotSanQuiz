// Kreisrundes Logo-Badge für die Anmeldeseite: dünner Ring plus ein
// einzelner, anatomisch korrekter Sinusrhythmus (P-Welle, schmaler
// QRS-Komplex mit Q-/R-/S-Zacke, T-Welle) - als reines SVG, keine Bilddatei.
const RING_COLOR = "#1D9E75";

export default function LogoBadge() {
  return (
    <svg className="logo-badge" viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="44" r="40" fill="none" stroke={RING_COLOR} strokeWidth="2" />
      <path
        d="M14,44 L20,44
           C22,44 23,37 27,37 C31,37 32,44 34,44
           L40,44
           L42,47 L46,18 L50,52 L54,44
           L60,44
           C63,44 64,34 68,34 C72,34 73,44 74,44"
        fill="none"
        stroke={RING_COLOR}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
