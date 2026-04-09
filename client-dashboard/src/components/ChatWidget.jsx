import { useState } from 'react';

export default function ChatWidget({ color = "#8b5cf6", name = "AI Assistant" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi there! How can I help you today?' }]);
    const [input, setInput] = useState('');

    const send = (e) => {
        e.preventDefault();
        if(!input.trim()) return;
        setMessages([...messages, { sender: 'user', text: input }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'bot', text: 'I am a mockup preview widget!' }]);
        }, 600);
    }

    return (
        <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
            {isOpen && (
                <div className="glass-panel" style={{ width: 350, height: 500, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fade-in 0.3s ease-out', background: 'var(--bg-base)' }}>
                    {/* Header */}
                    <div style={{ background: color, padding: '16px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🤖</div>
                            <span style={{ fontWeight: 600 }}>{name}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}>✕</button>
                    </div>

                    {/* Chat log */}
                    <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ 
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                background: m.sender === 'user' ? color : 'var(--bg-card)',
                                color: m.sender === 'user' ? 'white' : 'var(--text-h)',
                                padding: '10px 14px',
                                borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                maxWidth: '85%',
                                fontSize: '0.9rem',
                                boxShadow: 'var(--shadow-sm)',
                                border: m.sender === 'bot' ? '1px solid var(--border)' : 'none'
                             }}>
                                {m.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={send} style={{ padding: '12px 16px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." style={{ flex: 1, padding: '10px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-h)', outline: 'none' }} />
                        <button type="submit" style={{ background: color, color: 'white', border: 'none', width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button onClick={() => setIsOpen(true)} style={{ background: color, color: 'white', width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                    💬
                </button>
            )}
        </div>
    );
}
