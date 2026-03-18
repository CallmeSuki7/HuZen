import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { useAudioEngine } from '../useAudioEngine'

const soundscapes = [
  { id: 'rain', emoji: '🌧', label: 'Rain', color: '#42A5F5' },
  { id: 'ocean', emoji: '🌊', label: 'Ocean', color: '#00ACC1' },
  { id: 'forest', emoji: '🌲', label: 'Forest', color: '#66BB6A' },
  { id: 'fire', emoji: '🔥', label: 'Fireplace', color: '#FF7043' },
  { id: 'white', emoji: '☁️', label: 'White noise', color: '#90A4AE' },
  { id: 'sleep', emoji: '✨', label: 'Deep space', color: '#5C6BC0' },
]

const timers = [5, 10, 20, 30, 45, 60]

export default function Sleep() {
  const nav = useNavigate()
  const { sessions, isPremium, openPaywall } = useStore()
  const { playAmbient, stopAll } = useAudioEngine()
  const [activeSound, setActiveSound] = useState(null)
  const [timer, setTimer] = useState(20)
  const sleepSessions = sessions.filter(s => s.category === 'Sleep')

  const toggleSound = (sound) => {
    if (activeSound === sound.id) {
      stopAll()
      setActiveSound(null)
    } else {
      if (!isPremium && sound.id !== 'rain') { openPaywall(); return }
      playAmbient(sound.id)
      setActiveSound(sound.id)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0D0D1A 0%,#1A1A2E 100%)', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '52px 24px 28px' }}>
        <div className="serif" style={{ fontSize: 32, color: 'white', marginBottom: 4 }}>Sleep</div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Wind down and drift off</div>
      </div>

      {/* Moon animation */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 64 }}>🌙</motion.div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Soundscapes */}
        <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 14, letterSpacing: 0.3 }}>Soundscapes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {soundscapes.map(sound => {
            const locked = !isPremium && sound.id !== 'rain'
            const active = activeSound === sound.id
            return (
              <motion.div key={sound.id} whileTap={{ scale: 0.95 }} onClick={() => toggleSound(sound)}
                style={{ borderRadius: 18, padding: '16px 12px', textAlign: 'center', cursor: 'pointer',
                  background: active ? `${sound.color}33` : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${active ? sound.color : 'rgba(255,255,255,0.1)'}`,
                  position: 'relative', transition: 'all 0.2s' }}>
                {locked && <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 10 }}>🔒</div>}
                {active && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ position: 'absolute', inset: 0, borderRadius: 18, background: `${sound.color}22` }} />}
                <div style={{ fontSize: 28, marginBottom: 6, position: 'relative' }}>{sound.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: active ? sound.color : 'rgba(255,255,255,0.6)', position: 'relative' }}>{sound.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Sleep timer */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '20px', marginBottom: 32, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>Sleep timer</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {timers.map(t => (
              <button key={t} onClick={() => setTimer(t)}
                style={{ padding: '8px 16px', borderRadius: 40, border: `1.5px solid ${timer === t ? 'var(--teal)' : 'rgba(255,255,255,0.15)'}`,
                  background: timer === t ? 'rgba(62,207,178,0.2)' : 'transparent',
                  color: timer === t ? 'var(--teal)' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                {t} min
              </button>
            ))}
          </div>
        </div>

        {/* Sleep sessions */}
        <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>Guided sleep sessions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sleepSessions.map(s => {
            const locked = !s.free && !isPremium
            return (
              <motion.div key={s.id} whileTap={{ scale: 0.98 }}
                onClick={() => locked ? openPaywall() : nav(`/player/${s.id}`)}
                style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: '16px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{s.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'white', marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{Math.floor(s.duration/60)} min · {s.instructor}</div>
                </div>
                {locked ? <span style={{ fontSize: 16 }}>🔒</span> : <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>▶</span>}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
