import { motion } from 'framer-motion'
import { useStore } from '../store'
import { signOut } from '../supabase'

const achievements = [
  { emoji: '🌱', label: 'First Session', unlocked: true },
  { emoji: '🔥', label: '7-day streak', unlocked: true },
  { emoji: '💫', label: '10 Sessions', unlocked: true },
  { emoji: '🌙', label: 'Night Owl', unlocked: false },
  { emoji: '🎯', label: '30-day streak', unlocked: false },
  { emoji: '🧘', label: 'Zen Master', unlocked: false },
]

export default function Profile() {
  const { user, isPremium, completedSessions, favorites, logout, openPaywall } = useStore()
  const totalMins = completedSessions.length * 12
  const streak = 14

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,var(--navy) 0%,#3A3A6E 100%)', padding: '52px 24px 36px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg,var(--orange),var(--yellow))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 600, color: 'white', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(255,107,53,0.4)' }}>
          {user?.avatar || 'A'}
        </motion.div>
        <div style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 4 }}>{user?.name || 'Alex'}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>{user?.email || 'alex@example.com'}</div>

        {isPremium ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,var(--orange),var(--yellow))', color: 'white', padding: '6px 16px', borderRadius: 40, fontSize: 12, fontWeight: 600 }}>
            💎 Hu Zen Plus
          </div>
        ) : (
          <motion.button whileTap={{ scale: 0.96 }} onClick={openPaywall}
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', padding: '8px 20px', borderRadius: 40, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
            Upgrade to Plus 💎
          </motion.button>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          {[
            { val: completedSessions.length, label: 'Sessions' },
            { val: `🔥${streak}`, label: 'Day streak' },
            { val: `${totalMins}m`, label: 'Mindful time' },
            { val: favorites.length, label: 'Saved' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '10px 14px', textAlign: 'center', minWidth: 64 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Weekly chart */}
        <WeeklyChart />

        {/* Achievements */}
        <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Achievements</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {achievements.map((a, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, padding: '14px', textAlign: 'center', border: '1px solid var(--border)', opacity: a.unlocked ? 1 : 0.4, boxShadow: a.unlocked ? 'var(--card-shadow)' : 'none' }}>
              <div style={{ fontSize: 26, marginBottom: 6, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>{a.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{a.label}</div>
              {!a.unlocked && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Locked</div>}
            </div>
          ))}
        </div>

        {/* Settings */}
        <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Settings</div>
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--card-shadow)', marginBottom: 24 }}>
          {[
            { icon: '🔔', label: 'Daily reminder', value: '7:00 AM' },
            { icon: '🎵', label: 'Background sounds', value: 'Ocean' },
            { icon: '🌙', label: 'Sleep timer', value: '20 min' },
            { icon: '📊', label: 'Stats & insights', value: '' },
            { icon: '👨‍👩‍👧', label: 'Family plan', value: isPremium ? 'Add members' : '🔒' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '15px 18px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginRight: 14 }}>{item.icon}</div>
              <div style={{ flex: 1, fontSize: 15, color: 'var(--text)' }}>{item.label}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginRight: 8 }}>{item.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: 16 }}>›</div>
            </div>
          ))}
        </div>

        <button onClick={async () => { await signOut(); logout() }} style={{ width: '100%', padding: '16px', borderRadius: 50, border: '1.5px solid var(--border)', background: 'white', color: 'var(--text-light)', fontSize: 15, fontFamily: 'inherit', cursor: 'pointer' }}>
          Sign out
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
          <a href="/terms" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/privacy" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="mailto:support@huzen.app" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>Support</a>
        </div>
      </div>
    </div>
  )
}

function WeeklyChart() {
  const days = ['M','T','W','T','F','S','S']
  const mins = [8, 12, 0, 15, 10, 20, 12]
  const max = Math.max(...mins)
  return (
    <div style={{ background: 'white', borderRadius: 20, padding: '18px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', marginBottom: 28 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>This week</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <motion.div initial={{ height: 0 }} animate={{ height: mins[i] ? `${(mins[i]/max)*52}px` : '4px' }}
              transition={{ delay: i * 0.06 }}
              style={{ width: '100%', borderRadius: 6, background: mins[i] ? 'linear-gradient(180deg,var(--orange),var(--yellow))' : 'var(--border)', minHeight: 4 }} />
            <div style={{ fontSize: 10, color: i === 6 ? 'var(--orange)' : 'var(--muted)', fontWeight: i === 6 ? 600 : 400 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
        <span>77 min total this week</span>
        <span style={{ color: 'var(--teal)', fontWeight: 600 }}>+23% vs last week</span>
      </div>
    </div>
  )
}
