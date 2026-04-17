import { useEffect, useMemo, useState } from "react";
import api from "../api";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadChats = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/bot/chats");
        setChats(data || []);
        if (data?.length) {
          setActiveChatId(data[0]._id);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  const formatTime = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString();
  };

  const displayName = (chat) => {
    if (!chat?.visitorId) return "Unknown visitor";
    return `Visitor ${chat.visitorId.slice(0, 8)}`;
  };

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return chats;
    return chats.filter((chat) => {
      const lastMessage = chat.messages?.[chat.messages.length - 1]?.content || "";
      return displayName(chat).toLowerCase().includes(query) || lastMessage.toLowerCase().includes(query);
    });
  }, [chats, search]);

  const activeChat = useMemo(() => chats.find((c) => c._id === activeChatId) || null, [chats, activeChatId]);

  const sendReply = async () => {
    if (!draft.trim() || !activeChat) return;
    setSending(true);
    setError("");
    try {
      const { data } = await api.post(`/bot/chats/${activeChat._id}/messages`, {
        role: "assistant",
        content: draft,
      });

      setChats((prev) => {
        const updated = prev.map((chat) => (chat._id === activeChat._id ? data : chat));
        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
      setDraft("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const onSendSubmit = (e) => {
    e.preventDefault();
    sendReply();
  };

  return (
    <div className="page">
      {error && (
        <div style={{ color: "var(--danger)", background: "#fee2e2", borderRadius: 10, padding: "8px 10px", fontSize: "0.88rem" }}>
          {error}
        </div>
      )}

      <div className="panel chat-page">
        <div className="chat-list">
          <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
            <input
              type="text"
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
            />
          </div>

          <div style={{ maxHeight: "100%", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 14, color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading conversations...</div>
            ) : filteredChats.length === 0 ? (
              <div style={{ padding: 14, color: "var(--text-muted)", fontSize: "0.9rem" }}>No conversations found.</div>
            ) : (
              filteredChats.map((chat) => {
                const lastMessage = chat.messages?.[chat.messages.length - 1];
                return (
                  <div key={chat._id} onClick={() => setActiveChatId(chat._id)} className={`chat-item ${activeChatId === chat._id ? "active" : ""}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <strong style={{ fontSize: "0.9rem" }}>{displayName(chat)}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatTime(chat.updatedAt)}</span>
                    </div>
                    <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lastMessage?.content || "No messages yet"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: "var(--font-head)", fontSize: "1.05rem" }}>{activeChat ? displayName(activeChat) : "No conversation selected"}</h3>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {activeChat ? `Last updated ${formatTime(activeChat.updatedAt)}` : "Choose a conversation from the left"}
              </span>
            </div>
            <button className="btn btn-secondary" style={{ padding: "8px 12px" }} disabled={!activeChat}>
              Live Support
            </button>
          </div>

          <div style={{ flex: 1, minHeight: 260, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {!activeChat ? (
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Select a conversation to view messages.</div>
            ) : activeChat.messages?.length ? (
              activeChat.messages.map((message, idx) => (
                <div key={`${activeChat._id}-${idx}`} className={`chat-msg ${message.role === "user" ? "user" : "bot"}`}>
                  <div>{message.content}</div>
                  <div style={{ marginTop: 6, fontSize: "0.72rem", opacity: 0.75, textAlign: message.role === "user" ? "right" : "left" }}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>This conversation has no messages yet.</div>
            )}
          </div>

          <form onSubmit={onSendSubmit} style={{ borderTop: "1px solid var(--border)", padding: 12, display: "flex", gap: 10 }}>
            <input
              type="text"
              className="input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={activeChat ? "Type a reply..." : "Select a conversation first"}
              disabled={!activeChat || sending}
            />
            <button type="submit" className="btn btn-primary" style={{ minWidth: 100 }} disabled={!activeChat || sending || !draft.trim()}>
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
