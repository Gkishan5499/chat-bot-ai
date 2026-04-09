import { useState, useEffect } from 'react';
import api from '../api';

export default function Chats() {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        api.get('/admin/chats')
            .then(res => setChats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const timeAgo = (date) => {
        const s = Math.floor((new Date() - new Date(date)) / 1000);
        if (s < 60) return `${s}s ago`;
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
                <h2 style={{ color: 'var(--text-h)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
                    All Conversations
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                    {chats.length} total chat sessions across all clients
                </p>
            </div>

            {loading ? (
                <div style={{ color: 'var(--text)', padding: 20 }}>Loading conversations...</div>
            ) : chats.length === 0 ? (
                <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: 'var(--text)' }}>
                    No conversations yet. Once visitors chat with deployed bots, they'll appear here.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {chats.map(chat => (
                        <div
                            key={chat._id}
                            className="glass-panel"
                            style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => setExpanded(expanded === chat._id ? null : chat._id)}
                        >
                            <div style={{
                                padding: '16px 20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <div style={{ fontSize: '1.5rem' }}>💬</div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-h)' }}>
                                            {chat.userId?.name || 'Unknown Client'} — {chat.userId?.botName || 'Bot'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginTop: 2 }}>
                                            Visitor: {chat.visitorId} • {chat.messages?.length || 0} messages
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text)' }}>{timeAgo(chat.updatedAt)}</span>
                                    <span style={{ color: 'var(--text)', fontSize: '0.75rem' }}>
                                        {expanded === chat._id ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>

                            {expanded === chat._id && (
                                <div style={{
                                    borderTop: '1px solid var(--border)',
                                    padding: '16px 20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                    maxHeight: 300,
                                    overflowY: 'auto'
                                }}>
                                    {chat.messages?.map((msg, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                                background: msg.role === 'user' ? 'var(--primary-light)' : 'var(--bg-elevated)',
                                                color: msg.role === 'user' ? 'var(--primary)' : 'var(--text-h)',
                                                padding: '8px 14px',
                                                borderRadius: 10,
                                                maxWidth: '80%',
                                                fontSize: '0.8rem',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            <span style={{ fontWeight: 600, fontSize: '0.7rem', opacity: 0.7 }}>
                                                {msg.role === 'user' ? '👤 Visitor' : '🤖 Bot'}
                                            </span>
                                            <br />
                                            {msg.content}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
