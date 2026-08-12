const SIZE = 84;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ percent = 0, label, sublabel, color = "var(--color-ecg)" }) {
  const safePercent = Math.max(0, Math.min(100, percent));
  const offset = CIRCUMFERENCE - (safePercent / 100) * CIRCUMFERENCE;

  return (
    <div className="progress-ring">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="var(--color-text)"
        >
          {Math.round(safePercent)}%
        </text>
      </svg>
      {label && <div className="progress-ring-label">{label}</div>}
      {sublabel && <div className="progress-ring-sublabel">{sublabel}</div>}
    </div>
  );
}
