import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithApple,
  resetPassword,
  supabase,
} from '../supabase'

const slides = [
  { emoji: '🧘', title: 'Find your calm', sub: 'Guided meditations for every moment of your day.' },
  { emoji: '🌙', title: 'Sleep like never before', sub: 'Wind down with sleep casts and soundscapes.' },
  { emoji: '🎯', title: 'Train your focus', sub: 'Build a daily mindfulness habit that actually sticks.' },
]

export default function Auth() {
  const [screen, setScreen] = useState('onboarding') // onboarding | login | signup | forgot
  const [slide, setSlide] = useState(0)
  const { login } = useStore()

  // Auto-advance slides
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 3500)
    return () => clearInterval(t)
  }, [])

  // Listen for Supabase auth state (handles OAuth redirects)
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u = session.user
        login({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || u.email?.split('@')[0] || 'Friend',
          avatar: (u.user_metadata?.name || u.email || 'U')[0].toUpperCase(),
        })
      }
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', flexDirection: 'column' }}>
      {screen === 'onboarding' && <OnboardingSlides slides={slides} slide={slide} setSlide={setSlide} onNext={() => setScreen('signup')} onLogin={() => setScreen('login')} />}
      {screen === 'signup' && <SignupForm onLogin={() => setScreen('login')} onSuccess={login} onBack={() => setScreen('onboarding')} />}
      {screen === 'login' && <LoginForm onSignup={() => setScreen('signup')} onForgot={() => setScreen('forgot')} onSuccess={login} onBack={() => setScreen('onboarding')} />}
      {screen === 'forgot' && <ForgotPassword onBack={() => setScreen('login')} />}
    </div>
  )
}

