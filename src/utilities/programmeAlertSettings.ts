import type { Payload } from 'payload'
import { SAVED_AGENDA_LEAD_MINUTES } from '@/utilities/savedAgenda'

export type ProgrammeAlertSettings = {
  enabled: boolean
  leadMinutes: number
  notificationTitle: string
  contactEmail: string | null
}

export const DEFAULT_PROGRAMME_ALERT_SETTINGS: ProgrammeAlertSettings = {
  enabled: true,
  leadMinutes: SAVED_AGENDA_LEAD_MINUTES,
  notificationTitle: 'FFC Conference',
  contactEmail: null,
}

export function normalizeLeadMinutes(value: unknown): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return SAVED_AGENDA_LEAD_MINUTES
  return Math.min(30, Math.max(1, Math.round(parsed)))
}

export function vapidMailtoFromEmail(email?: string | null): string | null {
  const raw = email?.trim()
  if (!raw) return null
  return raw.startsWith('mailto:') ? raw : `mailto:${raw}`
}

export function settingsFromGlobal(doc: {
  enabled?: boolean | null
  leadMinutes?: number | null
  notificationTitle?: string | null
  contactEmail?: string | null
} | null): ProgrammeAlertSettings {
  const title = doc?.notificationTitle?.trim()
  const email = doc?.contactEmail?.trim()
  return {
    enabled: doc?.enabled !== false,
    leadMinutes: normalizeLeadMinutes(doc?.leadMinutes),
    notificationTitle: title || DEFAULT_PROGRAMME_ALERT_SETTINGS.notificationTitle,
    contactEmail: email || null,
  }
}

export async function loadProgrammeAlertSettings(payload: Payload): Promise<ProgrammeAlertSettings> {
  try {
    const doc = await payload.findGlobal({
      slug: 'programme-alerts',
      depth: 0,
      overrideAccess: true,
    })
    return settingsFromGlobal(doc)
  } catch {
    return DEFAULT_PROGRAMME_ALERT_SETTINGS
  }
}
