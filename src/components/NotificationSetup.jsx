import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Register service worker
export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ SW registered:', reg.scope)
      return reg
    } catch (err) {
      console.warn('SW registration failed:', err)
    }
  }
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  const result = await Notification.requestPermission()
  return result
}

// Schedule a local notification (demo — real push needs backend + VAPID keys)
export function scheduleLocalReminder(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(hours, minutes, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)

  const delay = target - now
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('Time to breathe 🧘', {
        body: 'Your daily mindfulness session is waiting.',
        icon: '/favicon.svg',
      })
    }
  }, delay)

  return { scheduledFor: target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
}

const reminderTimes = [
  { label: '7:00 AM', sub: 'Morning ritual', emoji: '🌅' },
  { label: '12:00 PM', sub: 'Midday reset', emoji: '☀️' },
  { label: '5:30 PM', sub: 'After work', emoji: '🌆' },
  { label: '9:00 PM', sub: 'Evening wind down', emoji: '🌙' },
  { label: 'Custom', sub: 'Pick your own time', emoji: '⚙️' },
]

export default function NotificationSetup({ onDone }) {
  const [permission, setPermission] = useState(Notification?.permission || 'default')
  const [selected, setSelected] = useState(null)
  const [customTime, setCustomTime] = useState('08:00')
  const [saved, setSaved] = useState(false)

  const handleAllow = async () => {
    const result = await requestNotificationPermission()
    setPermission(result)
    await registerSW()
  }

  const handleSave = () => {
    const time = selected === 'Custom' ? customTime : selected?.replace(' AM', '').replace(' PM', '')
    if (Notification.permission === 'granted') {
      scheduleLocalReminder(selected === 'Custom' ? customTime : convertTo24(selected))
    }
    setSaved(true)
    setTimeout(() => onDone?.(), 1500)
  }

  const convertTo24 = (label) => {
    const [time, period] = label.split(' ')
    const [h, m] = time.split(':').map(Number)
    const hour = period === 'PM' && h !== 12 ? h + 12 : period === 'AM' && h === 12 ? 0 : h
    return `${String(hour).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`
  }

  return (
    <div style={{ padding: '0 20px' }}>
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Reminder set!</div>
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>We'll remind you daily at {selected === 'Custom' ? customTime : selected}</div>
          </motion.div>
        ) : permission !== 'granted' ? (
          <motion.div key="permission" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: 'center', padding: '20px 0 28px' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🔔</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Daily reminders</div>
              <div style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6 }}>
                People who meditate at the same time every day are 3x more likely to build a lasting habit.
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleAllow}
              style={{ width: '100%', padding: '16px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,var(--orange),var(--yellow))', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>
              Enable reminders →
            </motion.button>
            <button onClick={onDone} style={{ width: '100%', padding: '14px', borderRadius: 50, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
              Not now
            </button>
          </motion.div>
        ) : (
          <motion.div key="picker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>When should we remind you?</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Pick the time that fits your routine best.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {reminderTimes.map(t => (
                <motion.button key={t.label} whileTap={{ scale: 0.97 }} onClick={() => setSelected(t.label)}
                  style={{ padding: '14px 18px', borderRadius: 16, border: `1.5px solid ${selected === t.label ? 'var(--orange)' : 'var(--border)'}`, background: selected === t.label ? 'var(--orange-pale)' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: 22 }}>{t.emoji}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.sub}</div>
                  </div>
                  {selected === t.label && <span style={{ color: 'var(--orange)', fontSize: 18 }}>✓</span>}
                </motion.button>
              ))}
            </div>

            {selected === 'Custom' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Pick your time</label>
                <input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1.5px solid var(--orange)', background: 'white', fontSize: 16, outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }} />
              </motion.div>
            )}

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={!selected}
              style={{ width: '100%', padding: '16px', borderRadius: 50, border: 'none', background: selected ? 'linear-gradient(135deg,var(--orange),var(--yellow))' : 'var(--border)', color: 'white', fontSize: 16, fontWeight: 600, cursor: selected ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
              Save reminder →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
