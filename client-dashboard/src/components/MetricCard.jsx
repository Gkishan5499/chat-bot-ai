export default function MetricCard({ title, value, change, isPositive, icon }) {
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text)', margin: 0, fontWeight: 500 }}>{title}</h3>
          <div style={{ fontSize: '2rem', color: 'var(--text-h)', fontWeight: 700, margin: '8px 0' }}>{value}</div>
        </div>
        <div style={{ 
          background: 'var(--accent-light)', 
          color: 'var(--accent)', 
          width: 48, height: 48, 
          borderRadius: 12, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {icon}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
        <span style={{ 
          color: isPositive ? '#10b981' : '#ef4444', 
          background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          padding: '2px 8px', borderRadius: 12, fontWeight: 500
        }}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span style={{ color: 'var(--text)', opacity: 0.8 }}>from last month</span>
      </div>
    </div>
  )
}
