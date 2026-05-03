const colors = {
  primary: '#1a5c2a',
  light: '#2e8b45',
  gold: '#c8a84b',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  bg: '#f5f7f3',
  surface: '#ffffff',
  surface2: '#eef4ec',
  warn: '#b87d00',
  danger: '#b32020',
  dangerBg: '#fff0f0',
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(26,92,42,0.06)',
      }}
    >
      <div
        style={{
          fontFamily: 'EB Garamond, Georgia, serif',
          fontSize: 16,
          fontWeight: 600,
          color: colors.primary,
          marginBottom: 18,
          paddingBottom: 12,
          borderBottom: `2px solid ${colors.surface2}`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function RowButton({ children, tone = 'secondary', onClick }) {
  const variants = {
    secondary: { background: colors.surface, color: colors.bright, border: `1px solid #8fb89a` },
    success: { background: '#f0fff4', color: colors.primary, border: '1px solid rgba(26,92,42,0.25)' },
    danger: { background: colors.dangerBg, color: colors.danger, border: '1px solid rgba(179,32,32,0.25)' },
  }

  return (
    <button
      type="button"
      onClick={onClick}
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

function ItemRow({ item, onRestock, onReassign, onArchive, onRestore }) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(194,217,197,0.5)' }}>
      <td style={{ padding: '13px 16px', fontSize: 13 }}>
        <div style={{ fontWeight: 600, color: colors.bright }}>{item.name}</div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: colors.dim, marginTop: 2 }}>
          {item.id}
        </div>
      </td>
      <td style={{ padding: '13px 16px', fontSize: 13 }}>{item.type}</td>
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
          {item.meta}
        </span>
      </td>
      <td style={{ padding: '13px 16px', fontSize: 13 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {onRestock ? <RowButton tone="success" onClick={() => onRestock(item)}>Restock</RowButton> : null}
          {onReassign ? <RowButton onClick={() => onReassign(item)}>Reassign</RowButton> : null}
          {item.archived ? (
            onRestore ? <RowButton tone="success" onClick={() => onRestore(item)}>Restore</RowButton> : null
          ) : (
            onArchive ? <RowButton tone="danger" onClick={() => onArchive(item)}>{item.type === 'Department' ? 'Delete' : 'Archive'}</RowButton> : null
          )}
        </div>
      </td>
    </tr>
  )
}

export default function ManageSettings({
  departments = [],
  categories = [],
  onRestoreCategory,
  onArchiveCategory,
  onDeleteDepartment,
  onReassignDepartment,
  onAddDepartment,
  onAddCategory,
}) {
  return (
    <section>
      <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: colors.primary, marginBottom: 16 }}>
        Manage Settings
      </div>

      <SectionCard title="Departments">
        <form
          onSubmit={event => {
            event.preventDefault()
            onAddDepartment?.(new FormData(event.currentTarget), event.currentTarget)
          }}
          style={{ display: 'flex', gap: 10, marginBottom: 16 }}
        >
          <input
            name="name"
            placeholder="New department name"
            aria-label="New department name"
            style={{
              flex: 1,
              borderRadius: 7,
              border: `1px solid ${colors.border}`,
              background: colors.bg,
              padding: '9px 12px',
              fontSize: 13,
              color: colors.bright,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 18px',
              borderRadius: 7,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`,
              color: '#fff',
            }}
          >
            + Add Department
          </button>
        </form>

        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: `linear-gradient(90deg, #0f3a1a, #1a5c2a)` }}>
                {['Department', 'Meta', 'Actions'].map(head => (
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
              {departments.map(dept => (
                <ItemRow
                  key={dept.id ?? dept.name}
                  item={{
                    ...dept,
                    type: 'Department',
                    meta: dept.createdAt ? 'Created' : 'Managed entry',
                  }}
                  onRestock={null}
                  onReassign={onReassignDepartment ? () => onReassignDepartment(dept) : null}
                  onArchive={onDeleteDepartment ? () => onDeleteDepartment(dept) : null}
                  onRestore={null}
                />
              ))}
              {!departments.length ? (
                <tr>
                  <td colSpan={3} style={{ padding: 28, textAlign: 'center', color: colors.dim, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
                    No departments found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Categories">
        <form
          onSubmit={event => {
            event.preventDefault()
            onAddCategory?.(new FormData(event.currentTarget), event.currentTarget)
          }}
          style={{ display: 'flex', gap: 10, marginBottom: 16 }}
        >
          <input
            name="name"
            placeholder="New category name"
            aria-label="New category name"
            style={{
              flex: 1,
              borderRadius: 7,
              border: `1px solid ${colors.border}`,
              background: colors.bg,
              padding: '9px 12px',
              fontSize: 13,
              color: colors.bright,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 18px',
              borderRadius: 7,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`,
              color: '#fff',
            }}
          >
            + Add Category
          </button>
        </form>

        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: `linear-gradient(90deg, #0f3a1a, #1a5c2a)` }}>
                {['Category', 'Status', 'Actions'].map(head => (
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
              {categories.map(category => (
                <ItemRow
                  key={category.id ?? category.name}
                  item={{
                    ...category,
                    type: 'Category',
                    meta: category.archived ? 'Archived' : 'Active',
                  }}
                  onRestock={null}
                  onReassign={null}
                  onArchive={category.archived ? null : onArchiveCategory ? () => onArchiveCategory(category) : null}
                  onRestore={category.archived && onRestoreCategory ? () => onRestoreCategory(category) : null}
                />
              ))}
              {!categories.length ? (
                <tr>
                  <td colSpan={3} style={{ padding: 28, textAlign: 'center', color: colors.dim, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
                    No categories found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SectionCard>

    </section>
  )
}
