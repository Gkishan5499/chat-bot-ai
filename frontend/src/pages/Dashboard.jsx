import { useState, useEffect } from "react";
import MetricCard from "../components/MetricCard";
import api from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/bot/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="panel panel-pad">Loading dashboard...</div>;
  if (!stats) return <div className="panel panel-pad">Error loading dashboard.</div>;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="page">
      <section className="card-grid">
        <MetricCard title="Total Conversations" value={stats.totalConversations} change={12.5} isPositive={true} icon="💬" />
        <MetricCard title="Bot Resolution Rate" value={`${stats.resolutionRate}%`} change={4.1} isPositive={true} icon="✅" />
        <MetricCard title="Average Response Time" value={stats.avgResponseTime} change={-0.3} isPositive={true} icon="⚡" />
      </section>

      <section className="split-grid">
        <div className="panel panel-pad">
          <h2 style={{ fontFamily: "var(--font-head)", margin: 0 }}>Message Volume</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 6 }}>Weekly message trend across all conversations.</p>

          <div style={{ height: 280, display: "flex", alignItems: "flex-end", gap: 10, borderBottom: "1px solid var(--border)", marginTop: 20 }}>
            {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === 5 ? "linear-gradient(180deg, var(--brand), #0f9b8e)" : "#cbd5e1",
                  borderRadius: "8px 8px 0 0",
                  transition: "height 0.3s ease-in-out",
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, color: "var(--text-muted)", fontSize: "0.8rem" }}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="panel panel-pad">
          <h2 style={{ fontFamily: "var(--font-head)", margin: 0 }}>Recent Activity</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 6 }}>Latest events from your support bot.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", background: "var(--surface-soft)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: item.alert ? "var(--danger)" : "var(--brand)" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 700 }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{timeAgo(item.time)}</span>
                </div>
              ))
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No recent activity.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
