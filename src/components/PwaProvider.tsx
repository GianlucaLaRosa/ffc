'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { registerProgrammeServiceWorker } from '@/utilities/programmeNotifications'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type PwaContextValue = {
  canPrompt: boolean
  installed: boolean
  isIos: boolean
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>
}

const PwaContext = createContext<PwaContextValue | null>(null)

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  )
}

function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  )
}

function takeDeferredPrompt(): BeforeInstallPromptEvent | null {
  const promptEvent = window.__pwaDeferredPrompt
  window.__pwaDeferredPrompt = null
  return promptEvent ?? null
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    void registerProgrammeServiceWorker()
    setInstalled(isStandaloneDisplay())
    setIsIos(isIosDevice())
    setDeferredPrompt(takeDeferredPrompt())

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      window.__pwaDeferredPrompt = null
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setDeferredPrompt(null)
      setInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return 'unavailable'
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (outcome === 'accepted') setInstalled(true)
    return outcome
  }, [deferredPrompt])

  const value = useMemo(
    () => ({
      canPrompt: Boolean(deferredPrompt) && !installed,
      installed,
      isIos: isIos && !installed,
      promptInstall,
    }),
    [deferredPrompt, installed, isIos, promptInstall],
  )

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>
}

export function usePwaInstall() {
  const value = useContext(PwaContext)
  if (!value) {
    throw new Error('usePwaInstall must be used within PwaProvider')
  }
  return value
}

declare global {
  interface Window {
    __pwaDeferredPrompt?: BeforeInstallPromptEvent | null
  }
}
