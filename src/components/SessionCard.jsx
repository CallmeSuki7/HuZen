import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'

export default function SessionCard({ session, size = 'md' }) {
  const nav = useNavigate()
  const { isPremium, favorites, toggleFavorite, openPaywall } = useStore()
  const isFav = favorites.includes(session.id)
  const locked = !session.free && !isPremium

  const handleClick = () => {
    if (locked) { openPaywall(); return }
    nav(`/player/${session.id}`)
  }

  const fmt = (s) => `${Math.floor(s/60)} min`

  if (size === 'sm') return (
    <div onClick={handleClick} style={{ flex: '0 0 140px', background: 'white', borderRadius: 18, padding: '14px', border: '1px solid var(--border)', cursor: 'pointer', position: 'relative', transition: 'transform 0.2s', boxShadow: 'var(--card-shadow)' }}
      onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
      {locked && <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 12 }}>🔒</div>}
      <div style={{ width: 44, height: 44, borderRadius: 14, background: session.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 10 }}>{session.emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>{session.title}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{fmt(session.duration)} · {session.category}</div>
    </div>
  )

  return (
    <div onClick={handleClick} style={{ background: 'white', borderRadius: 20, padding: '16px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--card-shadow)' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--card-shadow)' }}>
      <div style={{ width: 58, height: 58, borderRadius: 18, background: session.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{session.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>{session.title}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{fmt(session.duration)} · {session.category} · {session.instructor}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {locked
          ? <span style={{ fontSize: 18 }}>🔒</span>
          : <button onClick={e => { e.stopPropagation(); toggleFavorite(session.id) }} style={{ background: 'none', border: 'none', fontSize: 18, color: isFav ? '#FF6B35' : 'var(--muted)', transition: 'color 0.2s' }}>{isFav ? '♥' : '♡'}</button>
        }
      </div>
    </div>
  )
}
