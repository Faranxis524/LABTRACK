import React from 'react'

import { FiCheck, FiX } from 'react-icons/fi'

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
  okBg: '#f0fff4',
}

function Field({ label, children, span = 1 }) {
  const child = React.Children.only(children)
  const childName = child.props.name
  const id = childName ? `field-${childName}` : undefined
  const childWithId = id ? React.cloneElement(child, { id }) : child
  return (
    <div style={{ gridColumn: `span ${span}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.dim, fontWeight: 500 }}>
        {label}
      </label>
      {childWithId}
    </div>
  )
}

function Input(props) {
  return <input {...props} style={{ width: '100%', borderRadius: 7, border: `1px solid ${colors.border}`, background: colors.bg, padding: '9px 12px', fontSize: 13, color: colors.bright, outline: 'none', fontFamily: 'IBM Plex Sans, sans-serif', boxSizing: 'border-box', ...props.style }} />
}

function Select(props) {
  return <select {...props} style={{ width: '100%', borderRadius: 7, border: `1px solid ${colors.border}`, background: colors.bg, padding: '9px 12px', fontSize: 13, color: colors.bright, outline: 'none', fontFamily: 'IBM Plex Sans, sans-serif', boxSizing: 'border-box', ...props.style }} />
}

function Textarea(props) {
  return <textarea {...props} style={{ width: '100%', minHeight: 70, resize: 'vertical', borderRadius: 7, border: `1px solid ${colors.border}`, background: colors.bg, padding: '9px 12px', fontSize: 13, color: colors.bright, outline: 'none', fontFamily: 'IBM Plex Sans, sans-serif', boxSizing: 'border-box', ...props.style }} />
}

function Button({ variant = 'primary', ...props }) {
  const styles = {
    primary: { background: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`, color: '#fff', boxShadow: '0 2px 8px rgba(26,92,42,0.25)' },
    secondary: { background: colors.surface, border: `1px solid ${colors.borderDark}`, color: colors.bright },
  }
  return <button {...props} style={{ padding: '8px 18px', borderRadius: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', letterSpacing: '0.04em', ...styles[variant], ...props.style }} />
}

export default function EditItemModal({ open = false, item = null, departments = [], categories = [], onClose, onSubmit }) {
  if (!open || !item) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,58,26,0.45)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28, width: 580, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(15,58,26,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${colors.surface2}` }}>
          <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: colors.primary }}>Edit Item</div>
          <button type="button" onClick={onClose} aria-label="Close modal" style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.dim, fontSize: 16, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}><FiX /></button>
        </div>

        <form
          onSubmit={event => {
            event.preventDefault()
            onSubmit?.(new FormData(event.currentTarget), event.currentTarget)
          }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
        >
          <Field label="Item / Chemical / Material Name *" span={2}>
            <Input name="name" defaultValue={item.name} required />
          </Field>
          <Field label="CAS Number" span={2}>
            <Input name="cas" defaultValue={item.cas || ''} />
          </Field>
          <Field label="Department / Laboratory *" span={2}>
            <Select name="departmentId" defaultValue={item.departmentId || item.dept || ''} required>
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept.id ?? dept.name} value={dept.id ?? dept.name}>{dept.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Category *" span={2}>
            <Select name="categoryId" defaultValue={item.categoryId || item.category || ''} required>
              <option value="">Select category</option>
              {categories.filter(c => !c.archived).map(cat => (
                <option key={cat.id ?? cat.name} value={cat.id ?? cat.name}>{cat.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Current Stock *">
            <Input name="stock" type="number" min="0" step="any" defaultValue={item.stock} required />
          </Field>
          <Field label="Unit *">
            <Input name="unit" defaultValue={item.unit} required />
          </Field>
          <Field label="Reorder Point *">
            <Input name="reorder" type="number" min="0" step="any" defaultValue={item.reorder} required />
          </Field>
          <Field label="Critical Threshold *">
            <Input name="critical" type="number" min="0" step="any" defaultValue={item.critical} required />
          </Field>
          <Field label="Max Capacity">
            <Input name="max" type="number" min="0" step="any" defaultValue={item.max || item.stock * 3 || ''} />
          </Field>
          <Field label="Supplier">
            <Input name="supplier" defaultValue={item.supplier || ''} />
          </Field>
          <Field label="Catalog / SKU">
            <Input name="catalog" defaultValue={item.catalog || ''} />
          </Field>
          <Field label="Storage Location">
            <Input name="location" defaultValue={item.location || ''} />
          </Field>
          <Field label="Notes / Hazard / Handling" span={2}>
            <Textarea name="notes" defaultValue={item.notes || ''} />
          </Field>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary"><FiCheck style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 6 }}>Save Changes</span></Button>
          </div>
        </form>
      </div>
    </div>
  )
}
