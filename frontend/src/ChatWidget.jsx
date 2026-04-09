import { useState } from 'react';

export default function ChatWidget({ apiKey, color = "#4F46E5", name = "AI Assistant" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [visitorId] = useState(() => "visitor-" + Math.random().toString(36).substr(2, 9));

    const send = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

            const res = await fetch(`${apiUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    apiKey: apiKey,
                    visitorId: visitorId,
                    history: messages
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to connect to BotFlow API'}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Network error. Make sure backend is running." }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
            {isOpen && (
                <div className="w-[350px] h-[500px] flex flex-col overflow-hidden rounded-2xl shadow-2xl bg-white border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
                    {/* Header */}
                    <div style={{ background: color }} className="px-5 py-4 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
                            <span className="font-semibold">{name}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="bg-transparent border-none text-white text-xl cursor-pointer p-0 opacity-80 hover:opacity-100 transition-opacity">
                            ✕
                        </button>
                    </div>

                    {/* Chat log */}
                    <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 text-sm mt-4">
                                Send a message to start chatting!
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i}
                                style={{
                                    background: m.role === 'user' ? color : 'white',
                                    color: m.role === 'user' ? 'white' : '#1f2937',
                                }}
                                className={`px-4 py-2.5 max-w-[85%] text-sm shadow-sm ${m.role === 'user'
                                        ? 'self-end rounded-[16px_16px_4px_16px]'
                                        : 'self-start rounded-[16px_16px_16px_4px] border border-gray-100'
                                    }`}
                            >
                                {m.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="self-start bg-white border border-gray-100 text-gray-500 px-4 py-2.5 rounded-[16px_16px_16px_4px] text-sm shadow-sm flex gap-1">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce delay-100">.</span>
                                <span className="animate-bounce delay-200">.</span>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={send} className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-800 text-sm outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            style={{ background: color }}
                            className="text-white border-none w-10 h-10 rounded-full cursor-pointer flex items-center justify-center disabled:opacity-50 transition-transform active:scale-95"
                            disabled={isLoading || !input.trim()}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{ background: color }}
                    className="text-white w-14 h-14 rounded-full border-none cursor-pointer text-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-transform"
                >
                    💬
                </button>
            )}
        </div>
    );
}
