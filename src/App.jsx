import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useStore } from './store'
import { onAuthStateChange, upsertProfile } from './supabase'
import SplashScreen from './components/SplashScreen'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Explore from './screens/Explore'
import Sleep from './screens/Sleep'
import Profile from './screens/Profile'
import Player from './screens/Player'
import Success from './screens/Success'
import B2BLanding from './screens/B2BLanding'
import AIRecommend from './screens/AIRecommend'
import Referral from './screens/Referral'
import Terms from './screens/Terms'
import Privacy from './screens/Privacy'
import BottomNav from './components/BottomNav'
import Paywall from './components/Paywall'

export default function App() {
  const { user, showOnboarding, login, logout } = useStore()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user
        await upsertProfile(u)
        login({
          id: u.id,
          name: u.user_metadata?.full_name || u.email.split('@')[0],
          email: u.email,
          avatar: (u.user_metadata?.full_name || u.email)[0].toUpperCase(),
        })
      }
      if (event === 'SIGNED_OUT') logout()
    })
    return () => subscription.unsubscribe()
  }, [])

  // B2B landing always accessible without splash
  if (window.location.pathname === '/for-teams') return <B2BLanding />

  // Show splash on first load
  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />

  if (!user || showOnboarding) return <Onboarding />

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/sleep" element={<Sleep />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/success" element={<Success />} />
        <Route path="/recommend" element={<AIRecommend />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/for-teams" element={<B2BLanding />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>

      <Routes>
        <Route path="/player/:id" element={null} />
        <Route path="/success" element={null} />
        <Route path="/recommend" element={null} />
        <Route path="/for-teams" element={null} />
        <Route path="/terms" element={null} />
        <Route path="/privacy" element={null} />
        <Route path="*" element={<BottomNav />} />
      </Routes>

      <Paywall />
    </div>
  )
}
