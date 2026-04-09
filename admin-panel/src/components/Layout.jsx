import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="shell">
            <aside className="sidebar">
                <div className="logo">
                    <span>🛡️</span>
                    BotFlow
                    <span className="admin-badge">Admin</span>
                </div>

                <nav className="nav">
                    <div className="nav-section">Overview</div>
                    <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">📊</span> Dashboard
                    </NavLink>
                    <NavLink to="/users" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">👥</span> Users
                    </NavLink>
                    <NavLink to="/chats" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">💬</span> All Chats
                    </NavLink>
                    <NavLink to="/logs" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">🔒</span> Security Logs
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="avatar">A</div>
                            <div className="user-info">
                                <div className="name">Admin</div>
                                <div className="plan">Super Admin</div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            style={{
                                background: 'transparent', border: 'none', color: 'var(--text)',
                                cursor: 'pointer', padding: 8, borderRadius: 6
                            }}
                            title="Log Out"
                            onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text)'}
                        >
                            🚪
                        </button>
                    </div>
                </div>
            </aside>

            <main className="main">
                <div className="topbar">
                    <span className="page-title">Admin Panel</span>
                    <div className="topbar-right">
                        <div style={{
                            fontSize: '0.75rem', color: 'var(--primary)',
                            background: 'var(--primary-light)', padding: '4px 12px',
                            borderRadius: 99, border: '1px solid rgba(239,68,68,0.2)'
                        }}>
                            🟢 System Online
                        </div>
                    </div>
                </div>
                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
