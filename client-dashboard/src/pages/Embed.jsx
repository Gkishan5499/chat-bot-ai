import { useState, useEffect } from "react";
import api from "../api";

export default function Embed() {
    const [apiKey, setApiKey] = useState("sk_test_fallback");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get("/bot/settings").then(({ data }) => {
            if(data.apiKey) setApiKey(data.apiKey);
        }).catch(() => {});
    }, []);

    const baseUrl = (import.meta.env.VITE_API_URL || 'https://api.botflow.io').replace('/api', '');
    const embedCode = `<script src="${baseUrl}/widget.js" data-api-key="${apiKey}"></script>`;

    const copyCode = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔗</div>
                <h1 className="text-gradient">Install Widget</h1>
                <p style={{ fontSize: '1.1rem', marginBottom: 32, color: 'var(--text)' }}>
                    Copy and paste this snippet right before the <code style={{background:'rgba(0,0,0,0.1)', padding:'2px 6px', borderRadius: 4}}>{"</body>"}</code> tag on every page you want the bot to appear.
                </p>

                <div style={{ position: 'relative', textAlign: 'left', background: 'var(--bg-base)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>index.html</span>
                    </div>
                    <pre style={{ margin: 0, padding: 24, fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--text-h)', overflowX: 'auto' }}>
                        {embedCode}
                    </pre>
                    <button 
                        onClick={copyCode}
                        className="btn" 
                        style={{ position: 'absolute', bottom: 16, right: 16, padding: '8px 16px', fontSize: '0.8rem', borderRadius: 20 }}
                    >
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
    );
}
