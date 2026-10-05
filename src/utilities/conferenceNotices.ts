export type PublicConferenceNotice = {
  id: number | string
  title: string
  body: string
  severity: 'info' | 'change' | 'urgent'
  linkPath?: string | null
  relatedAgendaItemId?: string | null
  startsAt?: string | null
  expiresAt?: string | null
}

export function isConferenceNoticeVisible(
  notice: Pick<PublicConferenceNotice, 'startsAt' | 'expiresAt'>,
  now: Date = new Date(),
): boolean {
  if (notice.startsAt) {
    const start = new Date(notice.startsAt)
    if (!Number.isNaN(start.getTime()) && start.getTime() > now.getTime()) return false
  }
  if (notice.expiresAt) {
    const end = new Date(notice.expiresAt)
    if (!Number.isNaN(end.getTime()) && end.getTime() <= now.getTime()) return false
  }
  return true
}

export function noticeHref(input: {
  canonicalPath: string
  linkPath?: string | null
  relatedAgendaItemId?: string | null
}): string | null {
  const base =
    input.canonicalPath.startsWith('/') ? input.canonicalPath : `/${input.canonicalPath}`
  const link = input.linkPath?.trim()
  if (link) {
    if (link.startsWith('#')) return `${base}${link}`
    if (link.startsWith('?')) return `${base}${link}`
    if (link.startsWith('/')) return link
  }
  if (input.relatedAgendaItemId) {
    return `${base}?agenda=${encodeURIComponent(input.relatedAgendaItemId)}`
  }
  return null
}
