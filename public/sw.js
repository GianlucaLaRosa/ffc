const PWA_ICON = '/icons/pwa/192'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.clients.claim()
    })(),
  )
})

async function showFromPayload(payload = {}) {
  const title = payload.title || 'FFC Conference'
  await self.registration.showNotification(title, {
    body: payload.body || '',
    tag: payload.tag || 'ffc-conference',
    icon: PWA_ICON,
    badge: PWA_ICON,
    data: {
      url: payload.url || '/',
      agendaId: payload.agendaId || '',
      kind: payload.kind || '',
    },
  })
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'ffc-show-notification') {
    event.waitUntil(showFromPayload(event.data.payload || {}))
  }
})

self.addEventListener('push', (event) => {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = { body: event.data ? event.data.text() : '' }
  }
  event.waitUntil(showFromPayload(payload))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const data = event.notification.data || {}
  const targetUrl = data.url || '/'

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      const existing = windowClients.find((client) => {
        try {
          return new URL(client.url).origin === self.location.origin
        } catch {
          return false
        }
      })

      if (existing) {
        await existing.focus()
        if (data.agendaId) {
          existing.postMessage({ type: 'ffc-focus-agenda', id: data.agendaId })
        }
        return
      }

      await self.clients.openWindow(targetUrl)
    })(),
  )
})