// ─── Onboarding Slides ────────────────────────────────────────────────────────
function OnboardingSlides({ slides, slide, setSlide, onNext, onLogin }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 28px 20px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            style={{ textAlign: 'center', maxWidth: 340 }}>
            <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: 88, marginBottom: 36 }}>{slides[slide].emoji}</motion.div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
              {slides[slide].title}
            </div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              {slides[slide].sub}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingBottom: 32 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)}
            style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, background: i === slide ? '#FF6B35' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s', cursor: 'pointer' }} />
        ))}
      </div>

      {/* CTAs */}
      <div style={{ padding: '0 24px 52px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onNext}
          style={{ padding: '18px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Get started free →
        </motion.button>
        <button onClick={onLogin}
          style={{ padding: '16px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
          I already have an account
        </button>
      </div>
    </div>
  )
}

// ─── Signup Form ──────────────────────────────────────────────────────────────
function SignupForm({ onLogin, onSuccess, onBack }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPass, setShowPass] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signUpWithEmail({ email, password, name })
      setSuccess(true)
    } catch (err) {
      // Demo mode fallback
      if (err.message?.includes('placeholder') || err.message?.includes('fetch')) {
        onSuccess({ name, email, avatar: name[0]?.toUpperCase() || 'U' })
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApple = async () => {
    setLoading(true)
    try {
      await signInWithApple()
    } catch (err) {
      setError('Apple Sign In requires Supabase to be configured')
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>📧</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'white', marginBottom: 12 }}>Check your email!</div>
      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 32 }}>
        We sent a confirmation link to <strong style={{ color: 'white' }}>{email}</strong>. Click it to activate your account.
      </div>
      <button onClick={onLogin} style={{ padding: '16px 40px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        Back to sign in →
      </button>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '52px 0 32px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: 'white' }}>Create account</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Start your free 7-day trial</div>
        </div>
      </div>

      {/* Apple Sign In */}
      <AppleButton onClick={handleApple} loading={loading} label="Sign up with Apple" />

      <Divider />

      {/* Form */}
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <InputField label="First name" value={name} onChange={setName} placeholder="Alex" type="text" required />
        <InputField label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" required />
        <InputField label="Password" value={password} onChange={setPassword} placeholder="Min. 6 characters" type={showPass ? 'text' : 'password'} required
          rightEl={<button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer' }}>{showPass ? 'Hide' : 'Show'}</button>} />
        <InputField label="Confirm password" value={confirm} onChange={setConfirm} placeholder="Repeat password" type={showPass ? 'text' : 'password'} required />

        <PasswordStrength password={password} />

        {error && <ErrorBox message={error} />}

        <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
          style={{ marginTop: 4, padding: '18px', borderRadius: 50, border: 'none', background: loading ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {loading ? '⟳ Creating account...' : 'Create account →'}
        </motion.button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
        Already have an account?{' '}
        <button onClick={onLogin} style={{ background: 'none', border: 'none', color: '#FF6B35', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign in</button>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', paddingBottom: 40 }}>
        By signing up you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  )
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ onSignup, onForgot, onSuccess, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPass, setShowPass] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { user } = await signInWithEmail({ email, password })
      if (user) {
        onSuccess({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || email.split('@')[0],
          avatar: (user.user_metadata?.name || email)[0].toUpperCase(),
        })
      }
    } catch (err) {
      if (err.message?.includes('placeholder') || err.message?.includes('fetch')) {
        onSuccess({ name: email.split('@')[0], email, avatar: email[0].toUpperCase() })
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApple = async () => {
    setLoading(true)
    try {
      await signInWithApple()
    } catch (err) {
      setError('Apple Sign In requires Supabase to be configured')
      setLoading(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '52px 0 32px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: 'white' }}>Welcome back</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Sign in to continue your practice</div>
        </div>
      </div>

      <AppleButton onClick={handleApple} loading={loading} label="Sign in with Apple" />
      <Divider />

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <InputField label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" required />
        <InputField label="Password" value={password} onChange={setPassword} placeholder="Your password" type={showPass ? 'text' : 'password'} required
          rightEl={<button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer' }}>{showPass ? 'Hide' : 'Show'}</button>} />

        <div style={{ textAlign: 'right', marginTop: -6 }}>
          <button type="button" onClick={onForgot} style={{ background: 'none', border: 'none', color: '#FF6B35', fontSize: 13, cursor: 'pointer' }}>
            Forgot password?
          </button>
        </div>

        {error && <ErrorBox message={error} />}

        <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
          style={{ padding: '18px', borderRadius: 50, border: 'none', background: loading ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {loading ? '⟳ Signing in...' : 'Sign in →'}
        </motion.button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
        Don't have an account?{' '}
        <button onClick={onSignup} style={{ background: 'none', border: 'none', color: '#FF6B35', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign up free</button>
      </div>
    </div>
  )
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      if (err.message?.includes('placeholder') || err.message?.includes('fetch')) {
        setSent(true)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '52px 0 32px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: 'white' }}>Reset password</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>We'll send you a reset link</div>
        </div>
      </div>

      {sent ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(62,207,178,0.1)', border: '1px solid rgba(62,207,178,0.3)', borderRadius: 20, padding: '28px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>📬</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 8 }}>Reset link sent!</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Check your inbox at <strong style={{ color: 'white' }}>{email}</strong> and follow the link to reset your password.
          </div>
          <button onClick={onBack} style={{ marginTop: 20, padding: '14px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Back to sign in →
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InputField label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" required />
          {error && <ErrorBox message={error} />}
          <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
            style={{ padding: '18px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            {loading ? '⟳ Sending...' : 'Send reset link →'}
          </motion.button>
        </form>
      )}
    </div>
  )
}

// ─── Shared UI Components ─────────────────────────────────────────────────────

function AppleButton({ onClick, loading, label }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClick} disabled={loading} type="button"
      style={{ width: '100%', padding: '16px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
      <svg width="18" height="18" viewBox="0 0 814 1000" fill="white">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 681.2 0 574.8 0 326.6 147.7 196.3 293 196.3c69.3 0 126.9 45.4 170.9 45.4 42.4 0 109.1-48 188.9-48 30.5.1 111.4 3.7 170.3 81.2zm-234.2-130.9c28-33.2 48.1-79.4 48.1-125.6 0-6.5-.6-13-1.9-18.3-45.5 1.7-99.4 30.4-131.8 68-25.4 28.7-49.3 74.9-49.3 122.1 0 7.1 1.3 14.3 1.9 16.6 2.6.6 6.5 1.3 10.4 1.3 41.1 0 92.7-27.8 122.6-64.1z"/>
      </svg>
      {label}
    </motion.button>
  )
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>or continue with email</div>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type, required, rightEl }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 500 }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', padding: rightEl ? '14px 60px 14px 18px' : '14px 18px', borderRadius: 14, border: `1.5px solid ${focused ? '#FF6B35' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }} />
        {rightEl && <div style={{ position: 'absolute', right: 14 }}>{rightEl}</div>}
      </div>
    </div>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  const strength = password.length < 6 ? 0 : password.length < 8 ? 1 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3 : 2
  const labels = ['Too short', 'Weak', 'Good', 'Strong']
  const colors = ['#EF5350', '#FF7043', '#FFC64A', '#3ECFB2']
  return (
    <div style={{ marginTop: -6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: colors[strength] }}>{labels[strength]}</div>
    </div>
  )
}

function ErrorBox({ message }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(239,83,80,0.12)', border: '1px solid rgba(239,83,80,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#EF9090', display: 'flex', alignItems: 'center', gap: 8 }}>
      ⚠️ {message}
    </motion.div>
  )
}
