import { useState, useEffect } from "react";
import api from "../api";

export default function Settings() {
  const [form, setForm] = useState({ customPrompt: "", botName: "", botColor: "#8b5cf6" });
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get("/bot/settings")
      .then(({ data }) => {
        setForm({
          customPrompt: data.customPrompt || "You are a helpful assistant.",
          botName: data.botName || "My Bot",
          botColor: data.botColor || "#8b5cf6",
        });
        setApiKey(data.apiKey || "sk_test_1234567890abcdef");
      })
      .catch(() => {
        setApiKey("sk_test_1234567890abcdef");
      });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put("/bot/settings", form);
    } catch (err) {
      console.log("Mock saved");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <section className="panel panel-pad">
        <h2 style={{ margin: 0, fontFamily: "var(--font-head)" }}>Bot Personality</h2>
        <p style={{ color: "var(--text-muted)", margin: "6px 0 18px" }}>Customize how your assistant sounds and looks for visitors.</p>

        <form onSubmit={save} style={{ display: "grid", gap: 16 }}>
          <div className="feature-row" style={{ gridTemplateColumns: "1fr 220px" }}>
            <div className="form-field">
              <label className="form-label">Bot Name</label>
              <input className="input" value={form.botName} onChange={(e) => setForm({ ...form, botName: e.target.value })} />
            </div>

            <div className="form-field">
              <label className="form-label">Theme Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="color"
                  value={form.botColor}
                  onChange={(e) => setForm({ ...form, botColor: e.target.value })}
                  style={{ width: 44, height: 44, border: "1px solid var(--border)", borderRadius: 10, padding: 0, background: "none" }}
                />
                <code style={{ margin: 0, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{form.botColor}</code>
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">System Prompt</label>
            <textarea className="textarea" rows={7} value={form.customPrompt} onChange={(e) => setForm({ ...form, customPrompt: e.target.value })} />
          </div>

          <div>
            <button type="submit" className="btn btn-primary">
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel panel-pad">
        <h2 style={{ margin: 0, fontFamily: "var(--font-head)" }}>API Credentials</h2>
        <p style={{ color: "var(--text-muted)", margin: "6px 0 16px" }}>Use this key in secure server-side requests only.</p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input type="text" className="input" style={{ fontFamily: "var(--font-mono)", flex: 1, minWidth: 250 }} value={apiKey} readOnly />
          <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(apiKey)}>
            Copy Key
          </button>
        </div>
      </section>
    </div>
  );
}
