export const OVERLAY_QUERY_KEYS = {
  abstract: 'abstract',
  photo: 'photo',
} as const

export type OverlayQuery = {
  abstract: string | null
  /** 1-based gallery index when a photo overlay is open */
  photo: number | null
}

type OverlayHistoryState = {
  overlay: OverlayQuery
  pushed: boolean
}

export function abstractOverlayId(abstract: {
  code?: string | null
  id: number | string
}): string {
  const code = typeof abstract.code === 'string' ? abstract.code.trim() : ''
  return code || String(abstract.id)
}

export function readOverlayQuery(search = window.location.search): OverlayQuery {
  const params = new URLSearchParams(search)
  const abstract = params.get(OVERLAY_QUERY_KEYS.abstract)?.trim() || null
  const photoRaw = params.get(OVERLAY_QUERY_KEYS.photo)
  const parsed = photoRaw ? Number.parseInt(photoRaw, 10) : NaN
  const photo = Number.isInteger(parsed) && parsed > 0 ? parsed : null
  return { abstract, photo }
}

export function overlayHref(query: OverlayQuery, href = window.location.href): string {
  const url = new URL(href)
  if (query.abstract) {
    url.searchParams.set(OVERLAY_QUERY_KEYS.abstract, query.abstract)
  } else {
    url.searchParams.delete(OVERLAY_QUERY_KEYS.abstract)
  }

  if (query.abstract && query.photo != null && query.photo > 0) {
    url.searchParams.set(OVERLAY_QUERY_KEYS.photo, String(query.photo))
  } else {
    url.searchParams.delete(OVERLAY_QUERY_KEYS.photo)
  }

  return `${url.pathname}${url.search}${url.hash}`
}

export function isOverlayHistoryState(state: unknown): state is OverlayHistoryState {
  return Boolean(state && typeof state === 'object' && 'overlay' in state)
}

export function overlayWasPushed(): boolean {
  const state = window.history.state
  return isOverlayHistoryState(state) && state.pushed
}

export function pushOverlay(query: OverlayQuery) {
  window.history.pushState(
    { overlay: query, pushed: true } satisfies OverlayHistoryState,
    '',
    overlayHref(query),
  )
}

export function replaceOverlay(query: OverlayQuery) {
  const current = window.history.state
  const pushed = isOverlayHistoryState(current) ? current.pushed : false
  window.history.replaceState(
    { overlay: query, pushed } satisfies OverlayHistoryState,
    '',
    overlayHref(query),
  )
}

export function clampPhotoIndex(photo1Based: number | null, slideCount: number): number | null {
  if (slideCount <= 0 || photo1Based == null) return null
  return Math.min(Math.max(photo1Based, 1), slideCount)
}
