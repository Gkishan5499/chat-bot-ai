import { useState, useEffect } from "react";
import PreviewChatWidget from "../components/PreviewChatWidget";
import api from "../api";

export default function WidgetPreview() {
  const [botConfig, setBotConfig] = useState({ botName: "AI Assistant", botColor: "#8b5cf6", apiKey: "" });

  useEffect(() => {
    api
      .get("/bot/settings")
      .then(({ data }) => {
        if (data.botName) {
          setBotConfig({
            botName: data.botName,
            botColor: data.botColor,
            apiKey: data.apiKey || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      <div>
        <h1 style={{ margin: 0, fontFamily: "var(--font-head)" }}>Widget Playground</h1>
        <p style={{ color: "var(--text-muted)", margin: "8px 0 0" }}>Preview your assistant on a sample website before publishing.</p>
      </div>

      <div className="widget-frame">
        <div style={{ height: "100%", width: "100%", background: "#f8fafc" }}>
          <div style={{ height: 58, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.5px" }}>AcmeCorp.</div>
            <div style={{ display: "flex", gap: 18, fontSize: "0.86rem", color: "#64748b", fontWeight: 600 }}>
              <span>Products</span>
              <span>Solutions</span>
              <span>Pricing</span>
            </div>
          </div>
          <div style={{ padding: "56px 24px", maxWidth: 760 }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 18, color: "#0f172a", lineHeight: 1.1 }}>Build better products, faster than ever.</h2>
            <p style={{ fontSize: "1.05rem", color: "#64748b", lineHeight: 1.6, maxWidth: 620, marginBottom: 28 }}>
              AcmeCorp provides modern infrastructure for scaling your online business. Open the assistant in the corner to test the experience.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ padding: "10px 20px", background: "#0f172a", color: "#fff", borderRadius: 10, fontWeight: 600 }}>Get Started</div>
              <div style={{ padding: "10px 20px", background: "#fff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: 10, fontWeight: 600 }}>
                View Documentation
              </div>
            </div>
          </div>
        </div>

        <PreviewChatWidget name={botConfig.botName} color={botConfig.botColor} apiKey={botConfig.apiKey} />
      </div>
    </div>
  );
}
