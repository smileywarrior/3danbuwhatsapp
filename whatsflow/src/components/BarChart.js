'use client';
export default function BarChart({ data, colors, labels, height = 200 }) {
  const max = Math.max(...data);
  return (
    <div className="chart-wrap" style={{ height }}>
      <div className="chart-bars">
        {data.map((v, i) => (
          <div key={i} className="chart-bar" style={{
            height: `${(v / max) * 100}%`,
            background: colors ? colors[i % colors.length] : 'var(--green)',
            borderRadius: '8px 8px 0 0',
          }}>
            <span className="tip">{labels?.[i] || ''}: {v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
