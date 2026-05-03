import { FiBox, FiBell, FiFileText, FiPlus, FiPackage } from 'react-icons/fi'

const colors = {
  primary: '#1a5c2a',
  deep: '#0f3a1a',
  mid: '#236b35',
  light: '#2e8b45',
  gold: '#c8a84b',
  goldLight: '#e2c878',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  okBg: '#f0fff4',
}

const tabs = [
  ['inventory', <><FiBox style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 8 }}>Inventory</span></>],
  ['alerts', <><FiBell style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 8 }}>Alerts</span></>],
  ['issuance', <><FiFileText style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 8 }}>Issuance Records</span></>],
  ['add', <><FiPlus style={{ verticalAlign: 'middle' }} /> <span style={{ marginLeft: 8 }}>Add Item</span></>],
]

export default function Navbar({ activeTab = 'inventory', onTabChange, clock, onLogout, systemName = 'LabTrack CMS' }) {
  return (
    <>
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.deep} 0%, ${colors.primary} 50%, ${colors.mid} 100%)`,
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          borderBottom: `3px solid ${colors.gold}`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{ width: 62, height: 62, background: `radial-gradient(circle, ${colors.goldLight}, ${colors.gold})`, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.35)', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
          <FiPackage size={30} color={colors.deep} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'EB Garamond, Georgia, serif',
              fontSize: 26,
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1.1,
              textShadow: '0 1px 6px rgba(0,0,0,0.3)',
            }}
          >
            University of Cabuyao
          </div>
          <div
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: colors.goldLight,
              marginTop: 4,
            }}
          >
            Pamantasan ng Cabuyao · Laboratory Management Division
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 4,
            }}
          >
            System
          </div>
          <div
            style={{
              fontFamily: 'EB Garamond, Georgia, serif',
              fontSize: 18,
              color: colors.goldLight,
              fontWeight: 500,
            }}
          >
            {systemName}
          </div>
        </div>
      </div>

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 32px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 12px rgba(26,92,42,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`, borderRadius: 10, display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(26,92,42,0.25)' }}>
            <FiPackage size={20} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'EB Garamond, Georgia, serif',
                fontSize: 20,
                fontWeight: 600,
                color: colors.primary,
              }}
            >
              Laboratory Consumables Monitor
            </div>
            <div
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: colors.dim,
                marginTop: 1,
              }}
            >
              UC College Laboratories · Chemical & Material Tracking
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: colors.okBg,
              border: '1px solid rgba(26,92,42,0.25)',
              borderRadius: 20,
              padding: '4px 12px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              color: colors.primary,
            }}
          >
            <span style={{ width: 6, height: 6, background: colors.light, borderRadius: '50%' }} />
            LIVE SYSTEM
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: colors.dim }}>{clock}</div>
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              style={{
                padding: '8px 18px',
                borderRadius: 7,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid #8fb89a',
                background: '#fff',
                color: colors.text,
                letterSpacing: '0.04em',
              }}
            >
              Logout
            </button>
          ) : null}
        </div>
      </header>

      <nav
        style={{
          display: 'flex',
          gap: 2,
          padding: '0 32px',
          background: colors.primary,
          borderBottom: `3px solid ${colors.gold}`,
        }}
      >
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange?.(key)}
            style={{
              padding: '11px 22px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === key ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === key ? colors.goldLight : 'rgba(255,255,255,0.65)',
              borderBottom: activeTab === key ? `3px solid ${colors.goldLight}` : '3px solid transparent',
              marginBottom: -3,
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}
