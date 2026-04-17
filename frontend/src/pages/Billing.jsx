export default function Billing() {
  return (
    <div className="page">
      <div>
        <h1 style={{ margin: 0, fontFamily: "var(--font-head)" }}>Manage Your Plan</h1>
        <p style={{ color: "var(--text-muted)", margin: "8px 0 0" }}>Choose the plan that fits your support volume and team size.</p>
      </div>

      <div className="billing-grid">
        <article className="price-card">
          <h3 style={{ margin: 0 }}>Starter</h3>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>For new products</p>
          <div style={{ fontFamily: "var(--font-head)", fontSize: "2.3rem", marginTop: 2 }}>Free</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, color: "var(--text-muted)", flex: 1 }}>
            <li>✓ 100 chats/month</li>
            <li>✓ Standard AI models</li>
            <li>✓ 1 team member</li>
          </ul>
          <button className="btn btn-secondary">Current Plan</button>
        </article>

        <article className="price-card popular">
          <span className="badge">Most popular</span>
          <h3 style={{ margin: 0 }}>Pro</h3>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>For growing teams</p>
          <div style={{ fontFamily: "var(--font-head)", fontSize: "2.3rem", marginTop: 2 }}>
            $29 <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/mo</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, color: "var(--text-muted)", flex: 1 }}>
            <li>✓ 5,000 chats/month</li>
            <li>✓ Advanced models</li>
            <li>✓ Remove branding</li>
            <li>✓ Priority email support</li>
          </ul>
          <button className="btn btn-primary">Upgrade to Pro</button>
        </article>

        <article className="price-card">
          <h3 style={{ margin: 0 }}>Business</h3>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>For enterprise support</p>
          <div style={{ fontFamily: "var(--font-head)", fontSize: "2.3rem", marginTop: 2 }}>
            $99 <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/mo</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, color: "var(--text-muted)", flex: 1 }}>
            <li>✓ Unlimited chats</li>
            <li>✓ Custom fine-tuning</li>
            <li>✓ 24/7 priority support</li>
            <li>✓ Dedicated success manager</li>
          </ul>
          <button className="btn btn-secondary">Contact Sales</button>
        </article>
      </div>
    </div>
  );
}
