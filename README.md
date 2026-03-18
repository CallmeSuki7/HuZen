# 🧘 Hu Zen — Meditation & Mindfulness App

A full-stack meditation app built for corporate wellness teams. Features guided sessions, sleep soundscapes, AI-powered recommendations, referral program, and Stripe subscription payments.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env   # Fill in your keys
npm run dev            # Frontend on :5173
npm run server         # Backend on :4000
```

## 💳 Stripe Setup (5 min)

1. Sign up at https://stripe.com
2. Get API keys → Dashboard → Developers → API Keys
3. Create 3 products:
   - Hu Zen Monthly: $12.99/month (recurring)
   - Hu Zen Annual: $69/year (recurring)
   - Hu Zen Lifetime: $149 (one-time)
4. Copy Price IDs into .env
5. Set up webhook at: https://yourdomain.com/api/webhook

## 🧪 Test Card
`4242 4242 4242 4242` — any future date, any CVC

## 💰 Revenue Streams
- Monthly: $12.99/mo
- Annual: $69/yr (most popular)
- Lifetime: $149 one-time
- 7-day free trial on all subscriptions
- Customer portal for self-serve billing

## 🏗 Stack
React + Vite · React Router · Zustand · Framer Motion · Web Audio API · Stripe · Express · Supabase

## 🚢 Deploy
- Frontend: Vercel
- Backend: Railway or Render (free tier)
- Auth & DB: Supabase (free tier)
