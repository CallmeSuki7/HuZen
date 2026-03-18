import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('@supabase')) return 'supabase'
            if (id.includes('stripe')) return 'stripe'
            if (id.includes('react-router')) return 'router'
            if (id.includes('react') || id.includes('react-dom')) return 'react'
            if (id.includes('zustand')) return 'state'
            return 'vendor'
          }
        }
      }
    }
  }
})
