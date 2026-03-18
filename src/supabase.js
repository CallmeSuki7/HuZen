import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing — auth will run in demo mode')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    })
  : null

export async function signUpWithEmail({ email, password, name }) {
  if (!supabase) return { user: { email, name, id: 'demo' }, error: null }
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: {
      data: { full_name: name, avatar: name?.[0]?.toUpperCase() || 'U' },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    }
  })
  return { user: data?.user, error }
}

export async function signInWithEmail({ email, password }) {
  if (!supabase) return { user: { email, id: 'demo' }, error: null }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { user: data?.user, error }
}

export async function signInWithApple() {
  if (!supabase) return { error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'name email',
    }
  })
  return { data, error }
}

export async function resetPassword(email) {
  if (!supabase) return { error: null }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  })
  return { error }
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data?.session
}

export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } }
  return supabase.auth.onAuthStateChange(callback)
}

export async function upsertProfile(user) {
  if (!supabase || !user) return
  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || '',
    avatar: user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' })
}

export async function fetchProfile(userId) {
  if (!supabase || !userId) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}
