'use client';
export default function DonutChart({ segments, centerValue, centerLabel, size = 170 }) {
  const r = 60, circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  return (
    <div className="donut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 160 160">
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const o = offset;
          offset += dash;
          return <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={seg.color} strokeWidth="18" strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-o} opacity="0.85"/>;
        })}
      </svg>
      <div className="donut-center">
        <span className="dc-val mono">{centerValue}</span>
        <span className="dc-lbl">{centerLabel}</span>
      </div>
    </div>
  );
}
