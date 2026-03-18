// Service Worker for ZenSpace push notifications
// Save as: public/sw.js

self.addEventListener('install', e => { self.skipWaiting() })
self.addEventListener('activate', e => { e.waitUntil(clients.claim()) })

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {}
  const options = {
    body: data.body || 'Your daily mindfulness session is waiting.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'start', title: '🧘 Start now' },
      { action: 'snooze', title: '⏰ Remind me in 1hr' },
    ],
    tag: 'zenspace-reminder',
    renotify: true,
  }
  event.waitUntil(self.registration.showNotification(data.title || 'Time to breathe 🧘', options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  if (event.action === 'snooze') return // Could reschedule here
  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'))
})
