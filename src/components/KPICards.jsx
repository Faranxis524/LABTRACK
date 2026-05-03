const colors = {
  primary: '#1a5c2a',
  light: '#2e8b45',
  warn: '#b87d00',
  danger: '#b32020',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  surface: '#ffffff',
  okBg: '#f0fff4',
}

function Card({ label, value, sub, tone }) {
  const top =
    tone === 'green'
      ? `linear-gradient(90deg, ${colors.primary}, ${colors.light})`
      : tone === 'warn'
        ? `linear-gradient(90deg, ${colors.warn}, #e0a020)`
        : tone === 'danger'
          ? `linear-gradient(90deg, ${colors.danger}, #e03535)`
          : 'linear-gradient(90deg, #2e8b45, #56b86e)'

  const valueColor = tone === 'warn' ? colors.warn : tone === 'danger' ? colors.danger : colors.primary

  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(26,92,42,0.07)',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: top }} />
      <div
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: colors.dim,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 34,
          fontWeight: 600,
          color: valueColor,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: colors.dim }}>{sub}</div>
    </div>
  )
}

export default function KPICards({ total = 0, ok = 0, low = 0, critical = 0 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 28,
      }}
    >
      <Card label="Total Items" value={total} sub="tracked consumables" tone="green" />
      <Card label="In Stock" value={ok} sub="adequate supply" tone="ok" />
      <Card label="Low Stock" value={low} sub="near reorder point" tone="warn" />
      <Card label="Critical" value={critical} sub="immediate action needed" tone="danger" />
    </div>
  )
}
