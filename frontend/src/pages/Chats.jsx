import { useState } from "react";

const mockChats = [
  { id: 1, name: "Visitor 492", time: "10:42 AM", preview: "I need help with my billing...", unread: 2 },
  { id: 2, name: "Visitor 812", time: "Yesterday", preview: "Can the bot integrate with Shopify?", unread: 0 },
  { id: 3, name: "Sarah from Acme", time: "Yesterday", preview: "Thanks, that solved it!", unread: 0 },
];

export default function Chats() {
  const [activeChat, setActiveChat] = useState(1);

  return (
    <div className="page">
      <div className="panel chat-page">
        <div className="chat-list">
          <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
            <input type="text" className="input" placeholder="Search conversations..." />
          </div>

          <div style={{ maxHeight: "100%", overflowY: "auto" }}>
            {mockChats.map((chat) => (
              <div key={chat.id} onClick={() => setActiveChat(chat.id)} className={`chat-item ${activeChat === chat.id ? "active" : ""}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <strong style={{ fontSize: "0.9rem" }}>{chat.name}</strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{chat.time}</span>
                </div>
                <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.preview}</span>
                  {chat.unread > 0 && (
                    <span className="chip pos" style={{ background: "var(--brand)", color: "white" }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: "var(--font-head)", fontSize: "1.05rem" }}>Visitor 492</h3>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Active now</span>
            </div>
            <button className="btn btn-secondary" style={{ padding: "8px 12px" }}>Take Over Chat</button>
          </div>

          <div style={{ flex: 1, minHeight: 260, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="chat-msg bot">Hello! How can I help you today?</div>
            <div className="chat-msg user">I need help with my billing, it seems I was double charged this month.</div>
            <div className="chat-msg bot">I can help with that. Could you share the invoice number?</div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", padding: 12, display: "flex", gap: 10 }}>
            <input type="text" className="input" placeholder="Type a message to reply..." />
            <button className="btn btn-primary" style={{ minWidth: 100 }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
