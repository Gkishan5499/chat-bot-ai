export default function MetricCard({ title, value, change, isPositive, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <div>
          <h3 className="metric-title">{title}</h3>
          <p className="metric-value">{value}</p>
        </div>
        <div className="metric-icon">{icon}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className={`chip ${isPositive ? "pos" : "neg"}`}>
          {isPositive ? "+" : ""}
          {change}%
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.84rem" }}>from last month</span>
      </div>
    </div>
  );
}
