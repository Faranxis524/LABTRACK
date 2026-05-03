import { FiArrowUpCircle, FiCheckCircle, FiX, FiEye, FiEdit } from 'react-icons/fi'

const colors = {
  primary: '#1a5c2a',
  light: '#2e8b45',
  warn: '#b87d00',
  danger: '#b32020',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  surface: '#ffffff',
  surface2: '#eef4ec',
  okBg: '#f0fff4',
  lowBg: '#fffbec',
  dangerBg: '#fff0f0',
}

function Badge({ status, ordered }) {
  const config = ordered
    ? { label: 'ORDERED', background: '#eef5ff', color: '#1a4ea6', border: 'rgba(26,78,166,0.2)' }
    : status === 'critical'
      ? { label: 'CRITICAL', background: colors.dangerBg, color: colors.danger, border: 'rgba(179,32,32,0.25)' }
      : status === 'low'
        ? { label: 'LOW', background: colors.lowBg, color: colors.warn, border: 'rgba(184,125,0,0.25)' }
        : { label: 'OK', background: colors.okBg, color: colors.primary, border: 'rgba(26,92,42,0.2)' }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 20,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.05em',
        background: config.background,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  )
}

function ActionButton({ children, tone = 'secondary', onClick, ...props }) {
  const variants = {
    secondary: { background: colors.surface, color: colors.bright, border: `1px solid #8fb89a` },
    success: { background: colors.okBg, color: colors.primary, border: '1px solid rgba(26,92,42,0.25)' },
    danger: { background: colors.dangerBg, color: colors.danger, border: '1px solid rgba(179,32,32,0.25)' },
  }

  return (
    <button
      type="button"
      onClick={onClick}
      {...props}
      style={{
        padding: '5px 11px',
        borderRadius: 7,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11,
        fontWeight: 500,
        cursor: 'pointer',
        letterSpacing: '0.04em',
        ...variants[tone],
      }}
    >
      {children}
    </button>
  )
}

export default function InventoryTable({ items = [], onRestock, onToggleOrdered, onDelete, onView, onEdit }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(26,92,42,0.06)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: `linear-gradient(90deg, #0f3a1a, #1a5c2a)` }}>
            {['Item / CAS No.', 'Category', 'Department / Lab', 'Current Stock', 'Reorder Point', 'Unit', 'Stock Level', 'Status', 'Actions'].map(head => (
              <th
                key={head}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.75)',
                  fontWeight: 500,
                }}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const p = Math.min(100, Math.round((item.stock / item.max) * 100))
            const status = item.status || (item.stock <= item.critical ? 'critical' : item.stock <= item.reorder ? 'low' : 'ok')
            const fill = status === 'critical' ? colors.danger : status === 'low' ? colors.warn : colors.primary

            return (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(194,217,197,0.5)' }}>
                <td style={{ padding: '13px 16px', fontSize: 13 }}>
                  <div style={{ fontWeight: 600, color: colors.bright }}>{item.name}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: colors.dim, marginTop: 2 }}>{item.cas || 'N/A'}</div>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13 }}>{item.categoryName || item.category || '—'}</td>
                <td style={{ padding: '13px 16px', fontSize: 13 }}>
                  <span
                    style={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: 11,
                      background: colors.surface2,
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: `1px solid ${colors.border}`,
                      color: colors.primary,
                    }}
                  >
                    {item.departmentName || item.dept || '—'}
                  </span>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>{Number.isInteger(item.stock) ? item.stock : Number.parseFloat(Number(item.stock).toFixed(2))}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', color: colors.dim }}>{Number.isInteger(item.reorder) ? item.reorder : Number.parseFloat(Number(item.reorder).toFixed(2))}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', color: colors.dim }}>{item.unit}</td>
                <td style={{ padding: '13px 16px', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 80, height: 7, background: colors.surface2, borderRadius: 4, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
                      <div style={{ height: '100%', width: `${p}%`, borderRadius: 4, background: `linear-gradient(90deg, ${fill}, ${status === 'critical' ? '#e03535' : status === 'low' ? '#e0a020' : '#56b86e'})` }} />
                    </div>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: colors.dim }}>{p}%</span>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13 }}>
                  <Badge status={status} ordered={item.ordered} />
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <ActionButton tone="secondary" onClick={() => onView?.(item)}>
                      <FiEye style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 6 }}>View</span>
                    </ActionButton>
                    <ActionButton tone="secondary" onClick={() => onEdit?.(item)}>
                      <FiEdit style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 6 }}>Edit</span>
                    </ActionButton>
                    <ActionButton tone="success" onClick={() => onRestock?.(item)}>
                      <FiArrowUpCircle style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 6 }}>Stock</span>
                    </ActionButton>
                    <ActionButton tone="secondary" onClick={() => onToggleOrdered?.(item)}>
                      {item.ordered ? <><FiCheckCircle style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 6 }}>Ordered</span></> : 'Order'}
                    </ActionButton>
                    <ActionButton tone="danger" onClick={() => onDelete?.(item)} aria-label="Delete item">
                      <FiX />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
