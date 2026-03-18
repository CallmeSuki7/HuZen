import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { useAudioEngine } from '../useAudioEngine'

const breathePhases = [
  { text: 'Breathe in', sub: 'Inhale slowly for 4 counts', dur: 4000 },
  { text: 'Hold', sub: 'Hold gently for 4 counts', dur: 4000 },
  { text: 'Breathe out', sub: 'Exhale fully for 6 counts', dur: 6000 },
  { text: 'Rest', sub: 'Pause before the next breath', dur: 2000 },
]

const tips = [
  'Find a comfortable seated position.',
  'Allow your shoulders to relax.',
  'Gently close your eyes or soften your gaze.',
  'You don\'t need to stop your thoughts — just observe them.',
  'Each breath is a fresh beginning.',
]

export default function Player() {
  const { id } = useParams()
  const nav = useNavigate()
  const { sessions, isPremium, completeSession, toggleFavorite, favorites, volume: storeVol, setVolume: storeSetVolume } = useStore()
  const session = sessions.find(s => s.id === Number(id))

  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)
  const [showVolume, setShowVolume] = useState(false)
  const [vol, setVol] = useState(storeVol)
  const [completed, setCompleted] = useState(false)

  const timerRef = useRef(null)
  const breatheRef = useRef(null)
  const tipRef = useRef(null)
  const { playAmbient, stopAll, setVolume: audioSetVol, pause: audioPause, resume: audioResume } = useAudioEngine()

  const isFav = favorites.includes(session?.id)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      clearInterval(breatheRef.current)
      clearInterval(tipRef.current)
      stopAll()
    }
  }, [stopAll])

  const startSession = useCallback(() => {
    if (!session) return
    setIsPlaying(true)

    // Start audio
    const catMap = { Sleep: 'sleep', Focus: 'focus', Stress: 'stress', Breathe: 'breathe', Mindfulness: 'mindfulness' }
    playAmbient(catMap[session.category] || 'mindfulness')

    // Progress timer
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev >= session.duration) {
          clearInterval(timerRef.current)
          setCompleted(true)
          setIsPlaying(false)
          stopAll()
          completeSession(session.id)
          return prev
        }
        return prev + 1
      })
    }, 1000)

    // Breathe phase cycle
    let phaseIdx = 0
    const cycleBreathe = () => {
      phaseIdx = (phaseIdx + 1) % breathePhases.length
      setPhase(phaseIdx)
      breatheRef.current = setTimeout(cycleBreathe, breathePhases[phaseIdx].dur)
    }
    breatheRef.current = setTimeout(cycleBreathe, breathePhases[0].dur)

    // Tips rotation
    tipRef.current = setInterval(() => {
      setTipIndex(i => (i + 1) % tips.length)
    }, 8000)
  }, [session, playAmbient, stopAll, completeSession])

  const pauseSession = useCallback(() => {
    setIsPlaying(false)
    clearInterval(timerRef.current)
    clearTimeout(breatheRef.current)
    audioPause()
  }, [audioPause])

  const resumeSession = useCallback(() => {
    setIsPlaying(true)
    audioResume()
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev >= session.duration) { clearInterval(timerRef.current); return prev }
        return prev + 1
      })
    }, 1000)
  }, [audioResume, session])

  const togglePlay = () => {
    if (elapsed === 0 && !isPlaying) { startSession(); return }
    isPlaying ? pauseSession() : resumeSession()
  }

  const handleVolumeChange = (v) => {
    setVol(v)
    audioSetVol(v)
    storeSetVolume(v)
  }

  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
  const progress = session ? (elapsed / session.duration) * 100 : 0

  if (!session) return <div style={{ padding: 40, textAlign: 'center' }}>Session not found</div>

  if (completed) return <CompletedScreen session={session} onHome={() => nav('/')} onReplay={() => { setCompleted(false); setElapsed(0); startSession() }} />

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at top, ${session.color}88 0%, var(--navy) 65%)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Top bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '52px 24px 0' }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { pauseSession(); nav(-1) }}
          style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ←
        </motion.button>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
          {session.category}
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleFavorite(session.id)}
          style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: isFav ? '#FF6B35' : 'white', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}>
          {isFav ? '♥' : '♡'}
        </motion.button>
      </div>

      {/* Breathing orb */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '20px 0' }}>
        <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer pulse rings */}
          {isPlaying && [0.85, 0.7].map((scale, i) => (
            <motion.div key={i}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: breathePhases[phase].dur / 1000, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              style={{ position: 'absolute', width: 220 * scale, height: 220 * scale, borderRadius: '50%', border: `1px solid ${session.color}66` }} />
          ))}

          {/* Main orb */}
          <motion.div
            animate={isPlaying ? {
              scale: phase === 0 ? [1, 1.18] : phase === 1 ? [1.18, 1.18] : phase === 2 ? [1.18, 1] : [1, 1],
            } : { scale: 1 }}
            transition={{ duration: breathePhases[phase].dur / 1000, ease: 'easeInOut' }}
            onClick={togglePlay}
            style={{ width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${session.color}dd, ${session.color}66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 0 60px ${session.color}55` }}>
            <span style={{ fontSize: 32, color: 'white' }}>{isPlaying ? (phase === 0 ? '↑' : phase === 2 ? '↓' : '·') : '▶'}</span>
          </motion.div>
        </div>

        {/* Breathe instruction */}
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ textAlign: 'center' }}>
            <div className="serif" style={{ fontSize: 24, color: 'white', marginBottom: 6 }}>
              {isPlaying ? breathePhases[phase].text : 'Tap to begin'}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
              {isPlaying ? breathePhases[phase].sub : 'Find a comfortable position'}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tip ticker */}
        <AnimatePresence mode="wait">
          <motion.div key={tipIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ maxWidth: 280, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontStyle: 'italic' }}>
            {tips[tipIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Session info */}
      <div style={{ width: '100%', padding: '0 24px' }}>
        <div className="serif" style={{ fontSize: 26, color: 'white', textAlign: 'center', marginBottom: 4 }}>{session.title}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 24 }}>{session.instructor} · {Math.floor(session.duration/60)} min</div>
      </div>

      {/* Controls + progress */}
      <div style={{ width: '100%', padding: '0 24px 40px' }}>
        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 4, marginBottom: 8, cursor: 'pointer' }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = (e.clientX - rect.left) / rect.width
            setElapsed(Math.floor(pct * session.duration))
          }}>
          <motion.div style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${session.color}, white)`, width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
          <span>{fmt(elapsed)}</span><span>{fmt(session.duration)}</span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, marginBottom: 20 }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setElapsed(e => Math.max(0, e - 15))}
            style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ↺15
          </motion.button>
          <motion.button whileTap={{ scale: 0.93 }} onClick={togglePlay}
            style={{ width: 72, height: 72, borderRadius: '50%', background: 'white', border: 'none', color: 'var(--navy)', fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            {isPlaying ? '⏸' : '▶'}
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setElapsed(e => Math.min(session.duration, e + 15))}
            style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            15↻
          </motion.button>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setShowVolume(!showVolume)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>🔊</button>
          <input type="range" min={0} max={1} step={0.01} value={vol}
            onChange={e => handleVolumeChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: session.color }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', minWidth: 28 }}>{Math.round(vol * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

function CompletedScreen({ session, onHome, onReplay }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      style={{ minHeight: '100vh', background: `radial-gradient(ellipse at top, ${session.color}88, var(--navy))`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
        style={{ fontSize: 80, marginBottom: 24 }}>🎉</motion.div>
      <div className="serif" style={{ fontSize: 32, color: 'white', marginBottom: 12 }}>Session complete!</div>
      <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{session.title}</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>{Math.floor(session.duration/60)} minutes of mindfulness ✓</div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        {[['🔥', '14', 'Day streak'], ['🧘', '+1', 'Session'], ['⭐', '47', 'Total']].map(([e, v, l]) => (
          <div key={l} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '14px 20px', minWidth: 80 }}>
            <div style={{ fontSize: 22 }}>{e}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'white' }}>{v}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{l}</div>
          </div>
        ))}
      </div>

      <button onClick={onHome} style={{ width: '100%', maxWidth: 320, padding: '18px', borderRadius: 50, border: 'none', background: 'white', color: 'var(--navy)', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
        Back to home
      </button>
      <button onClick={onReplay} style={{ width: '100%', maxWidth: 320, padding: '16px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', fontSize: 15 }}>
        Play again
      </button>
    </motion.div>
  )
}
