import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Terms() {
  const nav = useNavigate()
  const date = 'March 2025'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '52px 24px 32px' }}>
        <button onClick={() => nav(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: 'white', fontSize: 16, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div className="serif" style={{ fontSize: 32, color: 'white', marginBottom: 6 }}>Terms of Service</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Last updated: {date}</div>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: 680, margin: '0 auto' }}>
        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or using Hu Zen ("the App"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the App. These terms apply to all users, including free and paid subscribers.'
          },
          {
            title: '2. Description of Service',
            body: 'Hu Zen provides guided meditation, mindfulness, sleep, and wellness content through a subscription-based mobile and web application. Content is for personal, non-commercial use only.'
          },
          {
            title: '3. Subscriptions & Payments',
            body: 'Hu Zen offers Monthly ($12.99/mo), Annual ($69/yr), and Lifetime ($149 one-time) subscription plans. All payments are processed securely by Stripe. Subscriptions automatically renew unless cancelled before the renewal date. A 7-day free trial is offered on Monthly and Annual plans — no charge until the trial ends.'
          },
          {
            title: '4. Cancellation & Refunds',
            body: 'You may cancel your subscription at any time through the billing portal. Cancellations take effect at the end of the current billing period. Refunds are considered on a case-by-case basis within 14 days of purchase. Lifetime purchases are non-refundable after 14 days.'
          },
          {
            title: '5. User Accounts',
            body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.'
          },
          {
            title: '6. Health Disclaimer',
            body: 'Hu Zen is a wellness app and is not a substitute for professional medical advice, diagnosis, or treatment. If you have a medical or mental health condition, consult a qualified healthcare provider before using the App. Do not ignore professional medical advice because of something you read or heard in the App.'
          },
          {
            title: '7. Intellectual Property',
            body: 'All content in the App including meditations, audio, text, and graphics is owned by Hu Zen or its licensors and is protected by copyright law. You may not reproduce, distribute, or create derivative works without prior written permission.'
          },
          {
            title: '8. Privacy',
            body: 'Your use of the App is also governed by our Privacy Policy. We collect minimal personal data and never sell your information to third parties. Individual meditation usage data is private and never shared with employers or third parties.'
          },
          {
            title: '9. Limitation of Liability',
            body: 'To the maximum extent permitted by law, Hu Zen shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App. Our total liability shall not exceed the amount you paid in the 12 months preceding the claim.'
          },
          {
            title: '10. Changes to Terms',
            body: 'We may update these terms from time to time. We will notify you of significant changes via email or in-app notification. Continued use of the App after changes constitutes acceptance of the new terms.'
          },
          {
            title: '11. Contact',
            body: 'For questions about these Terms, please contact us at legal@huzen.app'
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
