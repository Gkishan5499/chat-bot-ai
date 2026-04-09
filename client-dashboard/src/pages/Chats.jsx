import { useState } from 'react';

const mockChats = [
    { id: 1, name: 'Visitor 492', time: '10:42 AM', preview: 'I need help with my billing...', unread: 2 },
    { id: 2, name: 'Visitor 812', time: 'Yesterday', preview: 'Can the bot integrate with Shopify?', unread: 0 },
    { id: 3, name: 'Sarah from Acme', time: 'Yesterday', preview: 'Thanks, that solved it!', unread: 0 },
];

export default function Chats() {
    const [activeChat, setActiveChat] = useState(1);

    return (
        <div className="glass-panel" style={{ display: 'flex', height: 'calc(100vh - 140px)', overflow: 'hidden', padding: 0 }}>
            {/* Sidebar */}
            <div style={{ width: 320, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                    <input type="text" className="form-input" placeholder="Search conversations..." />
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {mockChats.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChat(chat.id)}
                            style={{ 
                                padding: '16px 20px', 
                                borderBottom: '1px solid var(--border)', 
                                cursor: 'pointer',
                                background: activeChat === chat.id ? 'var(--accent-light)' : 'transparent',
                                transition: 'all 0.2s',
                                borderLeft: activeChat === chat.id ? '3px solid var(--accent)' : '3px solid transparent'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-h)' }}>{chat.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text)' }}>{chat.time}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                                    {chat.preview}
                                </span>
                                {chat.unread > 0 && (
                                    <div style={{ background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>
                                        {chat.unread}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Visitor 492</h3>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Take Over Chat</button>
                </div>
                
                <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ alignSelf: 'flex-start', background: 'var(--bg-base)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '70%', boxShadow: 'var(--shadow-sm)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-h)' }}>Hello! How can I help you today?</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text)', marginTop: 4, display: 'block' }}>Bot • 10:41 AM</span>
                    </div>

                    <div style={{ alignSelf: 'flex-end', background: 'var(--accent)', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '70%', boxShadow: 'var(--shadow-sm)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>I need help with my billing, it seems I was double charged this month.</p>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: 4, display: 'block' }}>10:42 AM</span>
                    </div>
                </div>

                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <input type="text" className="form-input" placeholder="Type a message to reply..." style={{ flex: 1, borderRadius: 24 }} />
                        <button className="btn" style={{ borderRadius: 24, width: 44, height: 44, padding: 0 }}>
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
