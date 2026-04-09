import { useState, useEffect } from 'react';
import api from '../api';

function MetricCard({ icon, label, value, color = 'var(--primary)' }) {
    return (
        <div className="metric-card">
            <div className="metric-header">
                <span className="metric-label">{label}</span>
                <div className="metric-icon" style={{ background: color + '22' }}>
                    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                </div>
            </div>
            <div className="metric-value">{value ?? '—'}</div>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ color: 'var(--text)', padding: 20 }}>Loading platform stats...</div>;
    if (!stats) return <div style={{ color: 'var(--danger)' }}>Failed to load stats.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
                <h2 style={{ color: 'var(--text-h)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>
                    Platform Overview
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>Real-time BotFlow platform metrics</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <MetricCard icon="👥" label="Total Clients" value={stats.totalUsers} />
                <MetricCard icon="✅" label="Active Clients" value={stats.activeUsers} color="var(--success)" />
                <MetricCard icon="💬" label="Total Conversations" value={stats.totalChats} color="#6366f1" />
                <MetricCard icon="📨" label="Total Messages" value={stats.totalMessages.toLocaleString()} color="var(--warning)" />
            </div>

            <div className="glass-panel" style={{ padding: 28 }}>
                <h3 style={{ color: 'var(--text-h)', marginBottom: 20, fontSize: '1rem' }}>System Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        { label: 'API Server', status: 'Operational', color: 'var(--success)' },
                        { label: 'Database (MongoDB)', status: 'Operational', color: 'var(--success)' },
                        { label: 'Gemini AI Integration', status: 'Operational', color: 'var(--success)' },
                        { label: 'Widget CDN', status: 'Operational', color: 'var(--success)' },
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-h)' }}>{item.label}</span>
                            <span className="badge badge-success" style={{ background: item.color + '22', color: item.color }}>
                                ● {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
