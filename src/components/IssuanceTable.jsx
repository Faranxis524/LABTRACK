const colors = {
  primary: '#1a5c2a',
  deep: '#0f3a1a',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  surface: '#ffffff',
  surface2: '#eef4ec',
}

export default function IssuanceTable({ rows = [] }) {
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
          <tr style={{ background: `linear-gradient(90deg, ${colors.deep}, ${colors.primary})` }}>
            {['Date & Time', 'Item', 'Qty Issued', 'Unit', 'Department / Lab', 'Requester', 'Purpose / Project', 'Issued By'].map(head => (
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
          {rows.map(row => (
            <tr key={row.id ?? `${row.ts}-${row.item}`} style={{ borderBottom: '1px solid rgba(194,217,197,0.5)' }}>
              <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', color: colors.dim }}>{row.ts}</td>
              <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: colors.bright }}>{row.item}</td>
              <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>{row.qty}</td>
              <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', color: colors.dim }}>{row.unit}</td>
              <td style={{ padding: '13px 16px', fontSize: 13 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 5,
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 11,
                    background: colors.surface2,
                    color: colors.primary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {row.dept}
                </span>
              </td>
              <td style={{ padding: '13px 16px', fontSize: 13 }}>{row.requester}</td>
              <td style={{ padding: '13px 16px', fontSize: 13, color: colors.dim }}>{row.purpose || '—'}</td>
              <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', color: colors.primary }}>{row.by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
