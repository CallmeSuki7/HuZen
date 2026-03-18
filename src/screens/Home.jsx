import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import SessionCard from '../components/SessionCard'

const quotes = [
  'The present moment is the only moment available to us.',
  'Wherever you go, there you are.',
  'You are the sky. Everything else is just the weather.',
  'Breathe. Let go. And remind yourself that this moment is the only one you know you have.',
]

export default function Home() {
  const nav = useNavigate()
  const { user, sessions, completedSessions, isPremium, openPaywall } = useStore()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const todaySession = sessions[0]
  const quote = quotes[new Date().getDay() % quotes.length]
  const streak = 14
  const totalMins = completedSessions.length * 12

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 90 }}>
      {/* Hero gradient header */}
      <div style={{ background: 'linear-gradient(160deg,#FF6B35 0%,#FFC64A 55%,var(--cream) 100%)', paddingBottom: 40 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '52px 24px 0' }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5, marginBottom: 4 }}>{greeting}</div>
            <div className="serif" style={{ fontSize: 28, color: 'white', lineHeight: 1.2 }}>
              Hey, {user?.name || 'friend'} 👋
            </div>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}
            style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', borderRadius: 40, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, color: 'white', fontSize: 14, fontWeight: 500 }}>
            🔥 {streak} day streak
          </motion.div>
        </div>

        {/* Today's featured session */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          onClick={() => nav(`/player/${todaySession.id}`)}
          style={{ margin: '24px 20px 0', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(12px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.4)', padding: '22px', cursor: 'pointer' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', marginBottom: 8 }}>Today's pick</div>
          <div className="serif" style={{ fontSize: 24, color: 'white', marginBottom: 6 }}>{todaySession.title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', display: 'flex', gap: 14, marginBottom: 16 }}>
            <span>🧘 {todaySession.category}</span>
            <span>⏱ {Math.floor(todaySession.duration/60)} min</span>
            <span>👤 {todaySession.instructor}</span>
          </div>
          <motion.button whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', color: 'var(--orange)', border: 'none', borderRadius: 40, padding: '10px 22px', fontSize: 14, fontWeight: 600 }}>
            ▶ Start session
          </motion.button>
        </motion.div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 24, marginBottom: 28 }}>
          {[
            { val: completedSessions.length, label: 'Sessions' },
            { val: `${streak}`, label: 'Day streak' },
            { val: `${totalMins}m`, label: 'Mindful time' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2 }}
              style={{ background: 'white', borderRadius: 16, padding: '14px', textAlign: 'center', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--orange)' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--navy)', borderRadius: 20, padding: '20px', marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>DAILY INTENTION</div>
          <div className="serif" style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>"{quote}"</div>
        </motion.div>

        {/* Continue section */}
        <SectionHeader title="Continue where you left off" onSeeAll={() => nav('/explore')} />
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, marginBottom: 28 }}>
          {sessions.slice(0, 5).map(s => <SessionCard key={s.id} session={s} size="sm" />)}
        </div>

        {/* Popular packs */}
        <SectionHeader title="Popular packs" onSeeAll={() => nav('/explore')} />
        <PacksRow />

        {/* Premium banner */}
        {!isPremium && (
          <motion.div onClick={openPaywall} whileTap={{ scale: 0.98 }}
            style={{ background: 'linear-gradient(135deg,var(--navy),#3A3A6E)', borderRadius: 20, padding: '20px', marginTop: 24, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>💎</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 4 }}>Unlock 500+ meditations</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>Try Hu Zen Plus free for 7 days</div>
            <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg,var(--orange),var(--yellow))', color: 'white', padding: '8px 20px', borderRadius: 40, fontSize: 13, fontWeight: 600 }}>
              Start free trial →
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ title, onSeeAll }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
      <button onClick={onSeeAll} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 13, fontWeight: 500 }}>See all</button>
    </div>
  )
}

function PacksRow() {
  const { packs, isPremium, openPaywall } = useStore()
  const nav = useNavigate()
  return (
    <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
      {packs.map(pack => {
        const locked = !pack.free && !isPremium
        return (
          <motion.div key={pack.id} whileTap={{ scale: 0.97 }}
            onClick={() => locked ? openPaywall() : null}
            style={{ flex: '0 0 150px', background: 'white', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ height: 80, background: pack.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, position: 'relative' }}>
              {pack.emoji}
              {locked && <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 12 }}>🔒</div>}
            </div>
            <div style={{ padding: '10px 12px 12px' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{pack.title}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{pack.sessions} sessions</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
