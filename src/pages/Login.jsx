import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const colors = {
  primary: '#1a5c2a',
  deep: '#0f3a1a',
  gold: '#c8a84b',
  goldLight: '#e2c878',
  bg: '#f5f7f3',
  surface: '#ffffff',
  surface2: '#eef4ec',
  border: '#c2d9c5',
  dim: '#5a7a5e',
  text: '#1e3a22',
}

function Field({ label, children, hint }) {
  const child = React.Children.only(children)
  const childName = child.props.name
  const id = childName ? `field-${childName}` : undefined
  const childWithId = id ? React.cloneElement(child, { id }) : child
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
      {hint ? <div style={{ fontSize: 11, color: colors.dim }}>{hint}</div> : null}
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
        background: colors.bg,
        padding: '10px 12px',
        fontSize: 13,
        color: colors.text,
        outline: 'none',
        fontFamily: 'IBM Plex Sans, sans-serif',
        boxSizing: 'border-box',
        ...props.style,
      }}
    />
  )
}

function Button({ variant = 'primary', style, ...props }) {
  const base = {
    border: 'none',
    borderRadius: 7,
    cursor: 'pointer',
    padding: '10px 14px',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    transition: 'all 0.2s ease',
    ...style,
  }

  const variants = {
    primary: {
      color: '#fff',
      background: `linear-gradient(135deg, ${colors.primary}, #2e8b45)`,
      boxShadow: '0 2px 8px rgba(26,92,42,0.25)',
    },
    secondary: {
      color: colors.text,
      background: colors.surface,
      border: `1px solid ${colors.border}`,
    },
    gold: {
      color: colors.deep,
      background: `linear-gradient(135deg, ${colors.goldLight}, ${colors.gold})`,
      boxShadow: '0 2px 8px rgba(200,168,75,0.24)',
    },
  }

  return <button {...props} style={{ ...base, ...variants[variant] }} />
}

export default function Login() {
  const { user, loading, loginWithEmail, loginWithGoogle, registerWithEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = useMemo(() => location.state?.from || '/dashboard', [location.state])
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true })
    }
  }, [loading, navigate, redirectTo, user])

  const handleSubmit = async event => {
    event.preventDefault()
    setBusy(true)

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password)
        toast.success('Signed in successfully')
      } else {
        await registerWithEmail(email, password)
        toast.success('Account created successfully')
      }
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error?.message || 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    setBusy(true)
    try {
      await loginWithGoogle()
      toast.success('Signed in with Google')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error?.message || 'Google sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.bg,
        color: colors.text,
        fontFamily: 'IBM Plex Sans, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(26,92,42,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(26,92,42,0.05) 0%, transparent 50%), linear-gradient(rgba(26,92,42,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(26,92,42,0.025) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.deep} 0%, ${colors.primary} 50%, #236b35 100%)`,
            padding: '14px 32px',
            borderBottom: `3px solid ${colors.gold}`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            <img src="/pnc-logo.png" alt="PNC Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'EB Garamond, Georgia, serif',
                fontSize: 26,
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '0.01em',
                lineHeight: 1.1,
              }}
            >
              Laboratory Consumable Monitoring System
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
              Laboratory inventory, alerts, and issuance tracking
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', textAlign: 'right' }}>
            <div>
              <div
                style={{
                  fontFamily: 'EB Garamond, Georgia, serif',
                  fontSize: 26,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '0.01em',
                  lineHeight: 1.1,
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
                Pamantasan ng Cabuyao
              </div>
            </div>
          </div>
        </div>

        <main
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '36px 24px 48px',
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          <section
            style={{
              backgroundImage: `linear-gradient(rgba(15,58,26,0.18), rgba(15,58,26,0.18)), url('/pnc-bg.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 18,
              minHeight: 'calc(100vh - 210px)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 10px 28px rgba(26,92,42,0.08)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,35,18,0.15), rgba(8,35,18,0.35))' }} />
          </section>

          <section
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 18,
              boxShadow: '0 10px 28px rgba(26,92,42,0.08)',
              padding: 26,
              alignSelf: 'center',
            }}
          >
            <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: colors.primary, marginBottom: 6 }}>
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </div>
            <div style={{ color: colors.dim, fontSize: 13, marginBottom: 20 }}>
              Use your University of Cabuyao credentials to continue.
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              <Button
                variant={mode === 'login' ? 'primary' : 'secondary'}
                type="button"
                style={{ flex: 1 }}
                onClick={() => setMode('login')}
              >
                Login
              </Button>
              <Button
                variant={mode === 'register' ? 'gold' : 'secondary'}
                type="button"
                style={{ flex: 1 }}
                onClick={() => setMode('register')}
              >
                Register
              </Button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
              <Field label="Email Address">
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@uc.edu.ph" required />
              </Field>
              <Field label="Password" hint="At least 6 characters">
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required minLength={6} />
              </Field>

              <Button type="submit" variant="primary" disabled={busy} style={{ marginTop: 4 }}>
                {busy ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
              <div style={{ height: 1, background: colors.border, flex: 1 }} />
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.15em', color: colors.dim }}>OR</div>
              <div style={{ height: 1, background: colors.border, flex: 1 }} />
            </div>

            <Button type="button" variant="secondary" onClick={handleGoogle} disabled={busy} style={{ width: '100%' }}>
              Sign in with Google
            </Button>

            <div style={{ marginTop: 18, fontSize: 12, color: colors.dim, lineHeight: 1.6 }}>
              By continuing, you agree to use this system only for official laboratory operations at the University of Cabuyao.
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
