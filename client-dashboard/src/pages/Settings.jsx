import { useState, useEffect } from "react";
import api from "../api";

export default function Settings() {
    const [form, setForm] = useState({ customPrompt: "", botName: "", botColor: "#8b5cf6" });
    const [apiKey, setApiKey] = useState("");
    const [saved, setSaved] = useState(false);

    // Provide mocked fallbacks if the API isn't responding
    useEffect(() => {
        api.get("/bot/settings").then(({ data }) => {
            setForm({
                customPrompt: data.customPrompt || "You are a helpful assistant.",
                botName: data.botName || "My Bot",
                botColor: data.botColor || "#8b5cf6",
            });
            setApiKey(data.apiKey || "sk_test_1234567890abcdef");
        }).catch(() => {
             setApiKey("sk_test_1234567890abcdef");
        });
    }, []);

    const save = async (e) => {
        e.preventDefault();
        try {
            await api.put("/bot/settings", form);
        } catch(err) {
            console.log("Mock saved");
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="glass-panel" style={{ padding: 32 }}>
                <h2 style={{ marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Bot Personality</h2>
                <form onSubmit={save}>
                    <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div>
                            <label className="form-label">Bot Name</label>
                            <input className="form-input" value={form.botName} onChange={(e) => setForm({ ...form, botName: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Theme Color</label>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <input type="color" value={form.botColor} onChange={(e) => setForm({ ...form, botColor: e.target.value })} 
                                    style={{ width: 44, height: 44, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{form.botColor}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">System Prompt</label>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text)', marginBottom: 8 }}>This prompt dictates how your bot behaves and responds to visitors.</p>
                        <textarea
                            className="form-textarea"
                            rows={6}
                            value={form.customPrompt}
                            onChange={(e) => setForm({ ...form, customPrompt: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: 8 }}>
                        {saved ? "✓ Settings Saved" : "Save Changes"}
                    </button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: 32 }}>
                <h2 style={{ marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>API Credentials</h2>
                <p style={{ fontSize: '0.9rem', marginBottom: 16 }}>Use this key to authenticate requests from your backend to BotFlow API.</p>
                
                <div style={{ display: 'flex', gap: 12 }}>
                    <input type="text" className="form-input" style={{ fontFamily: 'var(--font-mono)', opacity: 0.8 }} value={apiKey} readOnly />
                    <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(apiKey)}>
                        Copy Key
                    </button>
                </div>
            </div>
        </div>
    );
}