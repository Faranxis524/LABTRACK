import React from 'react'
import { FiRepeat, FiX } from 'react-icons/fi'

const colors = {
  primary: '#1a5c2a',
  light: '#2e8b45',
  border: '#c2d9c5',
  borderDark: '#8fb89a',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  bg: '#f5f7f3',
  surface: '#ffffff',
  surface2: '#eef4ec',
  dangerBg: '#fff0f0',
  danger: '#b32020',
}

function Field({ label, children }) {
  const child = React.Children.only(children)
  const childName = child.props.name
  const id = childName ? `field-${childName}` : undefined
  const childWithId = id ? React.cloneElement(child, { id }) : child
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
      <label htmlFor={id} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.dim, fontWeight: 500 }}>
        {label}
      </label>
      {childWithId}
    </div>
  )
}

function Select(props) {
  return <select {...props} style={{ width: '100%', borderRadius: 7, border: `1px solid ${colors.border}`, background: colors.bg, padding: '9px 12px', fontSize: 13, color: colors.bright, outline: 'none', fontFamily: 'IBM Plex Sans, sans-serif', boxSizing: 'border-box', ...props.style }} />
}

function Button({ variant = 'primary', ...props }) {
  const styles = {
    primary: { background: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`, color: '#fff', boxShadow: '0 2px 8px rgba(26,92,42,0.25)' },
    secondary: { background: colors.surface, border: `1px solid ${colors.borderDark}`, color: colors.bright },
    danger: { background: colors.dangerBg, border: `1px solid rgba(179,32,32,0.25)`, color: colors.danger },
  }

  return <button {...props} style={{ padding: '8px 18px', borderRadius: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', letterSpacing: '0.04em', ...styles[variant], ...props.style }} />
}

export default function ReassignModal({ open = false, sourceDepartment = null, departments = [], onClose, onSubmit, title = 'Reassign Department Items' }) {
  if (!open || !sourceDepartment) return null

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit?.(new FormData(event.currentTarget), event.currentTarget)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,58,26,0.45)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28, width: 520, maxWidth: '95vw', boxShadow: '0 20px 60px rgba(15,58,26,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${colors.surface2}` }}>
          <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: colors.primary }}>{title}</div>
          <button type="button" onClick={onClose} aria-label="Close modal" style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.dim, fontSize: 16, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}><FiX /></button>
        </div>

        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: colors.dim, letterSpacing: '0.1em', marginBottom: 16 }}>
          MOVE ALL ITEMS FROM {sourceDepartment.name}
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Reassign to Department *">
            <Select name="targetDepartmentId" defaultValue="" required>
              <option value="">Select target department</option>
              {departments
                .filter(dept => (dept.id ?? dept.name) !== (sourceDepartment.id ?? sourceDepartment.name))
                .map(dept => (
                  <option key={dept.id ?? dept.name} value={dept.id ?? dept.name}>
                    {dept.name}
                  </option>
                ))}
            </Select>
          </Field>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button type="submit" variant="primary"><FiRepeat style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 6 }}>Confirm Reassignment</span></Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="button" variant="danger" onClick={onClose}>Delete Source</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
