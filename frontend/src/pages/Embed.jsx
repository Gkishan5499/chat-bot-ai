import { useState, useEffect } from "react";
import api from "../api";

export default function Embed() {
  const [apiKey, setApiKey] = useState("sk_test_fallback");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get("/bot/settings")
      .then(({ data }) => {
        if (data.apiKey) setApiKey(data.apiKey);
      })
      .catch(() => {});
  }, []);

  const baseUrl = (import.meta.env.VITE_API_URL || "https://api.botflow.io").replace("/api", "");
  const embedCode = `<script src="${baseUrl}/widget.js" data-api-key="${apiKey}"></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      <div className="panel panel-pad">
        <h1 style={{ margin: 0, fontFamily: "var(--font-head)" }}>Install Widget</h1>
        <p style={{ color: "var(--text-muted)", margin: "8px 0 16px" }}>
          Place this script before the <code>{"</body>"}</code> tag on your website to launch the assistant.
        </p>

        <pre className="embed-code">{embedCode}</pre>

        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={copyCode} className={`btn ${copied ? "btn-secondary" : "btn-primary"}`}>
            {copied ? "Copied" : "Copy Snippet"}
          </button>
        </div>
      </div>
    </div>
  );
}
