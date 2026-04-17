import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <aside className="auth-side">
        <div style={{ maxWidth: 460 }}>
          <div className="brand-title" style={{ color: "white", marginBottom: 20 }}>
            <span className="brand-dot">AI</span>
            BotFlow
          </div>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2.2rem", marginBottom: 10 }}>Welcome back</h1>
          <p style={{ opacity: 0.88, lineHeight: 1.6 }}>Jump into your conversations, tune your assistant, and keep your customer experience sharp.</p>
        </div>
      </aside>

      <section className="auth-card-wrap">
        <div className="panel panel-pad auth-card">
          <h1 style={{ margin: 0, fontFamily: "var(--font-head)", fontSize: "1.6rem" }}>Sign in</h1>
          <p style={{ color: "var(--text-muted)", margin: "6px 0 18px" }}>Access your BotFlow dashboard.</p>

          {error && <div style={{ color: "var(--danger)", marginBottom: 14, fontSize: "0.86rem", background: "#fee2e2", padding: "8px 10px", borderRadius: 10 }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: "grid", gap: 14 }}>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ margin: "16px 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "var(--brand)", fontWeight: 700 }}>
              Create one
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
