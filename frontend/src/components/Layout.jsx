import { useMemo, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const pageTitle = useMemo(() => {
    if (location.pathname.includes("/chats")) return "Conversations";
    if (location.pathname.includes("/settings")) return "Bot Settings";
    if (location.pathname.includes("/embed")) return "Embed Widget";
    if (location.pathname.includes("/billing")) return "Billing";
    if (location.pathname.includes("/widget")) return "Widget Preview";
    if (location.pathname.includes("/account")) return "Account";
    return "Dashboard";
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand-row">
          <div className="brand-title">
            <span className="brand-dot">AI</span>
            BotFlow
          </div>
          <button className="icon-btn mobile-menu" onClick={closeMobileMenu}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Main</div>
          <NavLink to="/app" end onClick={closeMobileMenu} className={({ isActive }) => "nav-item" + (isActive ? " active" : "") }>
            <span>◼</span> Dashboard
          </NavLink>
          <NavLink to="/app/chats" onClick={closeMobileMenu} className={({ isActive }) => "nav-item" + (isActive ? " active" : "") }>
            <span>💬</span> Conversations
          </NavLink>

          <div className="nav-label">Bot</div>
          <NavLink to="/app/widget" onClick={closeMobileMenu} className={({ isActive }) => "nav-item" + (isActive ? " active" : "") }>
            <span>🧩</span> Widget Preview
          </NavLink>
          <NavLink to="/app/settings" onClick={closeMobileMenu} className={({ isActive }) => "nav-item" + (isActive ? " active" : "") }>
            <span>⚙</span> Bot Settings
          </NavLink>
          <NavLink to="/app/embed" onClick={closeMobileMenu} className={({ isActive }) => "nav-item" + (isActive ? " active" : "") }>
            <span>🔗</span> Embed Code
          </NavLink>

          <div className="nav-label">Account</div>
          <NavLink to="/app/account" onClick={closeMobileMenu} className={({ isActive }) => "nav-item" + (isActive ? " active" : "") }>
            <span>👤</span> Account
          </NavLink>
          <NavLink to="/app/billing" onClick={closeMobileMenu} className={({ isActive }) => "nav-item" + (isActive ? " active" : "") }>
            <span>💳</span> Billing
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="session-card">
            <div className="session-user">
              <span className="avatar">U</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>User Session</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Active</div>
              </div>
            </div>
            <button className="icon-btn" onClick={logout} title="Log out">
              🚪
            </button>
          </div>
        </div>
      </aside>

      <button className={`mobile-overlay ${menuOpen ? "show" : ""}`} onClick={closeMobileMenu} />

      <main className="main-col">
        <div className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setMenuOpen(true)}>
              ☰
            </button>
            <h1 className="page-title">{pageTitle}</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn">🔔</button>
            <span className="avatar">RK</span>
          </div>
        </div>
        <div className="content-wrap">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
