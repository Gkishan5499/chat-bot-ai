export default function Billing() {
    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
            <h1 className="text-gradient" style={{ marginBottom: 16 }}>Manage Your Plan</h1>
            <p style={{ color: 'var(--text)', marginBottom: 48, fontSize: '1.1rem' }}>Choose the plan that fits your business needs.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'stretch', textAlign: 'left' }}>
                <div className="glass-panel" style={{ padding: 40, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Starter</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: 24 }}>Free</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> 100 chats/month</li>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> Standard AI Models</li>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> 1 Team Member</li>
                    </ul>
                    <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Current Plan</button>
                </div>

                <div className="glass-panel" style={{ padding: 40, display: 'flex', flexDirection: 'column', transform: 'scale(1.05)', borderColor: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent), var(--shadow-lg)', zIndex: 1, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -12, right: 32, background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>MOST POPULAR</div>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: 'var(--accent)' }}>Pro</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: 24 }}>$29<span style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 400 }}>/mo</span></div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> 5,000 chats/month</li>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> Advanced Models (GPT-4)</li>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> Remove BotFlow Branding</li>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> Email Support</li>
                    </ul>
                    <button className="btn" style={{ width: '100%', justifyContent: 'center' }}>Upgrade to Pro</button>
                </div>

                <div className="glass-panel" style={{ padding: 40, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Business</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: 24 }}>$99<span style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 400 }}>/mo</span></div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> Unlimited chats</li>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> Custom Fine-tuning</li>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> Priority 24/7 Support</li>
                        <li style={{ display: 'flex', gap: 12 }}><span style={{ color: 'var(--accent)' }}>✓</span> Dedicated Account Manager</li>
                    </ul>
                    <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Contact Sales</button>
                </div>
            </div>
        </div>
    );
}
