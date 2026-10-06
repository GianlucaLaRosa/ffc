import type { Abstract, AgendaItem, ConferenceDay } from '@/payload-types'
import { joinDocs } from '@/utilities/conferenceUi'

export const SAVED_AGENDA_LEAD_MINUTES = 5
export const SAVED_AGENDA_STORE_VERSION = 2
/** Saved abstracts bookmarked from the appendix (no programme session). */
export const APPENDIX_AGENDA_ID = 'appendix'

export type SavedProgrammeKind = 'session' | 'abstract'

export type SavedAgendaItem = {
  id: string
  kind: SavedProgrammeKind
  agendaItemId: string
  abstractId?: string
  abstractCode?: string | null
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

export function savedSessionKey(id: string | number): string {
  return `session:${id}`
}

export function savedAbstractKey(id: string | number): string {
  return `abstract:${id}`
}

export function agendaItemChildren(item: AgendaItem): AgendaItem[] {
  return joinDocs<AgendaItem>(item.children)
}

export function itemAbstracts(item: AgendaItem): Abstract[] {
  return joinDocs<Abstract>(item.childAbstracts)
}

/** A session is saveable only when it has no nested talks and no linked abstracts. */
export function isSaveableSession(item: AgendaItem): boolean {
  return agendaItemChildren(item).length === 0 && itemAbstracts(item).length === 0
}

function sessionTitle(item: AgendaItem): string {
  const title = typeof item.title === 'string' ? item.title.trim() : ''
  return title || 'Untitled session'
}

export function toSavedSession(item: AgendaItem): SavedAgendaItem {
  return {
    id: savedSessionKey(item.id),
    kind: 'session',
    agendaItemId: String(item.id),
    title: sessionTitle(item),
    startTime: item.startTime ?? null,
    endTime: item.endTime ?? null,
  }
}

function abstractSavedTitle(abstract: Abstract): string {
  const code = typeof abstract.code === 'string' ? abstract.code.trim() : ''
  return (
    (typeof abstract.plainTitle === 'string' && abstract.plainTitle.trim()) ||
    code ||
    'Untitled abstract'
  )
}

export function toSavedAbstract(abstract: Abstract, session: AgendaItem): SavedAgendaItem {
  const code = typeof abstract.code === 'string' ? abstract.code.trim() : ''
  return {
    id: savedAbstractKey(abstract.id),
    kind: 'abstract',
    agendaItemId: String(session.id),
    abstractId: String(abstract.id),
    abstractCode: code || null,
    title: abstractSavedTitle(abstract),
    startTime: session.startTime ?? null,
    endTime: session.endTime ?? null,
  }
}

export function toSavedAppendixAbstract(abstract: Abstract): SavedAgendaItem {
  const code = typeof abstract.code === 'string' ? abstract.code.trim() : ''
  return {
    id: savedAbstractKey(abstract.id),
    kind: 'abstract',
    agendaItemId: APPENDIX_AGENDA_ID,
    abstractId: String(abstract.id),
    abstractCode: code || null,
    title: abstractSavedTitle(abstract),
    startTime: null,
    endTime: null,
  }
}

export function programmeAlertHref(
  origin: string,
  canonicalPath: string,
  item: SavedAgendaItem,
): string {
  const path = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`
  if (item.kind === 'abstract') {
    const token = item.abstractCode || item.abstractId || item.id
    return `${origin}${path}?abstract=${encodeURIComponent(token)}`
  }
  return `${origin}${path}?agenda=${encodeURIComponent(item.agendaItemId)}`
}

export function savedMatchesRelatedAgenda(
  item: SavedAgendaItem,
  relatedIds: Set<string>,
): boolean {
  if (relatedIds.has(item.agendaItemId)) return true
  const raw = item.id.includes(':') ? item.id.slice(item.id.indexOf(':') + 1) : item.id
  return relatedIds.has(raw)
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

export function parseSavedAgendaItems(value: unknown): SavedAgendaItem[] {
  if (!Array.isArray(value)) return []
  return sortSavedAgendaItems(value.flatMap((item) => normalizeSavedItem(item)))
}

export function parseSavedAgendaStore(raw: string | null): SavedAgendaItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as SavedAgendaStore | SavedAgendaItem[]
    const items = Array.isArray(parsed) ? parsed : parsed?.items
    return parseSavedAgendaItems(items)
  } catch {
    return []
  }
}

function normalizeSavedItem(item: unknown): SavedAgendaItem[] {
  if (!item || typeof item !== 'object') return []
  const raw = item as Record<string, unknown>
  const kind: SavedProgrammeKind = raw.kind === 'abstract' ? 'abstract' : 'session'
  const title =
    typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : kind === 'abstract' ? 'Untitled abstract' : 'Untitled session'
  const startTime = typeof raw.startTime === 'string' ? raw.startTime : null
  const endTime = typeof raw.endTime === 'string' ? raw.endTime : null

  if (kind === 'abstract') {
    const abstractId = firstId(raw.abstractId, stripPrefix(raw.id, 'abstract:'))
    const agendaItemId = firstId(raw.agendaItemId)
    if (!abstractId || !agendaItemId) return []
    const code = typeof raw.abstractCode === 'string' ? raw.abstractCode.trim() : ''
    return [
      {
        id: savedAbstractKey(abstractId),
        kind: 'abstract',
        agendaItemId,
        abstractId,
        abstractCode: code || null,
        title,
        startTime,
        endTime,
      },
    ]
  }

  const agendaItemId = firstId(raw.agendaItemId, stripPrefix(raw.id, 'session:'), raw.id)
  if (!agendaItemId) return []
  return [
    {
      id: savedSessionKey(agendaItemId),
      kind: 'session',
      agendaItemId,
      title,
      startTime,
      endTime,
    },
  ]
}

function firstId(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

function stripPrefix(value: unknown, prefix: string): string | null {
  if (typeof value !== 'string') return null
  return value.startsWith(prefix) ? value.slice(prefix.length) : value
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

export type ProgrammeFocusTarget = {
  dayId: string
  expandItemIds: string[]
  scrollId: string
  agendaItemId: string
  abstract?: Abstract
}

export function findProgrammeFocus(
  days: ConferenceDay[],
  token: string,
): ProgrammeFocusTarget | null {
  const focus = parseFocusToken(token)
  if (!focus) return null

  for (const day of days) {
    const roots = joinDocs<AgendaItem>(day.agendaItems)
    for (const root of roots) {
      const found = findFocusInItem(root, focus, [], String(day.id))
      if (found) return found
    }
  }
  return null
}

export function findAgendaItemLocation(
  days: ConferenceDay[],
  itemId: string,
): { dayId: string; expandItemIds: string[] } | null {
  const found = findProgrammeFocus(days, itemId)
  if (!found) return null
  return { dayId: found.dayId, expandItemIds: found.expandItemIds }
}

function parseFocusToken(token: string): { kind: SavedProgrammeKind; id: string } | null {
  const clean = token.trim()
  if (!clean) return null
  if (clean.startsWith('abstract:')) {
    const id = clean.slice('abstract:'.length)
    return id ? { kind: 'abstract', id } : null
  }
  if (clean.startsWith('session:')) {
    const id = clean.slice('session:'.length)
    return id ? { kind: 'session', id } : null
  }
  return { kind: 'session', id: clean }
}

function findFocusInItem(
  item: AgendaItem,
  focus: { kind: SavedProgrammeKind; id: string },
  parents: string[],
  dayId: string,
): ProgrammeFocusTarget | null {
  const sessionId = String(item.id)
  if (focus.kind === 'session' && sessionId === focus.id) {
    return {
      dayId,
      expandItemIds: parents,
      scrollId: `agenda-item-${sessionId}`,
      agendaItemId: sessionId,
    }
  }

  if (focus.kind === 'abstract') {
    const match = itemAbstracts(item).find((abs) => String(abs.id) === focus.id)
    if (match) {
      return {
        dayId,
        expandItemIds: parents,
        scrollId: `agenda-abstract-${match.id}`,
        agendaItemId: sessionId,
        abstract: match,
      }
    }
  }

  for (const child of agendaItemChildren(item)) {
    const found = findFocusInItem(child, focus, [...parents, sessionId], dayId)
    if (found) return found
  }
  return null
}

function parseInstant(value?: string | null): number | null {
  if (!value) return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}
