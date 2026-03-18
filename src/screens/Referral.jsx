import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'

const referrals = [
  { name: 'James K.', date: 'Mar 12', status: 'subscribed', reward: '$5.75' },
  { name: 'Amina T.', date: 'Mar 8', status: 'trial', reward: 'Pending' },
  { name: 'David L.', date: 'Feb 28', status: 'subscribed', reward: '$5.75' },
]

export default function Referral() {
  const { user } = useStore()
  const [copied, setCopied] = useState(false)
  const refCode = `ZEN-${(user?.name || 'ALEX').toUpperCase().slice(0, 4)}2025`
  const refLink = `https://huzen.app/join?ref=${refCode}`

  const copyLink = () => {
    navigator.clipboard.writeText(refLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const share = (platform) => {
    const msg = encodeURIComponent(`I've been meditating with Hu Zen and it's genuinely changed my mornings. Get a free month with my link: ${refLink}`)
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${msg}`,
      whatsapp: `https://wa.me/?text=${msg}`,
      email: `mailto:?subject=Try Hu Zen for free&body=${msg}`,
    }
    window.open(urls[platform], '_blank')
  }

  const totalEarned = referrals.filter(r => r.status === 'subscribed').length * 5.75
  const pendingCount = referrals.filter(r => r.status === 'trial').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#FF6B35,#FFC64A)', padding: '52px 24px 48px', textAlign: 'center' }}>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 56, marginBottom: 16 }}>🎁</motion.div>
        <div className="serif" style={{ fontSize: 30, color: 'white', marginBottom: 8 }}>Give calm, get rewarded</div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
          For every friend who subscribes, you both get a free month. No limits.
        </div>
      </div>

      <div style={{ padding: '28px 20px' }}>
        {/* How it works */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
          {[
            { step: '1', text: 'Share your unique link', icon: '🔗' },
            { step: '2', text: 'Friend starts free trial', icon: '🧘' },
            { step: '3', text: 'They subscribe → you both get a free month', icon: '🎉' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 6px', position: 'relative' }}>
              {i < 2 && <div style={{ position: 'absolute', top: 18, left: '60%', right: '-10%', height: 2, background: 'var(--border)', zIndex: 0 }} />}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, margin: '0 auto 8px', position: 'relative', zIndex: 1 }}>{s.step}</div>
              <div style={{ fontSize: 11, color: 'var(--text-light)', lineHeight: 1.5 }}>{s.text}</div>
            </div>
          ))}
        </div>

        {/* Ref link */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px', marginBottom: 16, border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Your referral link</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1, background: 'var(--cream)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--text)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {refLink}
            </div>
            <motion.button whileTap={{ scale: 0.93 }} onClick={copyLink}
              style={{ padding: '12px 18px', borderRadius: 12, border: 'none', background: copied ? 'var(--teal)' : 'var(--orange)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'background 0.3s' }}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </motion.button>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: '#F2F8FE', borderRadius: 10, padding: '10px', textAlign: 'center', fontSize: 12, color: '#1877F2', fontWeight: 500 }}>Code: <strong>{refCode}</strong></div>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 28 }}>
          {[
            { platform: 'whatsapp', label: 'WhatsApp', emoji: '💬', bg: '#25D366', color: 'white' },
            { platform: 'twitter', label: 'X / Twitter', emoji: '🐦', bg: '#000', color: 'white' },
            { platform: 'email', label: 'Email', emoji: '📧', bg: 'white', color: 'var(--text)', border: '1px solid var(--border)' },
          ].map(s => (
            <motion.button key={s.platform} whileTap={{ scale: 0.95 }} onClick={() => share(s.platform)}
              style={{ padding: '12px 8px', borderRadius: 14, border: s.border || 'none', background: s.bg, color: s.color, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              {s.label}
            </motion.button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { val: referrals.length, label: 'Referrals sent' },
            { val: referrals.filter(r => r.status === 'subscribed').length, label: 'Converted' },
            { val: `$${totalEarned.toFixed(2)}`, label: 'Credits earned' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, padding: '14px', textAlign: 'center', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--orange)' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Referral history */}
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Your referrals</div>
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
          {referrals.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: i < referrals.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--orange),var(--yellow))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, marginRight: 12 }}>
                {r.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: r.status === 'subscribed' ? 'var(--teal-dark)' : 'var(--muted)' }}>
                  {r.reward}
                </div>
                <div style={{ fontSize: 11, color: r.status === 'subscribed' ? 'var(--teal-dark)' : 'var(--orange)', marginTop: 2 }}>
                  {r.status === 'subscribed' ? '✓ Subscribed' : '⏳ In trial'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {pendingCount > 0 && (
          <div style={{ marginTop: 16, background: 'rgba(255,198,74,0.1)', border: '1px solid rgba(255,198,74,0.3)', borderRadius: 14, padding: '12px 16px', fontSize: 13, color: '#8B6914' }}>
            💡 {pendingCount} friend{pendingCount > 1 ? 's are' : ' is'} still in trial — nudge them to subscribe and you'll both get a free month!
          </div>
        )}
      </div>
    </div>
  )
}
