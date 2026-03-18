import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0) // 0=logo, 1=tagline, 2=done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1800)
    const t3 = setTimeout(() => onDone(), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'linear-gradient(160deg, #FF6B35 0%, #1A1A2E 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ fontSize: 72 }}>
            🧘
          </motion.div>

          {/* App name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 42, fontWeight: 400, color: 'white',
              letterSpacing: -1,
            }}>
            Hu Zen
          </motion.div>

          {/* Tagline */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 }}>
                Find your calm
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading bar */}
          <motion.div
            style={{
              position: 'absolute', bottom: 60, left: '50%',
              transform: 'translateX(-50%)', width: 120,
              height: 3, background: 'rgba(255,255,255,0.15)',
              borderRadius: 3, overflow: 'hidden',
            }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              style={{ height: '100%', background: 'rgba(255,255,255,0.7)', borderRadius: 3 }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
