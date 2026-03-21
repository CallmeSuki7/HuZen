import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { signUpWithEmail, signInWithEmail, signInWithApple, resetPassword } from '../supabase'

const slides = [
  { emoji: '🧘', title: 'Find your calm', sub: 'Guided meditations for every moment of your day — from 3 minutes to an hour.' },
  { emoji: '🌙', title: 'Sleep better tonight', sub: 'Wind down with sleep casts, soundscapes, and body-scan techniques.' },
  { emoji: '🎯', title: 'Train your focus', sub: 'Build a daily mindfulness habit and watch your productivity soar.' },
]

export default function Onboarding() {
  const [step, setStep] = useState(0) // 0=slides, 1=auth
  const [mode, setMode] = useState('signup') // signup | signin | reset
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resetSent, setResetSent] = useState(false)
  const login = useStore(s => s.login)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(email)
        if (error) throw error
        setResetSent(true)
        setLoading(false)
        return
      }

      const result = mode === 'signup'
        ? await signUpWithEmail({ email, password, name })
        : await signInWithEmail({ email, password })

      if (result.error) throw result.error

      const user = result.user
      login({
        id: user.id,
        name: user.user_metadata?.full_name || name || email.split('@')[0],
        email: user.email,
        avatar: (user.user_metadata?.full_name || name || email)[0].toUpperCase(),
      })
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link we sent you before signing in.')
      } else if (msg.includes('Invalid login credentials')) {
        setError('Wrong email or password. Please try again.')
      } else if (msg.includes('User already registered')) {
        setError('An account with this email already exists. Try signing in instead.')
      } else if (msg.includes('Password should be')) {
        setError('Password must be at least 8 characters.')
      } else if (msg.includes('rate limit')) {
        setError('Too many attempts. Please wait a few minutes and try again.')
      } else {
        setError(msg || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApple = async () => {
    setLoading(true)
    setError(null)
    const { error } = await signInWithApple()
    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // On success Supabase redirects automatically
  }

  if (step === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px 52px' }}>
        <SlideShow onDone={() => setStep(1)} onSignIn={() => { setStep(1); setMode('signin') }} />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 28px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep(0)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: 'white', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>🧘 Hu Zen</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 28px 40px', maxWidth: 420, margin: '0 auto', width: '100%' }}>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div className="serif" style={{ fontSize: 30, color: 'white', marginBottom: 6 }}>
            {mode === 'signup' ? 'Create your account' : mode === 'signin' ? 'Welcome back' : 'Reset password'}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
            {mode === 'signup' ? '7-day free trial · No credit card needed' : mode === 'signin' ? 'Good to have you back 🙏' : 'Enter your email and we\'ll send a reset link'}
          </div>
        </div>

        {/* Reset sent confirmation */}
        {resetSent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'rgba(62,207,178,0.1)', border: '1px solid rgba(62,207,178,0.3)', borderRadius: 16, padding: '24px', textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 6 }}>Check your email!</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>We sent a password reset link to {email}</div>
            <button onClick={() => { setMode('signin'); setResetSent(false) }} style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--teal)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Back to sign in →
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Name field (signup only) */}
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>First name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Alex" required
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Email address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>

            {/* Password */}
            {mode !== 'reset' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Password</label>
                  {mode === 'signin' && (
                    <button type="button" onClick={() => setMode('reset')} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input value={password} onChange={e => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Your password'} required minLength={8}
                    style={{ width: '100%', padding: '14px 44px 14px 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {/* Password strength */}
                {mode === 'signup' && password.length > 0 && (
                  <PasswordStrength password={password} />
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(239,83,80,0.15)', border: '1px solid rgba(239,83,80,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#EF9595', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
              style={{ padding: '16px', borderRadius: 50, border: 'none', background: loading ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg,var(--orange),var(--yellow))', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading ? '⟳ Please wait...' : mode === 'signup' ? 'Create account →' : mode === 'signin' ? 'Sign in →' : 'Send reset link →'}
            </motion.button>
          </form>
        )}



        {/* Switch mode */}
        {!resetSent && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              {mode === 'signup' ? 'Already have an account? ' : mode === 'signin' ? "Don't have an account? " : 'Remember your password? '}
            </span>
            <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null) }}
              style={{ background: 'none', border: 'none', color: 'var(--teal)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {mode === 'signup' ? 'Sign in' : mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </div>
        )}

        {/* Guest access */}
        <button onClick={() => useStore.getState().login({ name: 'Guest', email: 'guest@huzen.app', avatar: 'G', id: 'guest' })}
          style={{ marginTop: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', width: '100%' }}>
          Continue as guest (limited access)
        </button>

        <div style={{ marginTop: 20, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, lineHeight: 1.6 }}>
          By continuing you agree to our{' '}
          <a href="/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  )
}

// Slide show component
function SlideShow({ onDone, onSignIn }) {
  const [current, setCurrent] = useState(0)
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
          style={{ textAlign: 'center', paddingBottom: 20 }}>
          <motion.div animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 80, marginBottom: 20 }}>{slides[current].emoji}</motion.div>
          <div className="serif" style={{ fontSize: 32, color: 'white', marginBottom: 12, lineHeight: 1.2 }}>{slides[current].title}</div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{slides[current].sub}</div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? 'var(--orange)' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s', cursor: 'pointer' }} />
        ))}
      </div>

      {current < slides.length - 1 ? (
        <button onClick={() => setCurrent(c => c + 1)}
          style={{ padding: '18px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,var(--orange),var(--yellow))', color: 'white', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Next →
        </button>
      ) : (
        <>
          <button onClick={onDone}
            style={{ padding: '18px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,var(--orange),var(--yellow))', color: 'white', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Get started free →
          </button>
          <button onClick={onSignIn}
            style={{ padding: '15px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
            I already have an account
          </button>
        </>
      )}
    </>
  )
}

// Password strength indicator
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'uppercase', pass: /[A-Z]/.test(password) },
    { label: 'number', pass: /[0-9]/.test(password) },
    { label: 'special character', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['#EF5350', '#FF7043', '#FFC64A', '#66BB6A']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {checks.map((c, i) => (
            <span key={i} style={{ fontSize: 11, color: c.pass ? '#66BB6A' : 'rgba(255,255,255,0.3)' }}>
              {c.pass ? '✓' : '·'} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: colors[score - 1] }}>{labels[score - 1]}</span>}
      </div>
    </div>
  )
}
