import { useState, useEffect } from 'react';
import api from '../api';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUser = async (userId) => {
        setActionId(userId);
        try {
            const res = await api.patch(`/admin/users/${userId}/toggle`);
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: res.data.isActive } : u));
        } catch (err) {
            alert('Failed to toggle user: ' + err.response?.data?.error);
        } finally {
            setActionId(null);
        }
    };

    const deleteUser = async (userId, name) => {
        if (!confirm(`Delete "${name}" and all their chat data? This cannot be undone.`)) return;
        setActionId(userId);
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user: ' + err.response?.data?.error);
        } finally {
            setActionId(null);
        }
    };

    const timeAgo = (date) => {
        const d = Math.floor((new Date() - new Date(date)) / 86400000);
        if (d === 0) return 'Today';
        if (d === 1) return 'Yesterday';
        return `${d} days ago`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: 'var(--text-h)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
                        Client Accounts
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                        {users.length} registered users
                    </p>
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text)' }}>Loading users...</div>
                ) : users.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text)' }}>No registered users yet.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Bot Name</th>
                                <th>API Key</th>
                                <th>Joined</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: 'var(--primary-light)',
                                                color: 'var(--primary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                                            }}>
                                                {user.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.875rem' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text)' }}>{user.botName}</td>
                                    <td>
                                        <code style={{
                                            fontSize: '0.7rem', background: 'var(--bg-elevated)',
                                            padding: '2px 6px', borderRadius: 4, color: 'var(--text)'
                                        }}>
                                            {user.apiKey?.substring(0, 16)}...
                                        </code>
                                    </td>
                                    <td style={{ color: 'var(--text)', fontSize: '0.8rem' }}>{timeAgo(user.createdAt)}</td>
                                    <td>
                                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                            {user.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                className="btn-ghost"
                                                onClick={() => toggleUser(user._id)}
                                                disabled={actionId === user._id}
                                                style={{ fontSize: '0.75rem' }}
                                            >
                                                {user.isActive ? 'Disable' : 'Enable'}
                                            </button>
                                            <button
                                                className="btn-ghost btn-danger"
                                                onClick={() => deleteUser(user._id, user.name)}
                                                disabled={actionId === user._id}
                                                style={{ fontSize: '0.75rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
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
