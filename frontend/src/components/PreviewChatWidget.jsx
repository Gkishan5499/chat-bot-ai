import { useState } from "react";

export default function PreviewChatWidget({ color = "#8b5cf6", name = "AI Assistant", apiKey = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hi there! How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [visitorId] = useState(() => "preview-visitor-" + Math.random().toString(36).slice(2, 10));

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const updatedMessages = [...messages, { sender: "user", text: userText }];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      if (!apiKey) {
        setMessages((prev) => [...prev, { sender: "bot", text: "Missing API key. Save bot settings first." }]);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const history = updatedMessages
        .slice(0, -1)
        .map((m) => ({ role: m.sender === "bot" ? "assistant" : "user", content: m.text }));

      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          apiKey,
          visitorId,
          history,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: `Error: ${data.error || "Failed to get reply"}` }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Network error. Make sure backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: "absolute", bottom: 18, right: 18, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      {isOpen && (
        <div className="panel" style={{ width: 340, height: 480, display: "flex", flexDirection: "column", overflow: "hidden", animation: "fade-in 0.24s ease-out" }}>
          <div style={{ background: color, padding: "14px 16px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 30, height: 30, background: "rgba(255,255,255,0.2)", borderRadius: "9px", display: "grid", placeItems: "center", fontSize: "0.88rem" }}>AI</div>
              <span style={{ fontWeight: 600 }}>{name}</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer", padding: 0, opacity: 0.9 }}>
              ✕
            </button>
          </div>

          <div style={{ flex: 1, padding: 14, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  background: m.sender === "user" ? color : "#ffffff",
                  color: m.sender === "user" ? "white" : "var(--text-h)",
                  padding: "9px 12px",
                  borderRadius: m.sender === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  maxWidth: "85%",
                  fontSize: "0.85rem",
                  border: m.sender === "bot" ? "1px solid #e2e8f0" : "none",
                }}
              >
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#ffffff",
                  color: "var(--text-h)",
                  padding: "9px 12px",
                  borderRadius: "14px 14px 14px 4px",
                  maxWidth: "85%",
                  fontSize: "0.85rem",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span style={{ fontWeight: 600 }}>Typing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            )}
          </div>

          <form onSubmit={send} style={{ padding: "10px 12px", background: "#ffffff", borderTop: "1px solid #e2e8f0", display: "flex", gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="input" style={{ borderRadius: 999 }} />
            <button type="submit" style={{ background: color, color: "white", border: "none", width: 38, height: 38, borderRadius: 999, cursor: "pointer", display: "grid", placeItems: "center" }}>
              ➤
            </button>
          </form>

          <div style={{ padding: "0 12px 10px", background: "#ffffff", borderTop: "1px solid #f8fafc", textAlign: "center", fontSize: "11px", color: "#9ca3af" }}>
            Powerd by Gbot-AI
          </div>
        </div>
      )}

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={{ background: color, color: "white", width: 54, height: 54, borderRadius: 999, border: "none", cursor: "pointer", fontSize: "1.2rem", fontWeight: 700, display: "grid", placeItems: "center", boxShadow: "0 10px 22px rgba(15,23,42,0.25)" }}>
          AI
        </button>
      )}
    </div>
  );
}
