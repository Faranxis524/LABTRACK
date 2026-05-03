import { FiCheckCircle } from 'react-icons/fi'

const colors = {
  primary: '#1a5c2a',
  warn: '#b87d00',
  danger: '#b32020',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  surface: '#ffffff',
  lowBg: '#fffbec',
  dangerBg: '#fff0f0',
}

function AlertCard({ type, icon, title, meta, time }) {
  const theme =
    type === 'critical'
      ? { border: colors.danger, background: colors.dangerBg }
      : type === 'low'
        ? { border: colors.warn, background: colors.lowBg }
        : { border: '#1a4ea6', background: '#eef5ff' }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        padding: '16px 20px',
        background: theme.background,
        border: `1px solid ${colors.border}`,
        borderLeftWidth: 4,
        borderLeftColor: theme.border,
        borderRadius: 12,
        boxShadow: '0 2px 6px rgba(26,92,42,0.05)',
      }}
    >
      <div style={{ fontSize: 22, marginTop: 1, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: colors.bright, marginBottom: 3, fontSize: 14 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: colors.dim }}>{meta}</div>
      </div>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: colors.dim, flexShrink: 0 }}>
        {time}
      </div>
    </div>
  )
}

export default function AlertsList({ alerts = [], onClearAll }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {alerts.length ? (
        alerts.map(alert => <AlertCard key={`${alert.type}-${alert.title}-${alert.time}`} {...alert} />)
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: colors.dim,
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 13,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 38, marginBottom: 12, opacity: 0.4 }}><FiCheckCircle /></div>
          No active alerts. All consumables are within acceptable levels.
        </div>
      )}

      {onClearAll ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClearAll}
            style={{
              padding: '8px 18px',
              borderRadius: 7,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #8fb89a',
              background: '#fff',
              color: '#1e3a22',
              letterSpacing: '0.04em',
            }}
          >
            Clear All
          </button>
        </div>
      ) : null}
    </div>
  )
}
