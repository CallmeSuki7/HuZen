/**
 * Hu Zen Stripe Service
 * All frontend <-> backend payment calls go through here
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'API error')
  }
  return res.json()
}

async function apiGet(path, params = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${API_URL}${path}${qs ? '?' + qs : ''}`)
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'API error')
  }
  return res.json()
}

/**
 * Redirect user to Stripe Checkout for the selected plan
 * Plans: 'monthly' | 'annual' | 'lifetime'
 */
export async function startCheckout({ email, name, plan }) {
  const { url } = await apiPost('/api/create-checkout-session', { email, name, plan })
  window.location.href = url
}

/**
 * Open Stripe Customer Portal for managing subscription,
 * updating payment method, viewing invoices, cancelling etc.
 */
export async function openCustomerPortal(email) {
  const { url } = await apiPost('/api/create-portal-session', { email })
  window.location.href = url
}

/**
 * Fetch user's current subscription status from our backend
 */
export async function fetchSubscriptionStatus(email) {
  return apiGet('/api/subscription-status', { email })
}

/**
 * Create or retrieve Stripe customer (call on signup/login)
 */
export async function ensureStripeCustomer({ email, name }) {
  return apiPost('/api/create-customer', { email, name })
}
