import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/explore', icon: '🔍', label: 'Explore' },
  { path: '/sleep', icon: '🌙', label: 'Sleep' },
  { path: '/profile', icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
  const nav = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    }}>
      {tabs.map(t => {
        const active = pathname === t.path
        return (
          <button key={t.path} onClick={() => nav(t.path)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '10px 0 6px', border: 'none', background: 'transparent',
              color: active ? 'var(--orange)' : 'var(--muted)', fontSize: 10, fontWeight: active ? 600 : 400,
              transition: 'color 0.2s', fontFamily: 'inherit' }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{t.icon}</span>
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}
