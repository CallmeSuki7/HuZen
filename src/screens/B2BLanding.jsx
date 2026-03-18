import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { val: '32%', label: 'reduction in employee burnout', icon: '📉' },
  { val: '28%', label: 'increase in productivity', icon: '📈' },
  { val: '4.2x', label: 'ROI on wellness programs', icon: '💰' },
  { val: '91%', label: 'of users feel less stressed', icon: '😌' },
]

const tiers = [
  {
    name: 'Starter', seats: '10–49', price: '$9', period: '/seat/mo',
    color: '#3ECFB2', features: ['All meditations & sleep', 'Mobile app access', 'Basic usage reports', 'Email support'],
    cta: 'Start free trial'
  },
  {
    name: 'Business', seats: '50–499', price: '$7', period: '/seat/mo',
    color: '#FF6B35', popular: true,
    features: ['Everything in Starter', 'Admin dashboard', 'Team wellness reports', 'CSV bulk invite', 'Slack integration', 'Dedicated CSM'],
    cta: 'Get a demo'
  },
  {
    name: 'Enterprise', seats: '500+', price: 'Custom', period: ' pricing',
    color: '#5C6BC0',
    features: ['Everything in Business', 'SSO / SAML', 'Custom content', 'API access', 'SLA guarantee', 'On-site training'],
    cta: 'Contact sales'
  },
]

const logos = ['Google', 'Shopify', 'Spotify', 'Nike', 'Airbnb', 'Stripe']

const testimonials = [
  { quote: "We saw a 40% drop in stress-related sick days within 3 months. The ROI speaks for itself.", name: "Sarah Chen", role: "Chief People Officer", company: "TechCorp" },
  { quote: "Our employees actually use it. 78% weekly active rate — nothing else we've tried comes close.", name: "Marcus Williams", role: "HR Director", company: "FinanceHub" },
  { quote: "The admin dashboard makes it easy to show leadership the impact. It pays for itself.", name: "Priya Patel", role: "Wellbeing Lead", company: "ScaleUp Inc" },
]

const faqs = [
  { q: "How does billing work for teams?", a: "We bill monthly or annually per active seat. You only pay for employees who actually log in — unused seats are credited to your next invoice." },
  { q: "Can we integrate with our existing HR tools?", a: "Yes. Hu Zen connects with Slack, Microsoft Teams, Workday, BambooHR, and more via our API or Zapier." },
  { q: "Is there a minimum commitment?", a: "Starter and Business plans are month-to-month. Enterprise plans are annual with volume discounts of up to 40%." },
  { q: "How do we get employees onboarded?", a: "Upload a CSV of emails and we handle the rest. Employees get a personalised invite and can start in under 2 minutes." },
  { q: "What data do you share with employers?", a: "Aggregate and anonymised data only. Individual sessions are completely private — we never share what specific employees meditate on." },
]

