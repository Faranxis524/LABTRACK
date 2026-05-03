import { FiX } from 'react-icons/fi'

const colors = {
  primary: '#1a5c2a',
  light: '#2e8b45',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  bg: '#f5f7f3',
  surface: '#ffffff',
  surface2: '#eef4ec',
}

export default function ViewItemModal({ open = false, item = null, onClose }) {
  if (!open || !item) return null

  const renderValue = (value, fallback = '—') => {
    if (value === null || value === undefined || value === '') return fallback
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,58,26,0.45)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28, width: 580, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(15,58,26,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${colors.surface2}` }}>
          <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: colors.primary }}>Item Details</div>
           <button type="button" onClick={onClose} aria-label="Close modal" style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.dim, fontSize: 16, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>
             <FiX />
           </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontWeight: 600, color: colors.bright, fontSize: 16 }}>{item.name}</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: colors.dim, marginTop: 2 }}>CAS: {renderValue(item.cas, 'N/A')}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Category</div>
            <div style={{ fontSize: 13 }}>{renderValue(item.categoryName || item.category)}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Department / Lab</div>
            <div style={{ fontSize: 13 }}>{renderValue(item.departmentName || item.dept)}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Current Stock</div>
            <div style={{ fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>{renderValue(item.stock)}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Reorder Point</div>
            <div style={{ fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>{renderValue(item.reorder)}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Critical Threshold</div>
            <div style={{ fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>{renderValue(item.critical)}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Max Capacity</div>
            <div style={{ fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>{renderValue(item.max)}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Unit</div>
            <div style={{ fontSize: 13 }}>{renderValue(item.unit)}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Status</div>
            <div style={{ fontSize: 13, textTransform: 'capitalize' }}>{renderValue(item.status)}</div>
          </div>

          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Ordered</div>
            <div style={{ fontSize: 13 }}>{renderValue(item.ordered)}</div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Supplier</div>
            <div style={{ fontSize: 13 }}>{renderValue(item.supplier)}</div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Catalog / SKU</div>
            <div style={{ fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>{renderValue(item.catalog)}</div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Storage Location</div>
            <div style={{ fontSize: 13 }}>{renderValue(item.location)}</div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.dim, marginBottom: 4 }}>Notes / Hazard / Handling</div>
            <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{renderValue(item.notes)}</div>
          </div>

          {item.createdAt && (
            <div style={{ gridColumn: '1 / -1', marginTop: 8, paddingTop: 12, borderTop: `1px dashed ${colors.border}`, fontSize: 11, color: colors.dim, fontFamily: 'IBM Plex Mono, monospace' }}>
              Created: {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : String(item.createdAt)}
              {item.updatedAt && ` · Updated: ${item.updatedAt?.toDate ? item.updatedAt.toDate().toLocaleString() : String(item.updatedAt)}`}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 18px', borderRadius: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: `1px solid ${colors.border}`, background: colors.surface, color: colors.bright, letterSpacing: '0.04em' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
