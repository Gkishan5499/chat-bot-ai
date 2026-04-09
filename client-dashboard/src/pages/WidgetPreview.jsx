import { useState, useEffect } from 'react';
import ChatWidget from '../components/ChatWidget';
import api from '../api';

export default function WidgetPreview() {
    const [botConfig, setBotConfig] = useState({ botName: "AI Assistant", botColor: "#8b5cf6" });

    useEffect(() => {
        api.get("/bot/settings").then(({ data }) => {
            if(data.botName) setBotConfig({ botName: data.botName, botColor: data.botColor });
        }).catch(() => {});
    }, []);

    return (
        <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Widget Playground</h1>
                <p style={{ color: 'var(--text)' }}>Test how your bot appears and interacts on a live website.</p>
            </div>

            <div style={{ flex: 1, position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: '#fff', boxShadow: 'var(--shadow-md)' }}>
                {/* Mock Website Frame */}
                <div style={{ height: '100%', width: '100%', background: '#f8fafc' }}>
                    <div style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 40px', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.5px' }}>AcmeCorp.</div>
                        <div style={{ display: 'flex', gap: 24, fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                            <span>Products</span><span>Solutions</span><span>Pricing</span>
                        </div>
                    </div>
                    <div style={{ padding: '80px 40px', maxWidth: 800 }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: 24 }}>
                            Build better products, <br/>faster than ever.
                        </div>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6, maxWidth: 600, marginBottom: 40 }}>
                            AcmeCorp provides the best infrastructure for scaling your online business. Talk to our assistant below to learn more.
                        </p>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ padding: '12px 24px', background: '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 500 }}>Get Started</div>
                            <div style={{ padding: '12px 24px', background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: 8, fontWeight: 500 }}>View Documentation</div>
                        </div>
                    </div>
                </div>

                {/* The Widget */}
                <ChatWidget name={botConfig.botName} color={botConfig.botColor} />
            </div>
        </div>
    );
}
