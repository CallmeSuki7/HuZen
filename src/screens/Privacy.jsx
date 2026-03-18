import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Privacy() {
  const nav = useNavigate()
  const date = 'March 2025'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: 60 }}>
      <div style={{ background: 'var(--navy)', padding: '52px 24px 32px' }}>
        <button onClick={() => nav(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: 'white', fontSize: 16, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div className="serif" style={{ fontSize: 32, color: 'white', marginBottom: 6 }}>Privacy Policy</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Last updated: {date}</div>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: 680, margin: '0 auto' }}>
        {[
          {
            title: 'What we collect',
            body: 'We collect the minimum data necessary to provide the service: your email address and name when you sign up, payment information (processed by Stripe — we never store card details), and basic usage data such as sessions completed and streak counts.'
          },
          {
            title: 'What we never do',
            body: 'We never sell your personal data to third parties. We never share your individual meditation usage with employers, even on corporate plans — only anonymised aggregate data is available to company admins. We never use your data for advertising.'
          },
          {
            title: 'How we use your data',
            body: 'Your data is used to: provide and improve the service, process payments, send important account notifications, and personalise your experience such as session recommendations. We may send product updates via email — you can unsubscribe at any time.'
          },
          {
            title: 'Data storage & security',
            body: 'Your data is stored securely using Supabase (PostgreSQL) with row-level security enabled. All data is encrypted in transit using TLS and at rest. We are SOC 2 compliant and conduct regular security reviews.'
          },
          {
            title: 'Cookies',
            body: 'We use minimal cookies strictly necessary to keep you logged in and maintain your session. We do not use tracking or advertising cookies. You can clear cookies at any time through your browser settings.'
          },
          {
            title: 'Third-party services',
            body: 'We use Stripe for payment processing (privacy policy at stripe.com/privacy) and Supabase for authentication and database services. These services have their own privacy policies and security certifications.'
          },
          {
            title: 'Your rights',
            body: 'You have the right to access, correct, or delete your personal data at any time. You can export your data or request account deletion by emailing privacy@huzen.app. We will respond within 30 days.'
          },
          {
            title: 'Children\'s privacy',
            body: 'Hu Zen is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.'
          },
          {
            title: 'Changes to this policy',
            body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email. Continued use of the App after changes constitutes acceptance of the updated policy.'
          },
          {
            title: 'Contact us',
            body: 'For privacy-related questions or requests, contact us at privacy@huzen.app. For general support, contact support@huzen.app.'
          },
        ].map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{section.title}</div>
            <div style={{ fontSize: 15, color: 'var(--text-light)', lineHeight: 1.8 }}>{section.body}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
