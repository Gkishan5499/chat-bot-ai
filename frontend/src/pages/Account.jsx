import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Account() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setForm({ name: data.user.name || "", email: data.user.email || "", password: "" });
        setCreatedAt(data.user.createdAt || "");
        localStorage.setItem("user", JSON.stringify({ name: data.user.name, email: data.user.email }));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load account details");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const { data } = await api.put("/auth/me", payload);
      setForm((prev) => ({ ...prev, password: "" }));
      localStorage.setItem("user", JSON.stringify({ name: data.user.name, email: data.user.email }));
      setMessage("Account updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="panel panel-pad">Loading account details...</div>;
  }

  return (
    <div className="page">
      <section className="panel panel-pad">
        <h2 style={{ margin: 0, fontFamily: "var(--font-head)" }}>Account Details</h2>
        <p style={{ color: "var(--text-muted)", margin: "8px 0 18px" }}>
          Update your profile information. Leave password blank to keep current password.
        </p>

        {error && (
          <div style={{ color: "var(--danger)", marginBottom: 12, background: "#fee2e2", borderRadius: 10, padding: "8px 10px", fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ color: "var(--success)", marginBottom: 12, background: "#dcfce7", borderRadius: 10, padding: "8px 10px", fontSize: "0.88rem" }}>
            {message}
          </div>
        )}

        <form onSubmit={onSave} style={{ display: "grid", gap: 14 }}>
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input className="input" value={form.name} onChange={onChange("name")} required />
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input type="email" className="input" value={form.email} onChange={onChange("email")} required />
          </div>

          <div className="form-field">
            <label className="form-label">New Password</label>
            <input type="password" className="input" value={form.password} onChange={onChange("password")} placeholder="Leave blank to keep current password" />
          </div>

          <div style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
            Member since: {createdAt ? new Date(createdAt).toLocaleDateString() : "-"}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
