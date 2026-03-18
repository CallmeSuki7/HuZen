/**
 * ZenSpace Backend Server
 * Handles Stripe payments, subscriptions, and webhooks
 * Run with: node server/index.js
 */

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
const PORT = process.env.PORT || 4000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: CLIENT_URL, credentials: true }))

// Stripe webhooks need raw body — mount BEFORE express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleWebhook)

app.use(express.json())

// ─── In-memory user store (replace with DB in production) ────────────────────
const users = new Map()
// Structure: { email, name, stripeCustomerId, subscription: { status, plan, currentPeriodEnd }, isPremium }

// ─── Helper ──────────────────────────────────────────────────────────────────
function getUserByCustomerId(customerId) {
  for (const [email, user] of users.entries()) {
    if (user.stripeCustomerId === customerId) return { email, ...user }
  }
  return null
}

// ─── ROUTES ──────────────────────────────────────────────────────────────────

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🧘 ZenSpace API is running' })
})

/**
 * POST /api/create-customer
 * Creates or retrieves a Stripe customer for the user
 */
app.post('/api/create-customer', async (req, res) => {
  try {
    const { email, name } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    // Check if user already has a Stripe customer
    let user = users.get(email)
    if (user?.stripeCustomerId) {
      return res.json({ customerId: user.stripeCustomerId })
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { app: 'zenspace' }
    })

    // Save to our store
    users.set(email, {
      ...(user || {}),
      email,
      name,
      stripeCustomerId: customer.id,
      isPremium: false,
    })

    console.log(`✅ Created customer: ${customer.id} for ${email}`)
    res.json({ customerId: customer.id })
  } catch (err) {
    console.error('create-customer error:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/create-checkout-session
 * Creates a Stripe Checkout session for subscription or one-time payment
 */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { email, name, plan } = req.body

    const priceMap = {
      monthly:  process.env.STRIPE_PRICE_MONTHLY,
      annual:   process.env.STRIPE_PRICE_ANNUAL,
      lifetime: process.env.STRIPE_PRICE_LIFETIME,
    }

    const priceId = priceMap[plan]
    if (!priceId) return res.status(400).json({ error: `Unknown plan: ${plan}` })

    // Get or create customer
    let user = users.get(email)
    let customerId = user?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({ email, name, metadata: { app: 'zenspace' } })
      customerId = customer.id
      users.set(email, { ...(user || {}), email, name, stripeCustomerId: customerId, isPremium: false })
    }

    const isLifetime = plan === 'lifetime'

    const sessionConfig = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isLifetime ? 'payment' : 'subscription',
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/?cancelled=true`,
      metadata: { plan, email },
      allow_promotion_codes: true,
    }

    // Add trial for subscription plans
    if (!isLifetime) {
      sessionConfig.subscription_data = {
        trial_period_days: 7,
        metadata: { plan, email }
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
    console.log(`💳 Checkout session created: ${session.id} | plan: ${plan} | email: ${email}`)
    res.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('create-checkout-session error:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/create-portal-session
 * Creates a Stripe Customer Portal session for managing subscription
 */
app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { email } = req.body
    const user = users.get(email)

    if (!user?.stripeCustomerId) {
      return res.status(404).json({ error: 'No Stripe customer found for this user' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${CLIENT_URL}/profile`,
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('create-portal-session error:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/subscription-status
 * Returns the user's current subscription status
 */
app.get('/api/subscription-status', async (req, res) => {
  try {
    const { email } = req.query
    if (!email) return res.status(400).json({ error: 'Email required' })

    const user = users.get(email)
    if (!user?.stripeCustomerId) {
      return res.json({ isPremium: false, plan: null, status: 'none' })
    }

    // Fetch latest subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'all',
      limit: 1,
    })

    // Check for lifetime (one-time payment)
    const paymentIntents = await stripe.paymentIntents.list({
      customer: user.stripeCustomerId,
      limit: 10,
    })
    const hasLifetime = paymentIntents.data.some(
      pi => pi.status === 'succeeded' && pi.metadata?.plan === 'lifetime'
    )

    if (hasLifetime) {
      return res.json({ isPremium: true, plan: 'lifetime', status: 'active' })
    }

    if (subscriptions.data.length === 0) {
      return res.json({ isPremium: false, plan: null, status: 'none' })
    }

    const sub = subscriptions.data[0]
    const isPremium = ['active', 'trialing'].includes(sub.status)

    res.json({
      isPremium,
      plan: sub.metadata?.plan || 'unknown',
      status: sub.status,
      trialEnd: sub.trial_end,
      currentPeriodEnd: sub.current_period_end,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    })
  } catch (err) {
    console.error('subscription-status error:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/webhook
 * Stripe webhook handler — updates user premium status on events
 */
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error(`❌ Webhook signature failed: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log(`🎣 Webhook received: ${event.type}`)

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object
      const email = session.metadata?.email
      if (!email) break

      const user = users.get(email) || {}
      users.set(email, {
        ...user,
        email,
        stripeCustomerId: session.customer,
        isPremium: true,
        subscription: { status: 'active', plan: session.metadata?.plan }
      })
      console.log(`🎉 Premium activated for ${email} (${session.metadata?.plan})`)
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const sub = event.data.object
      const user = getUserByCustomerId(sub.customer)
      if (!user) break

      const isPremium = ['active', 'trialing'].includes(sub.status)
      users.set(user.email, {
        ...user,
        isPremium,
        subscription: {
          status: sub.status,
          plan: sub.metadata?.plan,
          currentPeriodEnd: sub.current_period_end,
          trialEnd: sub.trial_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        }
      })
      console.log(`🔄 Subscription ${sub.status} for ${user.email}`)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const user = getUserByCustomerId(sub.customer)
      if (!user) break

      users.set(user.email, { ...user, isPremium: false, subscription: { status: 'cancelled' } })
      console.log(`😢 Subscription cancelled for ${user.email}`)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object
      const user = getUserByCustomerId(invoice.customer)
      if (user) console.log(`💰 Payment succeeded: $${invoice.amount_paid / 100} from ${user.email}`)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      const user = getUserByCustomerId(invoice.customer)
      if (user) {
        users.set(user.email, { ...user, isPremium: false })
        console.log(`💸 Payment failed for ${user.email}`)
      }
      break
    }

    case 'customer.subscription.trial_will_end': {
      const sub = event.data.object
      const user = getUserByCustomerId(sub.customer)
      if (user) console.log(`⏰ Trial ending soon for ${user.email} — send reminder email!`)
      break
    }
  }

  res.json({ received: true })
}

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
🧘 ZenSpace API running on port ${PORT}
📡 Client URL: ${CLIENT_URL}
💳 Stripe mode: ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? '🟢 LIVE' : '🟡 TEST'}
  `)
})
