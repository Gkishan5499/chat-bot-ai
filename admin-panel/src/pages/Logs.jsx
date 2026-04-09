import { useState, useEffect } from 'react';
import api from '../api';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | failed | success

    useEffect(() => {
        api.get('/admin/logs')
            .then(res => setLogs(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = logs.filter(log => {
        if (filter === 'failed') return !log.success;
        if (filter === 'success') return log.success;
        return true;
    });

    const timeStr = (date) => new Date(date).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ color: 'var(--text-h)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
                        Security Logs
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                        All login attempts — {logs.filter(l => !l.success).length} failed, {logs.filter(l => l.success).length} successful
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    {['all', 'failed', 'success'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="btn-ghost"
                            style={{
                                fontSize: '0.8rem',
                                background: filter === f ? 'var(--primary-light)' : 'transparent',
                                color: filter === f ? 'var(--primary)' : 'var(--text)',
                                borderColor: filter === f ? 'rgba(239,68,68,0.3)' : 'var(--border)'
                            }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text)' }}>Loading logs...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text)' }}>
                        No login attempts recorded yet. They'll appear here once users try to log in.
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Email</th>
                                <th>IP Address</th>
                                <th>Reason</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((log, i) => (
                                <tr key={i}>
                                    <td>
                                        <span className={`badge ${log.success ? 'badge-success' : 'badge-danger'}`}>
                                            {log.success ? '✓ Success' : '✗ Failed'}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                                        {log.email}
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text)' }}>
                                        {log.ip}
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--text)' }}>
                                        {log.reason}
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--text)' }}>
                                        {timeStr(log.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
