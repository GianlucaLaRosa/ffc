'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  isHappeningNow,
  isStartingSoon,
  minutesUntilStart,
  parseSavedAgendaStore,
  savedAgendaStorageKey,
  serializeSavedAgendaStore,
  sortSavedAgendaItems,
  type SavedAgendaItem,
} from '@/utilities/savedAgenda'
import {
  fireDueProgrammeNotifications,
  iPhoneNeedsHomeScreen,
  notificationPermission,
  notificationsSupported,
  registerProgrammeServiceWorker,
  requestProgrammeNotificationPermission,
  scheduleProgrammeNotificationTimers,
  showProgrammeNotification,
  subscribeProgrammePush,
  syncProgrammePushSubscription,
  type NotificationPermissionState,
} from '@/utilities/programmeNotifications'

function conferenceUpdatesStorageKey(conferenceId: number | string): string {
  return `ffc-conference-updates:${conferenceId}`
}

function readConferenceUpdates(conferenceId: number | string): boolean {
  try {
    const raw = window.localStorage.getItem(conferenceUpdatesStorageKey(conferenceId))
    if (raw == null) return true
    return raw !== '0'
  } catch {
    return true
  }
}

type SavedAgendaContextValue = {
  items: SavedAgendaItem[]
  now: Date
  focusedItemId: string | null
  currentSaved: SavedAgendaItem | null
  upcomingSaved: SavedAgendaItem | null
  upcomingMinutes: number | null
  isReady: boolean
  notificationState: NotificationPermissionState
  notificationsAvailable: boolean
  iPhoneInstallHint: boolean
  alertsEnabled: boolean
  leadMinutes: number
  conferenceUpdates: boolean
  isSaved: (id: string) => boolean
  toggleSaved: (entry: SavedAgendaItem) => void
  removeItem: (id: string) => void
  focusItem: (id: string) => void
  clearFocus: () => void
  enableNotifications: () => Promise<NotificationPermissionState>
  setConferenceUpdates: (enabled: boolean) => Promise<void>
}

const SavedAgendaContext = createContext<SavedAgendaContextValue | null>(null)

export function useSavedAgenda() {
  const value = useContext(SavedAgendaContext)
  if (!value) {
    throw new Error('useSavedAgenda must be used within SavedAgendaProvider')
  }
  return value
}

