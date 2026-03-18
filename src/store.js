import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // Auth
  user: null,
  isPremium: false,
  
  // Meditation data
  sessions: [
    { id: 1, title: 'Morning Calm', category: 'Mindfulness', duration: 600, instructor: 'Andy', emoji: '🌅', color: '#FF6B35', bg: 'linear-gradient(135deg,#FF6B35,#FFC64A)', free: true, desc: 'Start your day with clarity and intention. This session uses breath awareness to anchor your mind in the present moment.' },
    { id: 2, title: 'Ocean Mind', category: 'Focus', duration: 900, instructor: 'Eve', emoji: '🌊', color: '#3ECFB2', bg: 'linear-gradient(135deg,#0F9B82,#3ECFB2)', free: true, desc: 'Let the rhythm of ocean waves guide your attention into deep, sustained focus.' },
    { id: 3, title: 'Sleep Drift', category: 'Sleep', duration: 1200, instructor: 'Andy', emoji: '🌙', color: '#5C6BC0', bg: 'linear-gradient(135deg,#1A1A2E,#5C6BC0)', free: false, desc: 'Gently release the day and drift into restorative sleep with this guided body scan.' },
    { id: 4, title: 'Energy Boost', category: 'Breathe', duration: 300, instructor: 'Sam', emoji: '⚡', color: '#FFC64A', bg: 'linear-gradient(135deg,#FF8C5A,#FFC64A)', free: true, desc: 'A quick energising breathwork session to wake up your body and mind.' },
    { id: 5, title: 'Stress Melt', category: 'Stress', duration: 720, instructor: 'Eve', emoji: '🫧', color: '#9575CD', bg: 'linear-gradient(135deg,#7E57C2,#CE93D8)', free: false, desc: 'Progressive muscle relaxation combined with visualisation to dissolve tension.' },
    { id: 6, title: 'Loving Kindness', category: 'Mindfulness', duration: 600, instructor: 'Andy', emoji: '❤️', color: '#EF5350', bg: 'linear-gradient(135deg,#EF5350,#FF8A65)', free: false, desc: 'Open your heart and cultivate compassion for yourself and others.' },
    { id: 7, title: 'Focus Flow', category: 'Focus', duration: 1500, instructor: 'Sam', emoji: '🎯', color: '#26A69A', bg: 'linear-gradient(135deg,#00796B,#26A69A)', free: false, desc: 'Deep work session using pomodoro-style meditation intervals.' },
    { id: 8, title: 'Sunrise Breath', category: 'Breathe', duration: 420, instructor: 'Eve', emoji: '🌤', color: '#FF7043', bg: 'linear-gradient(135deg,#FF5722,#FFCC02)', free: true, desc: 'Box breathing and 4-7-8 technique to prime your nervous system for the day.' },
    { id: 9, title: 'Anxiety Ease', category: 'Stress', duration: 540, instructor: 'Andy', emoji: '🌿', color: '#66BB6A', bg: 'linear-gradient(135deg,#388E3C,#66BB6A)', free: false, desc: 'Ground yourself in the present and gently release anxious thought loops.' },
    { id: 10, title: 'Deep Rest', category: 'Sleep', duration: 1800, instructor: 'Sam', emoji: '💤', color: '#42A5F5', bg: 'linear-gradient(135deg,#1565C0,#42A5F5)', free: false, desc: 'A full yoga nidra experience for profound rest and nervous system recovery.' },
  ],

  packs: [
    { id: 1, title: 'Foundations', sessions: 10, days: 10, emoji: '🌱', color: '#3ECFB2', bg: 'linear-gradient(135deg,#0F9B82,#3ECFB2)', free: true, desc: 'The essential starter course. Build a daily practice from scratch.' },
    { id: 2, title: 'Better Sleep', sessions: 8, days: 8, emoji: '🌙', color: '#5C6BC0', bg: 'linear-gradient(135deg,#1A1A2E,#5C6BC0)', free: false, desc: 'Rewire your relationship with sleep.' },
    { id: 3, title: 'Stress Less', sessions: 12, days: 30, emoji: '🫧', color: '#9575CD', bg: 'linear-gradient(135deg,#7E57C2,#CE93D8)', free: false, desc: 'Science-backed tools for managing stress.' },
    { id: 4, title: 'Focus Mode', sessions: 10, days: 14, emoji: '🎯', color: '#26A69A', bg: 'linear-gradient(135deg,#00796B,#26A69A)', free: false, desc: 'Train your attention like an athlete trains their body.' },
    { id: 5, title: 'Self-Compassion', sessions: 7, days: 7, emoji: '❤️', color: '#EF5350', bg: 'linear-gradient(135deg,#EF5350,#FF8A65)', free: false, desc: 'Learn to be your own best friend.' },
    { id: 6, title: 'Morning Ritual', sessions: 9, days: 21, emoji: '🌅', color: '#FF6B35', bg: 'linear-gradient(135deg,#FF6B35,#FFC64A)', free: false, desc: 'Design a morning that sets you up for success.' },
  ],

  // Player state
  currentSession: null,
  isPlaying: false,
  elapsed: 0,
  volume: 0.7,
  completedSessions: [1, 2, 4, 8],
  favorites: [1, 3],

  // UI state
  showPaywall: false,
  showOnboarding: true,

  // Actions
  login: (userData) => set({ user: userData, showOnboarding: false }),
  logout: () => set({ user: null, isPremium: false }),
  upgradeToPremium: () => set({ isPremium: true, showPaywall: false }),
  
  setCurrentSession: (session) => set({ currentSession: session, elapsed: 0, isPlaying: true }),
  setPlaying: (val) => set({ isPlaying: val }),
  setElapsed: (val) => set({ elapsed: val }),
  setVolume: (val) => set({ volume: val }),
  
  toggleFavorite: (id) => set(state => ({
    favorites: state.favorites.includes(id)
      ? state.favorites.filter(f => f !== id)
      : [...state.favorites, id]
  })),
  
  completeSession: (id) => set(state => ({
    completedSessions: state.completedSessions.includes(id)
      ? state.completedSessions
      : [...state.completedSessions, id]
  })),

  openPaywall: () => set({ showPaywall: true }),
  closePaywall: () => set({ showPaywall: false }),
}))
