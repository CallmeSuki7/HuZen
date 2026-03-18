import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store'

export default function Success() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { upgradeToPremium } = useStore()
  const [countdown, setCountdown] = useState(5)
  const sessionId = params.get('session_id')

  useEffect(() => {
    // Mark user as premium
    upgradeToPremium()

    // Countdown redirect
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); nav('/'); }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,var(--teal-dark),var(--navy))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' }}>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ fontSize: 90, marginBottom: 28 }}>🎉</motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="serif" style={{ fontSize: 34, color: 'white', marginBottom: 12 }}>Welcome to Plus!</div>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 8 }}>
          Your subscription is active. Unlock 500+ meditations, sleep casts, and more — all yours now.
        </div>
        {sessionId && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 28 }}>
            Order ref: {sessionId.slice(-12).toUpperCase()}
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 36 }}>
          {[['💎', 'Plus active'], ['🔓', 'All unlocked'], ['🎁', 'Trial started']].map(([e, l]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 16px' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{e}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{l}</div>
            </div>
          ))}
        </div>

        <button onClick={() => nav('/')} style={{ padding: '16px 40px', borderRadius: 50, border: 'none', background: 'white', color: 'var(--navy)', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 14 }}>
          Start meditating →
        </button>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          Redirecting in {countdown}s...
        </div>
      </motion.div>
    </div>
  )
}
