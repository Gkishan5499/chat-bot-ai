import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            // Verify the user is actually an admin
            const statsRes = await api.get('/admin/stats', {
                headers: { Authorization: `Bearer ${res.data.token}` }
            });
            localStorage.setItem('adminToken', res.data.token);
            navigate('/');
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Access denied. This account does not have admin privileges.');
            } else {
                setError(err.response?.data?.error || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', height: '100vh', alignItems: 'center',
            justifyContent: 'center', background: 'var(--bg-base)'
        }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛡️</div>
                    <h1 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: 8 }}>Admin Portal</h1>
                    <p style={{ color: 'var(--text)', fontSize: '0.9rem' }}>Restricted access — BotFlow administrators only</p>
                </div>

                <div className="glass-panel" style={{ padding: 36 }}>
                    {error && (
                        <div style={{
                            background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.2)',
                            color: 'var(--danger)', padding: '10px 14px', borderRadius: 8,
                            fontSize: '0.85rem', marginBottom: 20
                        }}>
                            ⚠️ {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Admin Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="admin@botflow.io"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            style={{ width: '100%', marginTop: 8 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : '🔐 Access Admin Panel'}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--text)' }}>
                    🔒 This portal is monitored. Unauthorized access attempts are logged.
                </div>
            </div>
        </div>
    );
}
