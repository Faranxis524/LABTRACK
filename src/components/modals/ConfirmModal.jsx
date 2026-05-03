import { FiCheck, FiX } from 'react-icons/fi'

const colors = {
  primary: '#1a5c2a',
  light: '#2e8b45',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  bg: '#f5f7f3',
  surface: '#ffffff',
  surface2: '#eef4ec',
  danger: '#b32020',
  dangerBg: '#fff0f0',
}

export default function ConfirmModal({ open = false, title = 'Confirm', message = '', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onClose, tone = 'danger' }) {
  if (!open) return null

  const tones = {
    danger: { button: `linear-gradient(135deg, ${colors.danger}, #e03535)`, icon: <FiCheck /> },
    primary: { button: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`, icon: <FiCheck /> },
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,58,26,0.45)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28, width: 420, maxWidth: '95vw', boxShadow: '0 20px 60px rgba(15,58,26,0.25)' }}>
        <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: colors.primary, marginBottom: 12 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, color: colors.dim, marginBottom: 24, lineHeight: 1.6 }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 18px', borderRadius: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: `1px solid ${colors.border}`, background: colors.surface, color: colors.bright, letterSpacing: '0.04em' }}>
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm} style={{ padding: '8px 18px', borderRadius: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', boxShadow: '0 2px 8px rgba(26,92,42,0.25)', background: tones[tone].button, color: '#fff', letterSpacing: '0.04em' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
