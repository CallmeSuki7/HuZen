import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'

const moodOptions = [
  { id: 'stressed', emoji: '😤', label: 'Stressed' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'unfocused', emoji: '🌀', label: 'Unfocused' },
  { id: 'sad', emoji: '😔', label: 'Low mood' },
  { id: 'good', emoji: '😊', label: 'Good — just checking in' },
]

const timeOptions = [
  { id: '5', label: '5 min', sub: 'Quick reset' },
  { id: '10', label: '10 min', sub: 'Standard session' },
  { id: '20', label: '20 min', sub: 'Deep dive' },
  { id: 'any', label: 'Any', sub: 'Surprise me' },
]

// AI recommendation logic
function getRecommendations(mood, time, sessions) {
  const moodMap = {
    stressed: { categories: ['Stress', 'Breathe', 'Mindfulness'], priority: ['Stress Melt', 'Sunrise Breath', 'Morning Calm'] },
    tired: { categories: ['Breathe', 'Mindfulness'], priority: ['Energy Boost', 'Sunrise Breath', 'Morning Calm'] },
    anxious: { categories: ['Mindfulness', 'Breathe', 'Stress'], priority: ['Morning Calm', 'Anxiety Ease', 'Stress Melt'] },
    unfocused: { categories: ['Focus', 'Mindfulness'], priority: ['Focus Flow', 'Ocean Mind', 'Morning Calm'] },
    sad: { categories: ['Mindfulness', 'Stress'], priority: ['Loving Kindness', 'Morning Calm', 'Self-Compassion'] },
    good: { categories: ['Focus', 'Mindfulness', 'Breathe'], priority: ['Focus Flow', 'Ocean Mind', 'Sunrise Breath'] },
  }

  const pref = moodMap[mood] || moodMap.good
  const maxDuration = time === 'any' ? 9999 : parseInt(time) * 60 + 120

  // Score each session
  const scored = sessions.map(s => {
    let score = 0
    if (pref.categories.includes(s.category)) score += 3
    if (pref.priority.includes(s.title)) score += 5
    if (s.duration <= maxDuration) score += 2
    if (s.free) score += 1
    return { ...s, score }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, 3)
}

const moodMessages = {
  stressed: ["Take a breath — you've got this.", "Stress is just energy waiting to be redirected."],
  tired: ["Even 5 minutes of rest can restore your edge.", "Your body is asking for a moment. Give it one."],
  anxious: ["You're safe right now. Let's ground you.", "Anxiety shrinks in the light of awareness."],
  unfocused: ["Your focus is a muscle. Let's train it.", "One breath, one moment, one task."],
  sad: ["Whatever you're feeling is valid. Let's sit with it.", "Kindness towards yourself is always the right move."],
  good: ["Brilliant. Let's make the most of it.", "A calm mind is a powerful mind."],
}

export default function AIRecommend() {
  const { sessions } = useStore()
  const nav = useNavigate()
  const [step, setStep] = useState(0) // 0=mood, 1=time, 2=results
  const [mood, setMood] = useState(null)
  const [time, setTime] = useState(null)
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(false)

  const handleMood = (m) => { setMood(m); setStep(1) }

  const handleTime = (t) => {
    setTime(t)
    setLoading(true)
    // Simulate AI "thinking"
    setTimeout(() => {
      setRecs(getRecommendations(mood, t, sessions))
      setLoading(false)
      setStep(2)
    }, 1800)
  }

  const message = mood ? moodMessages[mood][Math.floor(Math.random() * 2)] : ''
  const moodObj = moodOptions.find(m => m.id === mood)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#1A1A2E 0%,#2E1A3E 100%)', display: 'flex', flexDirection: 'column', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '52px 24px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => step > 0 ? setStep(s => s - 1) : nav('/')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>AI Recommendations</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>
            {step === 0 ? 'How are you feeling?' : step === 1 ? 'How much time do you have?' : `Perfect for you right now`}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 6, padding: '0 24px 32px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= step ? '#9575CD' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: '0 20px' }}>
        <AnimatePresence mode="wait">

          {/* STEP 0 — Mood */}
          {step === 0 && (
            <motion.div key="mood" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {moodOptions.map(m => (
                  <motion.button key={m.id} whileTap={{ scale: 0.95 }} onClick={() => handleMood(m.id)}
                    style={{ padding: '24px 16px', borderRadius: 20, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#9575CD'; e.currentTarget.style.background = 'rgba(149,117,205,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{m.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>{m.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Time */}
          {step === 1 && (
            <motion.div key="time" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div style={{ background: 'rgba(149,117,205,0.1)', border: '1px solid rgba(149,117,205,0.25)', borderRadius: 16, padding: '16px 20px', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 28 }}>{moodObj?.emoji}</span>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, fontStyle: 'italic' }}>"{message}"</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {timeOptions.map(t => (
                  <motion.button key={t.id} whileTap={{ scale: 0.97 }} onClick={() => handleTime(t.id)}
                    style={{ padding: '20px 24px', borderRadius: 18, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#9575CD'; e.currentTarget.style.background = 'rgba(149,117,205,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{t.sub}</div>
                    </div>
                    <span style={{ color: '#9575CD', fontSize: 20 }}>→</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 24 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(149,117,205,0.2)', borderTopColor: '#9575CD' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, color: 'white', marginBottom: 6 }}>Finding your perfect sessions...</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Analysing mood, time & past sessions</div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Results */}
          {step === 2 && !loading && (
            <motion.div key="results" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <div style={{ background: 'rgba(149,117,205,0.15)', border: '1px solid rgba(149,117,205,0.25)', borderRadius: 40, padding: '6px 14px', fontSize: 12, color: '#CE93D8' }}>
                    {moodObj?.emoji} {moodObj?.label}
                  </div>
                  <div style={{ background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.25)', borderRadius: 40, padding: '6px 14px', fontSize: 12, color: '#FF8C5A' }}>
                    ⏱ {time === 'any' ? 'Any duration' : `${time} minutes`}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  Based on your mood and available time, our AI picked these 3 sessions specifically for you right now.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recs.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                    onClick={() => nav(`/player/${s.id}`)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(149,117,205,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                    {i === 0 && (
                      <div style={{ position: 'absolute', top: -10, left: 16, background: 'linear-gradient(135deg,#9575CD,#CE93D8)', color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 0.5 }}>
                        ✨ TOP PICK
                      </div>
                    )}
                    <div style={{ width: 58, height: 58, borderRadius: 18, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{s.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{Math.floor(s.duration / 60)} min · {s.category} · {s.instructor}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{s.desc?.slice(0, 70)}...</div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>▶</span>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => { setStep(0); setMood(null); setTime(null) }}
                style={{ width: '100%', marginTop: 24, padding: '15px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
                ↺ Start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
