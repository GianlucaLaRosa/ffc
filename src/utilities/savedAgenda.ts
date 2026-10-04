import type { AgendaItem, ConferenceDay } from '@/payload-types'
import { joinDocs } from '@/utilities/conferenceUi'

export const SAVED_AGENDA_LEAD_MINUTES = 5
export const SAVED_AGENDA_STORE_VERSION = 1

export type SavedAgendaItem = {
  id: string
  title: string
  startTime: string | null
  endTime: string | null
}

type SavedAgendaStore = {
  v: number
  items: SavedAgendaItem[]
}

export function savedAgendaStorageKey(conferenceId: string | number): string {
  return `ffc-my-programme:${conferenceId}`
}

export function collectLeafAgendaItems(item: AgendaItem): AgendaItem[] {
  const children = joinDocs<AgendaItem>(item.children)
  if (children.length === 0) return [item]
  return children.flatMap(collectLeafAgendaItems)
}

export function toSavedAgendaItem(item: AgendaItem): SavedAgendaItem {
  const title = typeof item.title === 'string' ? item.title.trim() : ''
  return {
    id: String(item.id),
    title: title || 'Untitled session',
    startTime: item.startTime ?? null,
    endTime: item.endTime ?? null,
  }
}

export function sortSavedAgendaItems(items: SavedAgendaItem[]): SavedAgendaItem[] {
  return [...items].sort((a, b) => {
    const aStart = parseInstant(a.startTime)
    const bStart = parseInstant(b.startTime)
    if (aStart === null && bStart === null) return a.title.localeCompare(b.title)
    if (aStart === null) return 1
    if (bStart === null) return -1
    if (aStart !== bStart) return aStart - bStart
    const aEnd = parseInstant(a.endTime) ?? aStart
    const bEnd = parseInstant(b.endTime) ?? bStart
    return aEnd - bEnd
  })
}

export function parseSavedAgendaStore(raw: string | null): SavedAgendaItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as SavedAgendaStore | SavedAgendaItem[]
    const items = Array.isArray(parsed) ? parsed : parsed?.items
    if (!Array.isArray(items)) return []
    return sortSavedAgendaItems(
      items.flatMap((item) => {
        if (!item || typeof item !== 'object') return []
        const id = typeof item.id === 'string' ? item.id : String(item.id ?? '')
        if (!id) return []
        return [
          {
            id,
            title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : 'Untitled session',
            startTime: typeof item.startTime === 'string' ? item.startTime : null,
            endTime: typeof item.endTime === 'string' ? item.endTime : null,
          },
        ]
      }),
    )
  } catch {
    return []
  }
}

export function serializeSavedAgendaStore(items: SavedAgendaItem[]): string {
  const store: SavedAgendaStore = {
    v: SAVED_AGENDA_STORE_VERSION,
    items: sortSavedAgendaItems(items),
  }
  return JSON.stringify(store)
}

export function sessionInterval(
  startTime?: string | null,
  endTime?: string | null,
  durationMinutes?: number | null,
): { start: number; end: number } | null {
  const start = parseInstant(startTime)
  if (start === null) return null

  let end = parseInstant(endTime)
  if (end === null) {
    const minutes =
      typeof durationMinutes === 'number' && durationMinutes > 0 ? durationMinutes : 15
    end = start + minutes * 60_000
  }
  if (end <= start) end = start + 60_000
  return { start, end }
}

export function isHappeningNow(
  item: { startTime?: string | null; endTime?: string | null; durationMinutes?: number | null },
  now: Date,
): boolean {
  const interval = sessionInterval(item.startTime, item.endTime, item.durationMinutes)
  if (!interval) return false
  const t = now.getTime()
  return t >= interval.start && t < interval.end
}

export function minutesUntilStart(
  item: { startTime?: string | null },
  now: Date,
): number | null {
  const start = parseInstant(item.startTime)
  if (start === null) return null
  return (start - now.getTime()) / 60_000
}

export function isStartingSoon(
  item: { startTime?: string | null },
  now: Date,
  leadMinutes = SAVED_AGENDA_LEAD_MINUTES,
): boolean {
  const minutes = minutesUntilStart(item, now)
  if (minutes === null) return false
  return minutes > 0 && minutes <= leadMinutes
}

export type ProgrammeAlertKind = 'soon' | 'live'

export type DueProgrammeAlert = {
  item: SavedAgendaItem
  kind: ProgrammeAlertKind
  minutes: number | null
}

export function dueProgrammeAlerts(
  items: SavedAgendaItem[],
  now: Date,
  leadMinutes = SAVED_AGENDA_LEAD_MINUTES,
): DueProgrammeAlert[] {
  return items.flatMap((item) => {
    if (isHappeningNow(item, now)) {
      return [{ item, kind: 'live' as const, minutes: 0 }]
    }
    if (isStartingSoon(item, now, leadMinutes)) {
      return [{ item, kind: 'soon' as const, minutes: minutesUntilStart(item, now) }]
    }
    return []
  })
}

export function programmeAlertTimestamps(
  item: SavedAgendaItem,
  leadMinutes = SAVED_AGENDA_LEAD_MINUTES,
): { soon: number | null; live: number | null } {
  const live = parseInstant(item.startTime)
  if (live === null) return { soon: null, live: null }
  return { soon: live - leadMinutes * 60_000, live }
}

export function findAgendaItemLocation(
  days: ConferenceDay[],
  itemId: string,
): { dayId: string; expandItemIds: string[] } | null {
  for (const day of days) {
    const roots = joinDocs<AgendaItem>(day.agendaItems)
    for (const root of roots) {
      const path = findItemPath(root, itemId, [])
      if (path) return { dayId: String(day.id), expandItemIds: path }
    }
  }
  return null
}

function findItemPath(item: AgendaItem, itemId: string, parents: string[]): string[] | null {
  if (String(item.id) === itemId) return parents
  const children = joinDocs<AgendaItem>(item.children)
  for (const child of children) {
    const found = findItemPath(child, itemId, [...parents, String(item.id)])
    if (found) return found
  }
  return null
}

function parseInstant(value?: string | null): number | null {
  if (!value) return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}
