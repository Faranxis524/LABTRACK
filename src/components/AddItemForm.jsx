import React from 'react'

const colors = {
  primary: '#1a5c2a',
  light: '#2e8b45',
  gold: '#c8a84b',
  border: '#c2d9c5',
  borderDark: '#8fb89a',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  bg: '#f5f7f3',
  surface: '#ffffff',
  surface2: '#eef4ec',
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

function Field({ label, children, span = 1 }) {
  const child = React.Children.only(children)
  const childName = child.props.name
  const id = childName ? `field-${childName}` : undefined
  const childWithId = id ? React.cloneElement(child, { id }) : child
  return (
    <div style={{ gridColumn: `span ${span}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: colors.dim,
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      {childWithId}
    </div>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        borderRadius: 7,
        border: `1px solid ${colors.border}`,
        background: props.readOnly ? '#f0fff4' : colors.bg,
        padding: '9px 12px',
        fontSize: 13,
        color: props.readOnly ? colors.primary : colors.bright,
        outline: 'none',
        fontFamily: 'IBM Plex Sans, sans-serif',
        fontWeight: props.readOnly ? 500 : 400,
        boxSizing: 'border-box',
        ...props.style,
      }}
    />
  )
}

function Select(props) {
  return (
    <select
      {...props}
      style={{
        width: '100%',
        borderRadius: 7,
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        padding: '9px 12px',
        fontSize: 13,
        color: colors.bright,
        outline: 'none',
        fontFamily: 'IBM Plex Sans, sans-serif',
        boxSizing: 'border-box',
        ...props.style,
      }}
    />
  )
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%',
        minHeight: 70,
        resize: 'vertical',
        borderRadius: 7,
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        padding: '9px 12px',
        fontSize: 13,
        color: colors.bright,
        outline: 'none',
        fontFamily: 'IBM Plex Sans, sans-serif',
        boxSizing: 'border-box',
        ...props.style,
      }}
    />
  )
}

function Button({ variant = 'primary', style, ...props }) {
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`,
      color: '#fff',
      boxShadow: '0 2px 8px rgba(26,92,42,0.25)',
    },
    secondary: {
      background: colors.surface,
      border: `1px solid ${colors.borderDark}`,
      color: colors.bright,
    },
  }

  return (
    <button
      {...props}
      style={{
        padding: '8px 18px',
        borderRadius: 7,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.2s',
        letterSpacing: '0.04em',
        ...variants[variant],
        ...style,
      }}
    />
  )
}

export default function AddItemForm({
  universityName = 'University of Cabuyao (Pamantasan ng Cabuyao)',
  departments = [],
  categories = [],
  units = ['mL', 'L', 'g', 'kg', 'mg', 'µL', 'pcs', 'box', 'pack', 'vial', 'bottle', 'cylinder'],
  onSubmit,
  onClear,
  submitLabel = 'Save Item',
}) {
  const handleSubmit = event => {
    event.preventDefault()
    if (onSubmit) onSubmit(new FormData(event.currentTarget), event.currentTarget)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: colors.primary, marginBottom: 16 }}>
        Add New Consumable
      </div>

      <SectionCard title="University & Department Assignment">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <Field label="University / Institution" span={2}>
            <Input name="university" value={universityName} readOnly />
          </Field>
          <Field label="Department / Laboratory *">
            <Select name="departmentId" defaultValue="" required>
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept.id ?? dept.name} value={dept.id ?? dept.name}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Item Information">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <Field label="Item / Chemical / Material Name *" span={2}>
            <Input name="name" placeholder="e.g. Hydrochloric Acid, Micropipette Tips 200µL" required />
          </Field>
          <Field label="Category *">
            <Select name="categoryId" defaultValue="" required>
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.id ?? category.name} value={category.id ?? category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="CAS Number">
            <Input name="cas" placeholder="e.g. 7647-01-0" />
          </Field>
          <Field label="Supplier">
            <Input name="supplier" placeholder="e.g. Sigma-Aldrich" />
          </Field>
          <Field label="Catalog / Product #">
            <Input name="catalog" placeholder="e.g. H9892" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Stock & Thresholds">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <Field label="Current Stock *">
            <Input name="stock" type="number" min="0" placeholder="0" required />
          </Field>
          <Field label="Unit of Measure *">
            <Select name="unit" defaultValue="" required>
              <option value="">Select unit</option>
              {units.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Reorder Point *">
            <Input name="reorder" type="number" min="0" placeholder="0" required />
          </Field>
          <Field label="Critical Level">
            <Input name="critical" type="number" min="0" placeholder="0" />
          </Field>
          <Field label="Max Stock Capacity">
            <Input name="max" type="number" min="0" placeholder="0" />
          </Field>
          <Field label="Location / Storage">
            <Input name="location" placeholder="e.g. Cabinet A, Shelf 2" />
          </Field>
          <Field label="Notes / Hazard / Handling" span={3}>
            <Textarea name="notes" placeholder="Hazard class, special handling requirements, expiry, etc." />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <Button type="submit" variant="primary">
            {submitLabel}
          </Button>
          <Button type="button" variant="secondary" onClick={event => onClear?.(event.currentTarget.form)}>
            Clear
          </Button>
        </div>
      </SectionCard>
    </form>
  )
}
