export default function StatCard({ icon, value, label, change, changeDir, colorClass }) {
  return (
    <div className={`glass stat-card anim`}>
      <div className={`icon-wrap ${colorClass}`}>{icon}</div>
      <div className="val mono">{value}</div>
      <div className="lbl">{label}</div>
      {change && <span className={`change ${changeDir}`}>{changeDir === 'up' ? '↑' : '↓'} {change}</span>}
    </div>
  );
}
