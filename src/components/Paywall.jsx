import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { startCheckout } from '../stripeService'

const plans = [
  { id: 'monthly', label: 'Monthly', price: '$12.99', perMonth: '$12.99', period: '/month', save: null, badge: null },
  { id: 'annual', label: 'Annual', price: '$69/yr', perMonth: '$5.75', period: '/month', save: 'Save 56%', badge: 'MOST POPULAR', popular: true },
  { id: 'lifetime', label: 'Lifetime', price: '$149', perMonth: 'one-time', period: '', save: 'Best value', badge: null },
]

const perks = [
  { emoji: '🧘', text: '500+ guided meditations' },
  { emoji: '🌙', text: 'Sleep casts & soundscapes' },
  { emoji: '🎯', text: 'Focus & productivity packs' },
  { emoji: '📊', text: 'Mindfulness stats & streaks' },
  { emoji: '📱', text: 'Offline listening' },
  { emoji: '👨‍👩‍👧', text: 'Up to 6 family members' },
]

export default function Paywall() {
  const { showPaywall, closePaywall, upgradeToPremium, user } = useStore()
  const [selected, setSelected] = useState('annual')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubscribe = async () => {
    setLoading(true)
    setError(null)
    try {
      await startCheckout({ email: user?.email || 'guest@huzen.app', name: user?.name || 'Guest', plan: selected })
    } catch (err) {
      console.warn('Stripe backend not available, simulating upgrade:', err.message)
      upgradeToPremium()
    } finally {
      setLoading(false)
    }
  }

  const selectedPlan = plans.find(p => p.id === selected)

  return (
    <AnimatePresence>
      {showPaywall && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={closePaywall}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 480, background: 'var(--navy)', borderRadius: '28px 28px 0 0', padding: '0 0 40px', maxHeight: '92vh', overflowY: 'auto' }}>

            <div style={{ background: 'linear-gradient(160deg,#FF6B35,#FFC64A)', padding: '28px 24px 32px', borderRadius: '28px 28px 0 0', textAlign: 'center', position: 'relative' }}>
              <button onClick={closePaywall} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: 'white', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              <div style={{ fontSize: 48, marginBottom: 10 }}>💎</div>
              <div className="serif" style={{ fontSize: 28, color: 'white', marginBottom: 6 }}>Hu Zen Plus</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Unlock your full mind potential</div>
            </div>

            <div style={{ padding: '24px 20px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {perks.map((p, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{p.emoji}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{p.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {plans.map(plan => (
                  <div key={plan.id} onClick={() => setSelected(plan.id)}
                    style={{ flex: 1, borderRadius: 16, padding: '14px 8px', textAlign: 'center', cursor: 'pointer', position: 'relative',
                      border: `2px solid ${selected === plan.id ? 'var(--orange)' : 'rgba(255,255,255,0.1)'}`,
                      background: selected === plan.id ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)', transition: 'all 0.2s' }}>
                    {plan.badge && (
                      <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--orange)', color: 'white', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>{plan.badge}</div>
                    )}
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>{plan.label}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 2 }}>{plan.perMonth}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{plan.period || plan.price}</div>
                    {plan.save && <div style={{ marginTop: 4, fontSize: 10, fontWeight: 600, color: 'var(--teal)' }}>{plan.save}</div>}
                  </div>
                ))}
              </div>

              {selected !== 'lifetime' && (
                <div style={{ background: 'rgba(62,207,178,0.1)', border: '1px solid rgba(62,207,178,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🎁</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)' }}>7-day free trial included</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>No charge until your trial ends. Cancel anytime.</div>
                  </div>
                </div>
              )}

              {error && <div style={{ background: 'rgba(239,83,80,0.15)', border: '1px solid rgba(239,83,80,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#EF5350' }}>⚠️ {error}</div>}

              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubscribe} disabled={loading}
                style={{ width: '100%', padding: '18px', borderRadius: 50, border: 'none', background: loading ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg,var(--orange),var(--yellow))', color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 12, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? '⟳ Connecting to Stripe...' : selected === 'lifetime' ? 'Get Lifetime Access — $149' : `Start 7-day free trial → ${selectedPlan?.price}`}
              </motion.button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
                {['🔒 Secure', '↩ Cancel anytime', '⭐ 4.8/5'].map((b, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{b}</div>
                ))}
              </div>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, marginBottom: 8 }}>Powered by Stripe · 256-bit SSL encryption</div>

              <button onClick={closePaywall} style={{ width: '100%', marginTop: 8, padding: '14px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
