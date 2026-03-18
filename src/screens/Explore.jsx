import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import SessionCard from '../components/SessionCard'

const categories = ['All', 'Mindfulness', 'Sleep', 'Focus', 'Stress', 'Breathe']

export default function Explore() {
  const { sessions, packs } = useStore()
  const [cat, setCat] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = sessions.filter(s =>
    (cat === 'All' || s.category === cat) &&
    (query === '' || s.title.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <div className="serif" style={{ fontSize: 32, color: 'var(--text)', marginBottom: 4 }}>Explore</div>
        <div style={{ fontSize: 15, color: 'var(--muted)' }}>Find what's right for you today</div>
      </div>

      {/* Search */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 14, padding: '12px 16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <span style={{ fontSize: 18, color: 'var(--muted)' }}>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search meditations..."
            style={{ border: 'none', outline: 'none', fontSize: 15, color: 'var(--text)', background: 'transparent', flex: 1 }} />
          {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 18 }}>×</button>}
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px', overflowX: 'auto' }}>
        {categories.map(c => (
          <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => setCat(c)}
            style={{ flex: '0 0 auto', padding: '8px 18px', borderRadius: 40, fontFamily: 'inherit',
              border: `1.5px solid ${cat === c ? 'var(--orange)' : 'var(--border)'}`,
              background: cat === c ? 'var(--orange)' : 'white',
              color: cat === c ? 'white' : 'var(--text)', fontSize: 13, fontWeight: 500,
              transition: 'all 0.2s', cursor: 'pointer' }}>
            {c}
          </motion.button>
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Packs section when showing all */}
        {cat === 'All' && query === '' && (
          <>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Meditation Packs</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
              {packs.map((pack, i) => (
                <PackCard key={pack.id} pack={pack} featured={i === 0} />
              ))}
            </div>
          </>
        )}

        {/* Sessions */}
        <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
          {cat === 'All' ? 'All Sessions' : cat} {filtered.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 14 }}>({filtered.length})</span>}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div>No sessions found for "{query}"</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <SessionCard session={s} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PackCard({ pack, featured }) {
  const { isPremium, openPaywall } = useStore()
  const locked = !pack.free && !isPremium
  return (
    <motion.div whileTap={{ scale: 0.97 }} onClick={() => locked && openPaywall()}
      style={{ gridColumn: featured ? 'span 2' : 'span 1', background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', boxShadow: 'var(--card-shadow)' }}>
      <div style={{ height: featured ? 120 : 90, background: pack.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: featured ? 44 : 34, position: 'relative' }}>
        {pack.emoji}
        {locked && <div style={{ position: 'absolute', top: 8, right: 10, fontSize: 14 }}>🔒</div>}
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: featured ? 16 : 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{pack.title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{pack.sessions} sessions · {pack.days} days</div>
        {featured && <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 6, lineHeight: 1.5 }}>{pack.desc}</div>}
      </div>
    </motion.div>
  )
}
