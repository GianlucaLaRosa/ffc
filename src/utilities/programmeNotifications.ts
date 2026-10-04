import {
  dueProgrammeAlerts,
  programmeAlertTimestamps,
  type ProgrammeAlertKind,
  type SavedAgendaItem,
} from '@/utilities/savedAgenda'

export const PROGRAMME_SW_PATH = '/sw.js'
const NOTIFIED_STORAGE_PREFIX = 'ffc-programme-notified'

export type NotificationPermissionState = NotificationPermission | 'unsupported'

export function notificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

export function notificationsSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator
  )
}

export function iPhoneNeedsHomeScreen(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const iOS = /iPad|iPhone|iPod/.test(ua)
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && Boolean((window.navigator as { standalone?: boolean }).standalone))
  return iOS && !standalone
}

export async function registerProgrammeServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.register(PROGRAMME_SW_PATH, { scope: '/' })
  } catch (error) {
    console.error('Failed to register programme service worker', error)
    return null
  }
}

export async function requestProgrammeNotificationPermission(): Promise<NotificationPermissionState> {
  if (!notificationsSupported()) return 'unsupported'
  const result = await Notification.requestPermission()
  return result
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i)
  return output
}

export async function subscribeProgrammePush(
  registration: ServiceWorkerRegistration,
): Promise<PushSubscription | null> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!publicKey || !('pushManager' in registration)) return null

  const existing = await registration.pushManager.getSubscription()
  if (existing) return existing

  try {
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    })
  } catch (error) {
    console.error('Failed to subscribe to programme push', error)
    return null
  }
}

export async function syncProgrammePushSubscription(input: {
  subscription: PushSubscription
  conferenceId: number | string
  canonicalPath: string
  items: SavedAgendaItem[]
}): Promise<void> {
  try {
    await fetch('/api/programme-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: input.subscription.toJSON(),
        conferenceId: input.conferenceId,
        canonicalPath: input.canonicalPath,
        items: input.items,
      }),
    })
  } catch (error) {
    console.error('Failed to sync programme push subscription', error)
  }
}

export async function showProgrammeNotification(payload: {
  title: string
  body: string
  tag: string
  url: string
  agendaId: string
  kind: ProgrammeAlertKind
}): Promise<void> {
  const registration = await navigator.serviceWorker.getRegistration(PROGRAMME_SW_PATH)
  if (registration) {
    const ready = registration.active ? registration : await navigator.serviceWorker.ready
    if (ready.active) {
      ready.active.postMessage({ type: 'ffc-show-notification', payload })
      return
    }
    await registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: '/icons/pwa/192',
      data: { url: payload.url, agendaId: payload.agendaId, kind: payload.kind },
    })
    return
  }

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(payload.title, { body: payload.body, tag: payload.tag, icon: '/icons/pwa/192' })
  }
}

function notifiedKey(kind: ProgrammeAlertKind): string {
  return `${NOTIFIED_STORAGE_PREFIX}:${kind}`
}

function readNotified(kind: ProgrammeAlertKind): Set<string> {
  try {
    const raw = window.sessionStorage.getItem(notifiedKey(kind))
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return new Set(Array.isArray(parsed) ? parsed.map(String) : [])
  } catch {
    return new Set()
  }
}

function writeNotified(kind: ProgrammeAlertKind, ids: Set<string>): void {
  window.sessionStorage.setItem(notifiedKey(kind), JSON.stringify([...ids]))
}

export async function fireDueProgrammeNotifications(input: {
  items: SavedAgendaItem[]
  now: Date
  canonicalPath: string
  leadMinutes?: number
  notificationTitle?: string
}): Promise<void> {
  if (notificationPermission() !== 'granted') return

  const origin = window.location.origin
  const path = input.canonicalPath.startsWith('/') ? input.canonicalPath : `/${input.canonicalPath}`
  const title = input.notificationTitle || 'FFC Conference'

  for (const alert of dueProgrammeAlerts(input.items, input.now, input.leadMinutes)) {
    const notified = readNotified(alert.kind)
    if (notified.has(alert.item.id)) continue

    const minutes = Math.max(1, Math.ceil(alert.minutes ?? input.leadMinutes ?? 5))
    const url = `${origin}${path}?agenda=${encodeURIComponent(alert.item.id)}`
    await showProgrammeNotification({
      title,
      body:
        alert.kind === 'live'
          ? `${alert.item.title} is starting now`
          : `Starts in ${minutes} min: ${alert.item.title}`,
      tag: `ffc-${alert.kind}-${alert.item.id}`,
      url,
      agendaId: alert.item.id,
      kind: alert.kind,
    })
    notified.add(alert.item.id)
    writeNotified(alert.kind, notified)
  }
}

const MAX_TIMER_MS = 36 * 60 * 60 * 1000

export function scheduleProgrammeNotificationTimers(
  items: SavedAgendaItem[],
  canonicalPath: string,
  leadMinutes?: number,
  notificationTitle?: string,
): () => void {
  const now = Date.now()
  const timerIds: number[] = []
  const fire = () => {
    void fireDueProgrammeNotifications({
      items,
      now: new Date(),
      canonicalPath,
      leadMinutes,
      notificationTitle,
    })
  }

  for (const item of items) {
    const times = programmeAlertTimestamps(item, leadMinutes)
    for (const at of [times.soon, times.live]) {
      if (at === null) continue
      const delay = at - now
      if (delay <= 0 || delay > MAX_TIMER_MS) continue
      timerIds.push(window.setTimeout(fire, delay))
    }
  }

  return () => {
    for (const id of timerIds) window.clearTimeout(id)
  }
}
