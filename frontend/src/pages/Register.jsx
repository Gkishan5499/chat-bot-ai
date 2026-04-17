import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
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
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2.2rem", marginBottom: 10 }}>Create your workspace</h1>
          <p style={{ opacity: 0.88, lineHeight: 1.6 }}>Set up your assistant, invite your team, and launch embedded support in minutes.</p>
        </div>
      </aside>

      <section className="auth-card-wrap">
        <div className="panel panel-pad auth-card">
          <h1 style={{ margin: 0, fontFamily: "var(--font-head)", fontSize: "1.6rem" }}>Create account</h1>
          <p style={{ color: "var(--text-muted)", margin: "6px 0 18px" }}>Start building with BotFlow.</p>

          {error && <div style={{ color: "var(--danger)", marginBottom: 14, fontSize: "0.86rem", background: "#fee2e2", padding: "8px 10px", borderRadius: 10 }}>{error}</div>}

          <form onSubmit={handleRegister} style={{ display: "grid", gap: 14 }}>
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your Name" required />
            </div>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ margin: "16px 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--brand)", fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
