export const COOKIE_CONSENT_KEY = 'ffc-cookie-consent'
export const COOKIE_CONSENT_VERSION = '1'

export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { v?: string; at?: string }
    return parsed.v === COOKIE_CONSENT_VERSION
  } catch {
    return false
  }
}

export function acceptCookieConsent(): void {
  window.localStorage.setItem(
    COOKIE_CONSENT_KEY,
    JSON.stringify({ v: COOKIE_CONSENT_VERSION, at: new Date().toISOString() }),
  )
}
