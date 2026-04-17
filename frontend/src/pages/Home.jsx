import { Link } from "react-router-dom";
import ChatWidget from "../ChatWidget";

export default function Home() {
  const apiKey = import.meta.env.VITE_WIDGET_API_KEY || "sk-test-demo";
  const isAuth = !!localStorage.getItem("token");

  return (
    <div className="home-wrap">
      <header>
        <div className="home-nav">
          <div className="brand-title">
            <span className="brand-dot">AI</span>
            BotFlow
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {isAuth ? (
              <Link to="/app" className="btn btn-primary">
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="panel panel-pad">
          <h1 className="hero-title">
            Build smarter support with <span className="hero-gradient">one bot, one dashboard</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: 14, marginBottom: 20, maxWidth: 620 }}>
            Manage conversations, tune behavior, and deploy your chatbot to any website in minutes. Everything now lives in one frontend for cleaner deployment.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
            <Link to={isAuth ? "/app" : "/register"} className="btn btn-primary">
              {isAuth ? "Open Workspace" : "Create Account"}
            </Link>
            <Link to="/app/widget" className="btn btn-secondary">
              Preview Widget
            </Link>
          </div>

          <div className="feature-row">
            <article className="feature">
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>Live Analytics</h3>
              <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "0.86rem" }}>Track response time and resolution rate.</p>
            </article>
            <article className="feature">
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>Custom Personality</h3>
              <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "0.86rem" }}>Tune prompt, tone, and assistant color.</p>
            </article>
            <article className="feature">
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>Simple Embed</h3>
              <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "0.86rem" }}>Copy one script tag into your site.</p>
            </article>
          </div>
        </section>

        <section className="hero-art">
          <div className="hero-orb one" />
          <div className="hero-orb two" />
          <img
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&q=80&w=900&h=900"
            alt="Team discussing customer support metrics"
            className="hero-image"
          />
        </section>
      </main>

      <section style={{ width: "min(1150px, 100%)", margin: "0 auto", padding: "0 22px 30px" }}>
        <div className="panel panel-pad" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "var(--font-head)" }}>Trusted by product teams and agencies</h2>
            <p style={{ margin: "8px 0 0", color: "var(--text-muted)" }}>Scale support without adding headcount.</p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700, color: "#334155" }}>
            <span>Acme</span>
            <span>Orbit</span>
            <span>Helio</span>
            <span>Nimbus</span>
          </div>
        </div>
      </section>

      <ChatWidget apiKey={apiKey} color="#0f766e" name="BotFlow Assistant" />
    </div>
  );
}