export function SavedAgendaProvider({
  conferenceId,
  canonicalPath = '/',
  alertsEnabled = true,
  leadMinutes = 5,
  notificationTitle = 'FFC Conference',
  children,
}: {
  conferenceId: number | string
  canonicalPath?: string
  alertsEnabled?: boolean
  leadMinutes?: number
  notificationTitle?: string
  children: React.ReactNode
}) {
  const storageKey = savedAgendaStorageKey(conferenceId)
  const [items, setItems] = useState<SavedAgendaItem[]>([])
  const [isReady, setIsReady] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)
  const [notificationState, setNotificationState] =
    useState<NotificationPermissionState>('unsupported')
  const [notificationsAvailable, setNotificationsAvailable] = useState(false)
  const [iPhoneInstallHint, setIPhoneInstallHint] = useState(false)
  const [conferenceUpdates, setConferenceUpdatesState] = useState(true)

  useEffect(() => {
    setItems(parseSavedAgendaStore(window.localStorage.getItem(storageKey)))
    setConferenceUpdatesState(readConferenceUpdates(conferenceId))
    setIsReady(true)
    setNotificationState(notificationPermission())
    setNotificationsAvailable(alertsEnabled && notificationsSupported())
    setIPhoneInstallHint(iPhoneNeedsHomeScreen())
    const params = new URLSearchParams(window.location.search)
    const agenda = params.get('agenda')
    if (agenda) setFocusedItemId(agenda)
  }, [alertsEnabled, conferenceId, storageKey])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'ffc-focus-agenda' || !event.data.id) return
      setFocusedItemId(String(event.data.id))
    }
    navigator.serviceWorker?.addEventListener('message', onMessage)
    return () => navigator.serviceWorker?.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (!isReady) return
    window.localStorage.setItem(storageKey, serializeSavedAgendaStore(items))
  }, [isReady, items, storageKey])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return
      setItems(parseSavedAgendaStore(event.newValue))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  useEffect(() => {
    const tick = () => setNow(new Date())
    const intervalId = window.setInterval(tick, 10_000)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const savedIds = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  const toggleSaved = useCallback((entry: SavedAgendaItem) => {
    setItems((prev) => {
      const already = prev.some((saved) => saved.id === entry.id)
      if (already) return prev.filter((saved) => saved.id !== entry.id)
      return sortSavedAgendaItems([...prev, entry])
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const focusItem = useCallback((id: string) => {
    setFocusedItemId(id)
  }, [])

  const clearFocus = useCallback(() => {
    setFocusedItemId(null)
  }, [])

  const syncPush = useCallback(
    async (nextItems: SavedAgendaItem[], updatesEnabled = conferenceUpdates) => {
      if (notificationPermission() !== 'granted') return
      const registration = await registerProgrammeServiceWorker()
      if (!registration) return
      const subscription = await subscribeProgrammePush(registration)
      if (!subscription) return
      await syncProgrammePushSubscription({
        subscription,
        conferenceId,
        canonicalPath,
        items: nextItems,
        conferenceUpdates: updatesEnabled,
      })
    },
    [canonicalPath, conferenceId, conferenceUpdates],
  )

  const enableNotifications = useCallback(async () => {
    if (!alertsEnabled) return notificationPermission()
    await registerProgrammeServiceWorker()
    const permission = await requestProgrammeNotificationPermission()
    setNotificationState(permission)
    if (permission === 'granted') {
      const updates = true
      setConferenceUpdatesState(updates)
      window.localStorage.setItem(conferenceUpdatesStorageKey(conferenceId), '1')
      await syncPush(items, updates)
      await showProgrammeNotification({
        title: notificationTitle,
        body: `Alerts on: session reminders and conference updates.`,
        tag: 'ffc-alerts-enabled',
        url: `${window.location.origin}${canonicalPath}`,
        agendaId: '',
        kind: 'soon',
      })
    }
    return permission
  }, [
    alertsEnabled,
    canonicalPath,
    conferenceId,
    items,
    notificationTitle,
    syncPush,
  ])

  const setConferenceUpdates = useCallback(
    async (enabled: boolean) => {
      setConferenceUpdatesState(enabled)
      window.localStorage.setItem(conferenceUpdatesStorageKey(conferenceId), enabled ? '1' : '0')
      if (notificationPermission() === 'granted') {
        await syncPush(items, enabled)
      }
    },
    [conferenceId, items, syncPush],
  )

  useEffect(() => {
    if (!alertsEnabled || !isReady || notificationState !== 'granted') return
    void syncPush(items, conferenceUpdates)
  }, [alertsEnabled, conferenceUpdates, isReady, items, notificationState, syncPush])

  useEffect(() => {
    if (!alertsEnabled || !isReady || notificationState !== 'granted') return
    return scheduleProgrammeNotificationTimers(items, canonicalPath, leadMinutes, notificationTitle)
  }, [alertsEnabled, canonicalPath, isReady, items, leadMinutes, notificationState, notificationTitle])

  useEffect(() => {
    if (!alertsEnabled || !isReady) return
    void fireDueProgrammeNotifications({
      items,
      now,
      canonicalPath,
      leadMinutes,
      notificationTitle,
    })
  }, [alertsEnabled, canonicalPath, isReady, items, leadMinutes, now, notificationTitle])

  const currentSaved = useMemo(
    () => items.find((item) => isHappeningNow(item, now)) ?? null,
    [items, now],
  )

  const upcomingSaved = useMemo(() => {
    let next: SavedAgendaItem | null = null
    let nextMinutes = Number.POSITIVE_INFINITY
    for (const item of items) {
      const minutes = minutesUntilStart(item, now)
      if (minutes === null || minutes <= 0) continue
      if (minutes < nextMinutes) {
        nextMinutes = minutes
        next = item
      }
    }
    return next && isStartingSoon(next, now, leadMinutes) ? next : null
  }, [items, leadMinutes, now])

  const upcomingMinutes = upcomingSaved ? minutesUntilStart(upcomingSaved, now) : null

  const value = useMemo<SavedAgendaContextValue>(
    () => ({
      items,
      now,
      focusedItemId,
      currentSaved,
      upcomingSaved,
      upcomingMinutes,
      isReady,
      notificationState,
      notificationsAvailable,
      iPhoneInstallHint,
      alertsEnabled,
      leadMinutes,
      conferenceUpdates,
      isSaved,
      toggleSaved,
      removeItem,
      focusItem,
      clearFocus,
      enableNotifications,
      setConferenceUpdates,
    }),
    [
      items,
      now,
      focusedItemId,
      currentSaved,
      upcomingSaved,
      upcomingMinutes,
      isReady,
      notificationState,
      notificationsAvailable,
      iPhoneInstallHint,
      alertsEnabled,
      leadMinutes,
      conferenceUpdates,
      isSaved,
      toggleSaved,
      removeItem,
      focusItem,
      clearFocus,
      enableNotifications,
      setConferenceUpdates,
    ],
  )

  return <SavedAgendaContext.Provider value={value}>{children}</SavedAgendaContext.Provider>
}
