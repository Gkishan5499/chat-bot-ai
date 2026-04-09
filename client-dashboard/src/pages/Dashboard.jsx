import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import api from '../api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/bot/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (!stats) return <div>Error loading dashboard.</div>;

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                <MetricCard title="Total Conversations" value={stats.totalConversations} change={12.5} isPositive={true} icon="💬" />
                <MetricCard title="Bot Resolution Rate" value={`${stats.resolutionRate}%`} change={4.1} isPositive={true} icon="✅" />
                <MetricCard title="Average Response Time" value={stats.avgResponseTime} change={-0.3} isPositive={true} icon="⚡" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
                <div className="glass-panel" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: 24 }}>Message Volume</h2>
                    <div style={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 12, borderBottom: '1px solid var(--border)' }}>
                        {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} style={{ 
                                flex: 1, 
                                height: `${h}%`, 
                                background: i === 5 ? 'var(--accent)' : 'var(--accent-light)',
                                borderRadius: '6px 6px 0 0',
                                transition: 'height 0.3s ease-in-out'
                            }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, color: 'var(--text)', fontSize: '0.8rem' }}>
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: 24 }}>Recent Activity</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {stats.recentActivity.length > 0 ? stats.recentActivity.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.alert ? '#ef4444' : 'var(--accent)' }} />
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-h)' }}>{item.title}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text)' }}>{timeAgo(item.time)}</span>
                            </div>
                        )) : (
                            <div style={{ color: 'var(--text)', fontSize: '0.9rem' }}>No recent activity.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
