import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function Layout() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <div className="shell">
            <aside className="sidebar">
                <div className="logo">
                    <div className="logo-dot">🤖</div>
                    BotFlow
                </div>
                <nav className="nav">
                    <div className="nav-section">Main</div>
                    <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">⬛</span> Dashboard
                    </NavLink>
                    <NavLink to="/chats" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">💬</span> Conversations
                    </NavLink>
                    <NavLink to="/analytics" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">📈</span> Analytics
                    </NavLink>

                    <div className="nav-section">Bot</div>
                    <NavLink to="/widget" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">🧩</span> Widget Preview
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">⚙️</span> Bot Settings
                    </NavLink>
                    <NavLink to="/embed" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">🔗</span> Embed Code
                    </NavLink>

                    <div className="nav-section">Account</div>
                    <NavLink to="/billing" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                        <span className="icon">💳</span> Billing
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-row" style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="avatar">U</div>
                            <div className="user-info">
                                <div className="name">User Session</div>
                                <div className="plan">Active</div>
                            </div>
                        </div>
                        <button 
                            onClick={logout} 
                            style={{ 
                                background: 'transparent', border: 'none', color: 'var(--text)', 
                                cursor: 'pointer', padding: 8, borderRadius: 6, display: 'flex', alignItems: 'center' 
                            }} 
                            title="Log Out"
                            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                            🚪
                        </button>
                    </div>
                </div>
            </aside>

            <main className="main">
                <div className="topbar">
                    <span className="page-title">Dashboard</span>
                    <div className="topbar-right">
                        <button className="icon-btn">🔔</button>
                        <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>RK</div>
                    </div>
                </div>
                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}