export default function B2BLanding() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [seats, setSeats] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [activeFaq, setActiveFaq] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  const handleDemo = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0A0A14', color: 'white', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🧘</span>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Hu Zen <span style={{ color: '#3ECFB2', fontSize: 13, fontWeight: 500, background: 'rgba(62,207,178,0.12)', padding: '3px 10px', borderRadius: 20, marginLeft: 4 }}>for Work</span></span>
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
          {['Features', 'Pricing', 'Case Studies', 'FAQ'].map(l => (
            <span key={l} style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>{l}</span>
          ))}
        </div>
        <button onClick={() => document.getElementById('demo-form').scrollIntoView({ behavior: 'smooth' })}
          style={{ padding: '10px 24px', borderRadius: 40, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Get a demo →
        </button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient orbs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,107,53,0.12),transparent 70%)', top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(62,207,178,0.08),transparent 70%)', bottom: '10%', right: '10%', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ maxWidth: 780, position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(62,207,178,0.1)', border: '1px solid rgba(62,207,178,0.25)', borderRadius: 40, padding: '8px 18px', fontSize: 13, color: '#3ECFB2', marginBottom: 32, fontWeight: 500 }}>
            🏆 Trusted by 2,400+ companies worldwide
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(44px, 7vw, 76px)', fontWeight: 400, lineHeight: 1.1, marginBottom: 24, letterSpacing: -1 }}>
            Your team's mental health<br />
            <span style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>is your competitive edge</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            Hu Zen for Work gives your employees guided meditation, sleep tools, and stress relief — measurable ROI for HR, real results for people.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('demo-form').scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '16px 36px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              Book a free demo →
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '16px 36px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>
              See how it works ▶
            </motion.button>
          </div>
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            Free 30-day pilot · No credit card · Cancel anytime
          </div>
        </motion.div>
      </section>

      {/* LOGO BAR */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '28px 40px' }}>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>Trusted by teams at</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {logos.map(l => (
            <div key={l} style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: -0.5 }}>{l}</div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 13, color: '#FF6B35', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>The numbers don't lie</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, fontWeight: 400, lineHeight: 1.2 }}>Built on science,<br />proven in practice</h2>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {stats.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '32px 28px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, fontWeight: 400, color: '#FF6B35', lineHeight: 1, marginBottom: 10 }}>{s.val}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ fontSize: 13, color: '#3ECFB2', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Built for HR teams</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, fontWeight: 400 }}>Everything you need to run<br />a world-class wellness program</h2>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              { icon: '📊', title: 'Real-time admin dashboard', desc: 'See team engagement, top sessions, usage trends and wellness scores — all in one place. Perfect for board reports.' },
              { icon: '📧', title: 'Bulk invite & onboarding', desc: 'Upload a CSV, we do the rest. Employees are onboarded in under 2 minutes with a personalised welcome email.' },
              { icon: '📈', title: 'Monthly wellness reports', desc: 'Automated PDF reports delivered to HR showing ROI metrics, engagement rates and department breakdowns.' },
              { icon: '🔔', title: 'Smart reminders', desc: 'AI-powered nudges sent at each employee\'s optimal time based on their timezone and usage patterns.' },
              { icon: '🔒', title: 'Enterprise-grade security', desc: 'SOC 2 Type II certified. SSO/SAML support. Individual data is always private — only aggregates shared with HR.' },
              { icon: '🤝', title: 'Dedicated success manager', desc: 'Business and Enterprise customers get a human CSM who checks in monthly and helps drive adoption.' },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ADMIN DASHBOARD PREVIEW */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 13, color: '#FF6B35', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Admin dashboard</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, fontWeight: 400 }}>Know exactly what's working</h2>
            </div>
          </FadeIn>
          <AdminDashboardPreview />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#3ECFB2', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 40 }}>What HR leaders say</div>
          <div style={{ position: 'relative', minHeight: 200 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} animate={{ opacity: activeTestimonial === i ? 1 : 0, y: activeTestimonial === i ? 0 : 20 }}
                style={{ position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, right: 0, pointerEvents: activeTestimonial === i ? 'auto' : 'none' }}>
                <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 28, fontFamily: "'DM Serif Display', serif" }}>
                  "{t.quote}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    {t.name[0]}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
            {testimonials.map((_, i) => (
              <div key={i} onClick={() => setActiveTestimonial(i)}
                style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? '#FF6B35' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s', cursor: 'pointer' }} />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ fontSize: 13, color: '#FF6B35', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Pricing</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, fontWeight: 400, marginBottom: 12 }}>Simple, transparent pricing</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>Annual billing saves up to 30%. Volume discounts available for 1,000+ seats.</p>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {tiers.map((tier, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: tier.popular ? 'rgba(255,107,53,0.08)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${tier.popular ? '#FF6B35' : 'rgba(255,255,255,0.08)'}`, borderRadius: 24, padding: '32px 28px', position: 'relative' }}>
                  {tier.popular && (
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 18px', borderRadius: 40, whiteSpace: 'nowrap', letterSpacing: 0.5 }}>
                      MOST POPULAR
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: tier.color, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{tier.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{tier.seats} employees</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, fontWeight: 400, color: 'white' }}>{tier.price}</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{tier.period}</span>
                  </div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '24px 0' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                    {tier.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                        <span style={{ color: tier.color, fontSize: 16 }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => document.getElementById('demo-form').scrollIntoView({ behavior: 'smooth' })}
                    style={{ width: '100%', padding: '14px', borderRadius: 50, border: `1.5px solid ${tier.popular ? 'transparent' : 'rgba(255,255,255,0.2)'}`, background: tier.popular ? 'linear-gradient(135deg,#FF6B35,#FFC64A)' : 'transparent', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {tier.cta} →
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            All plans include a 30-day free pilot. No credit card required to start.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, fontWeight: 400 }}>Common questions</h2>
            </div>
          </FadeIn>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px 0' }}>
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'white', fontSize: 16, fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', gap: 16 }}>
                {faq.q}
                <span style={{ fontSize: 20, color: '#FF6B35', flexShrink: 0, transition: 'transform 0.3s', transform: activeFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              <motion.div animate={{ height: activeFaq === i ? 'auto' : 0, opacity: activeFaq === i ? 1 : 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 0 4px', fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{faq.a}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO FORM */}
      <section id="demo-form" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 13, color: '#FF6B35', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Get started</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, fontWeight: 400, marginBottom: 12 }}>Book your free demo</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>30 minutes. No pressure. We'll show you exactly how it works for your team.</p>
            </div>
          </FadeIn>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', background: 'rgba(62,207,178,0.08)', border: '1px solid rgba(62,207,178,0.3)', borderRadius: 24, padding: '48px 32px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, marginBottom: 12 }}>You're booked in!</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                Check your email for a calendar invite. Our team will reach out within 24 hours to confirm your 30-minute demo slot.
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleDemo} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Work email', val: email, set: setEmail, type: 'email', placeholder: 'you@company.com' },
                { label: 'Company name', val: company, set: setCompany, type: 'text', placeholder: 'Acme Corp' },
                { label: 'Number of employees', val: seats, set: setSeats, type: 'text', placeholder: 'e.g. 150' },
              ].map(({ label, val, set, type, placeholder }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</label>
                  <input value={val} onChange={e => set(e.target.value)} type={type} placeholder={placeholder} required
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B35'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
              ))}
              <motion.button type="submit" whileTap={{ scale: 0.97 }}
                style={{ marginTop: 8, padding: '18px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#FF6B35,#FFC64A)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Book free demo →
              </motion.button>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                No credit card · 30-day free pilot · Cancel anytime
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>🧘</span>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Hu Zen for Work</span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
          © 2025 Hu Zen Inc. · Privacy Policy · Terms of Service · security@huzen.app
        </div>
      </footer>
    </div>
  )
}

// Reusable fade-in wrapper
function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

// Live admin dashboard preview
function AdminDashboardPreview() {
  const depts = [
    { name: 'Engineering', pct: 78, sessions: 342 },
    { name: 'Sales', pct: 65, sessions: 218 },
    { name: 'Customer Success', pct: 82, sessions: 196 },
    { name: 'Marketing', pct: 71, sessions: 143 },
    { name: 'HR & People', pct: 91, sessions: 88 },
  ]
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '28px', overflow: 'hidden' }}>
      {/* Mock top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>ACME CORP · 847 seats</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Wellness Dashboard — March 2025</div>
        </div>
        <div style={{ background: 'rgba(62,207,178,0.12)', border: '1px solid rgba(62,207,178,0.25)', borderRadius: 40, padding: '6px 16px', fontSize: 13, color: '#3ECFB2', fontWeight: 600 }}>
          📊 Export PDF report
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Active users', val: '674', sub: '↑12% vs last month', color: '#3ECFB2' },
          { label: 'Avg. sessions/week', val: '3.2', sub: '↑0.4 vs last month', color: '#FF6B35' },
          { label: 'Stress score', val: '6.1→4.8', sub: '↓21% improvement', color: '#FFC64A' },
          { label: 'Est. ROI', val: '$28,400', sub: 'This month vs sick days', color: '#9575CD' },
        ].map((k, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '16px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.color, marginBottom: 4 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Department breakdown */}
      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 14, letterSpacing: 0.5, textTransform: 'uppercase' }}>Engagement by department</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {depts.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 140, fontSize: 13, color: 'rgba(255,255,255,0.65)', flexShrink: 0 }}>{d.name}</div>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg,#FF6B35,#FFC64A)` }} />
            </div>
            <div style={{ width: 36, fontSize: 13, fontWeight: 600, color: '#FFC64A', flexShrink: 0 }}>{d.pct}%</div>
            <div style={{ width: 60, fontSize: 12, color: 'rgba(255,255,255,0.35)', flexShrink: 0, textAlign: 'right' }}>{d.sessions} sessions</div>
          </div>
        ))}
      </div>
    </div>
  )
}
