import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const res = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: 400, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
                <h1 style={{ marginBottom: 8 }} className="text-gradient">BotFlow UI</h1>
                <p style={{ color: 'var(--text)', marginBottom: 32 }}>Create a new BotFlow account</p>
                
                {error && <div style={{ color: '#ef4444', marginBottom: 16, fontSize: '14px', background: '#fee2e2', padding: 8, borderRadius: 8 }}>{error}</div>}

                <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="Your Name" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%', marginTop: 16 }} disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                
                <div style={{ marginTop: 24, fontSize: '14px', color: 'var(--text)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
}
