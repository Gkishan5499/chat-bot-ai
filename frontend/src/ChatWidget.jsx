import { useEffect, useMemo, useRef, useState } from 'react';

export default function ChatWidget({ apiKey, color = "#4F46E5", name = "AI Assistant", localOnly = false }) {
    const REPLY_DELAY_MS = 3000;

    const welcomeMessage = {
        role: 'assistant',
        content: `Hi! I am ${name}. Ask me about signup, login, widget install, help articles, or onboarding call.`,
    };
    const [backendFaqs, setBackendFaqs] = useState([]);
    const [faqLoading, setFaqLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState([welcomeMessage]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [visitorId] = useState(() => "visitor-" + Math.random().toString(36).substr(2, 9));
    const messagesEndRef = useRef(null);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    };

    useEffect(() => {
        if (!isOpen) return;
        scrollToBottom("smooth");
    }, [messages, isLoading, isOpen]);

    const normalizeText = (text) =>
        text
            .toLowerCase()
            .replace(/[^a-z0-9\s./-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        const fetchFaqs = async () => {
            setFaqLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                const res = await fetch(`${apiUrl}/chat/faqs`);
                if (!res.ok) return;
                const data = await res.json();
                if (!Array.isArray(data)) return;

                const normalized = data
                    .filter((item) => item?.question && item?.answer)
                    .map((item) => ({
                        keywords: Array.isArray(item.keywords)
                            ? item.keywords.map((k) => String(k).toLowerCase().trim()).filter(Boolean)
                            : [],
                        minMatches: Math.max(1, Number(item.minMatches) || 1),
                        reply: String(item.answer).trim(),
                        question: String(item.question).trim(),
                        showOnBot: item.showOnBot !== false,
                    }));

                setBackendFaqs(normalized);
            } catch (_err) {
                // Keep local defaults if FAQ fetch fails.
            } finally {
                setFaqLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const allIntents = useMemo(() => {
        return backendFaqs.map((item) => {
            const questionWords = item.question
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, " ")
                .split(/\s+/)
                .filter(Boolean)
                .filter((w) => w.length > 2);

            const combinedKeywords = Array.from(new Set([...(item.keywords || []), ...questionWords]));

            return {
                keywords: combinedKeywords,
                minMatches: item.minMatches,
                reply: item.reply,
            };
        });
    }, [backendFaqs]);

    const exactQuestionMap = useMemo(() => {
        const map = new Map();
        for (const item of backendFaqs) {
            map.set(normalizeText(item.question), item.reply);
        }
        return map;
    }, [backendFaqs]);

    const quickQuestions = useMemo(() => {
        const questions = backendFaqs
            .filter((item) => item.showOnBot !== false)
            .map((item) => item.question)
            .filter(Boolean);
        return questions.slice(0, 4);
    }, [backendFaqs]);

    const findIntentReply = (text) => {
        const normalized = normalizeText(text);
        if (!normalized) return null;

        const exactReply = exactQuestionMap.get(normalized);
        if (exactReply) return exactReply;

        let bestMatch = null;
        let bestScore = 0;

        for (const intent of allIntents) {
            const score = intent.keywords.reduce((count, keyword) => {
                return normalized.includes(keyword) ? count + 1 : count;
            }, 0);

            if (score >= (intent.minMatches || 1) && score > bestScore) {
                bestScore = score;
                bestMatch = intent.reply;
            }
        }

        return bestMatch;
    };

    const defaultLocalReply =
        "Please ask one of the listed questions. If you do not see questions yet, wait a moment while we load them from server.";

    const sendMessage = async (text) => {
        const cleanText = text.trim();
        if (!cleanText || isLoading) return;

        const newMessages = [...messages, { role: 'user', content: cleanText }];
        setMessages(newMessages);

        const localReply = findIntentReply(cleanText);
        if (localReply) {
            setIsLoading(true);
            await sleep(REPLY_DELAY_MS);
            setMessages([...newMessages, { role: 'assistant', content: localReply }]);
            setIsLoading(false);
            return;
        }

        if (localOnly) {
            setIsLoading(true);
            await sleep(REPLY_DELAY_MS);
            setMessages([...newMessages, { role: 'assistant', content: defaultLocalReply }]);
            setIsLoading(false);
            return;
        }

        if (!apiKey) {
            setIsLoading(true);
            await sleep(REPLY_DELAY_MS);
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: "Widget API key is not configured. Please log in and use your account API key from Settings/Embed.",
                },
            ]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const startedAt = Date.now();

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

            const res = await fetch(`${apiUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: cleanText,
                    apiKey: apiKey,
                    visitorId: visitorId,
                    history: newMessages.slice(0, -1)
                })
            });

            const data = await res.json();
            const elapsed = Date.now() - startedAt;
            if (elapsed < REPLY_DELAY_MS) {
                await sleep(REPLY_DELAY_MS - elapsed);
            }

            if (!res.ok) {
                const errorText = String(data.error || "").toLowerCase();
                if (errorText.includes("invalid api key")) {
                    setMessages(prev => [...prev, { role: 'assistant', content: defaultLocalReply }]);
                } else {
                    setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to connect to BotFlow API'}` }]);
                }
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }
        } catch (err) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < REPLY_DELAY_MS) {
                await sleep(REPLY_DELAY_MS - elapsed);
            }
            setMessages(prev => [...prev, { role: 'assistant', content: defaultLocalReply }]);
        } finally {
            setIsLoading(false);
        }
    };

    const send = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const text = input;
        setInput('');
        await sendMessage(text);
    };

    const showQuickQuestions = messages.filter((m) => m.role === 'user').length === 0 && !isLoading;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 font-sans">
            {isOpen && (
                <div className="w-[min(92vw,360px)] h-[min(72vh,520px)] flex flex-col overflow-hidden rounded-2xl shadow-2xl bg-white border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <div style={{ background: color }} className="px-4 py-3 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">AI</div>
                            <span className="font-semibold">{name}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="bg-transparent border-none text-white text-xl cursor-pointer p-0 opacity-80 hover:opacity-100 transition-opacity">
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
                        {messages.map((m, i) => (
                            <div key={i}
                                style={{
                                    background: m.role === 'user' ? color : 'white',
                                    color: m.role === 'user' ? 'white' : '#1f2937',
                                }}
                                className={`px-4 py-2.5 max-w-[88%] text-sm shadow-sm ${m.role === 'user'
                                        ? 'self-end rounded-[14px_14px_4px_14px]'
                                        : 'self-start rounded-[14px_14px_14px_4px] border border-slate-200'
                                    }`}
                            >
                                {m.content}
                            </div>
                        ))}

                        {showQuickQuestions && quickQuestions.length > 0 && (
                            <div className="self-end mt-1 flex w-full max-w-[92%] flex-col items-end gap-2">
                                {quickQuestions.map((question) => (
                                    <button
                                        key={question}
                                        type="button"
                                        onClick={() => sendMessage(question)}
                                        className="rounded-xl border border-emerald-500 bg-white px-3 py-2 text-right text-sm text-emerald-700 transition hover:bg-emerald-50"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        )}

                        {showQuickQuestions && quickQuestions.length === 0 && faqLoading && (
                            <div className="self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                                Loading questions...
                            </div>
                        )}

                        {isLoading && (
                            <div className="self-start bg-white border border-slate-200 text-slate-500 px-4 py-2.5 rounded-[14px_14px_14px_4px] text-sm shadow-sm flex items-center gap-1">
                                <span className="font-medium">Typing</span>
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce delay-100">.</span>
                                <span className="animate-bounce delay-200">.</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={send} className="px-3 py-3 bg-white border-t border-slate-200 flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 bg-slate-50 text-slate-800 text-sm outline-none focus:border-teal-600 focus:bg-white transition-colors"
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
                    className="text-white w-14 h-14 rounded-full border-none cursor-pointer text-sm font-bold flex items-center justify-center shadow-[0_12px_26px_rgba(0,0,0,0.24)] hover:scale-105 active:scale-95 transition-transform"
                >
                    AI
                </button>
            )}
        </div>
    );
}
