import type { Endpoint } from 'payload'
import webpush from 'web-push'

import {
  loadProgrammeAlertSettings,
  vapidMailtoFromEmail,
} from '@/utilities/programmeAlertSettings'
import { getServerSideURL } from '@/utilities/getURL'
import { parseSavedAgendaStore, type SavedAgendaItem } from '@/utilities/savedAgenda'

function vapidConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
}

function configureVapid(contactEmail?: string | null): boolean {
  const mailto = vapidMailtoFromEmail(contactEmail)
  if (!mailto) return false
  webpush.setVapidDetails(
    mailto,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string,
  )
  return true
}

function relationId(value: unknown): number | string | null {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

function asItems(value: unknown): SavedAgendaItem[] {
  return parseSavedAgendaStore(
    JSON.stringify({ v: 1, items: Array.isArray(value) ? value : [] }),
  )
}

function resolveNoticeUrl(input: {
  origin: string
  canonicalPath: string
  linkPath?: string | null
  agendaId?: string | null
}): string {
  const basePath =
    typeof input.canonicalPath === 'string' && input.canonicalPath.startsWith('/')
      ? input.canonicalPath
      : '/'

  const link = input.linkPath?.trim()
  if (link) {
    if (link.startsWith('#')) return `${input.origin}${basePath}${link}`
    if (link.startsWith('?')) return `${input.origin}${basePath}${link}`
    if (link.startsWith('/')) return `${input.origin}${link}`
  }

  if (input.agendaId) {
    return `${input.origin}${basePath}?agenda=${encodeURIComponent(input.agendaId)}`
  }

  return `${input.origin}${basePath}`
}

export const sendConferenceNoticeEndpoint: Endpoint = {
  path: '/:id/send',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const idParam = req.routeParams?.id
    const id = typeof idParam === 'string' || typeof idParam === 'number' ? idParam : null
    if (id == null) {
      return Response.json({ message: 'Notice id is required.' }, { status: 400 })
    }

    const notice = await req.payload.findByID({
      collection: 'conference-notices',
      id,
      depth: 0,
      overrideAccess: false,
      req,
      user: req.user,
    })

    if (notice.sentAt) {
      return Response.json(
        { message: 'Push già inviata per questo avviso. Create un nuovo avviso per inviarne un’altra.' },
        { status: 400 },
      )
    }

    if (!notice.sendPush) {
      return Response.json(
        {
          message:
            'Questo avviso non è marcato per la push. Accendete «Include push when sending», salvate, poi riprovate.',
        },
        { status: 400 },
      )
    }

    const conferenceId = relationId(notice.conference)
    if (conferenceId == null) {
      return Response.json({ message: 'L’avviso deve appartenere a una conferenza.' }, { status: 400 })
    }

    const conference = await req.payload.findByID({
      collection: 'conferences',
      id: conferenceId,
      depth: 0,
      draft: false,
      overrideAccess: false,
      req,
      user: req.user,
      select: {
        _status: true,
        slug: true,
        title: true,
      },
    })

    if (conference._status !== 'published') {
      return Response.json(
        { message: 'Pubblicate la conferenza prima di inviare una push.' },
        { status: 400 },
      )
    }

    const active = await req.payload.findGlobal({
      slug: 'active-conference',
      depth: 0,
      overrideAccess: false,
      req,
      user: req.user,
      select: { conference: true },
    })
    const activeId = relationId(active.conference)
    if (activeId == null || String(activeId) !== String(conferenceId)) {
      return Response.json(
        {
          message:
            'Le push si inviano solo per la Conferenza attiva (home del sito). Il banner sul sito funziona su qualsiasi edizione pubblicata.',
        },
        { status: 400 },
      )
    }

    if (!vapidConfigured()) {
      return Response.json(
        { message: 'Le chiavi push non sono configurate sul server (VAPID).' },
        { status: 400 },
      )
    }

    const settings = await loadProgrammeAlertSettings(req.payload)
    if (!settings.enabled) {
      return Response.json(
        { message: 'Gli avvisi sessione/push sono spenti in Avvisi programma.' },
        { status: 400 },
      )
    }
    if (!configureVapid(settings.contactEmail)) {
      return Response.json(
        { message: 'Impostate Push contact email in Globals → Avvisi programma.' },
        { status: 400 },
      )
    }

    const agendaId = relationId(notice.relatedAgendaItem)
    const agendaKey = agendaId != null ? String(agendaId) : null
    const origin = getServerSideURL()
    const title = notice.title?.trim() || settings.notificationTitle
    const body = notice.body?.trim() || ''
    const tag = `ffc-notice-${notice.id}`

    let sent = 0
    let removed = 0
    let skipped = 0
    let page = 1

    while (true) {
      const result = await req.payload.find({
        collection: 'programme-push-subscriptions',
        where: { conference: { equals: Number(conferenceId) } },
        limit: 100,
        page,
        overrideAccess: true,
        req,
      })

      for (const doc of result.docs) {
        const items = asItems(doc.items)
        const wantsUpdates = doc.conferenceUpdates !== false
        const savedRelated = agendaKey
          ? items.some((item) => String(item.id) === agendaKey)
          : false

        const shouldSend = agendaKey ? wantsUpdates || savedRelated : wantsUpdates
        if (!shouldSend) {
          skipped += 1
          continue
        }

        const path =
          typeof doc.canonicalPath === 'string' && doc.canonicalPath ? doc.canonicalPath : '/'
        const url = resolveNoticeUrl({
          origin,
          canonicalPath: path,
          linkPath: notice.linkPath,
          agendaId: agendaKey,
        })

        try {
          await webpush.sendNotification(
            {
              endpoint: doc.endpoint,
              keys: { p256dh: doc.p256dh, auth: doc.auth },
            },
            JSON.stringify({
              title,
              body,
              tag,
              url,
              agendaId: agendaKey || '',
              kind: 'notice',
              noticeId: String(notice.id),
              severity: notice.severity,
            }),
          )
          sent += 1
        } catch (error) {
          const status =
            typeof error === 'object' && error && 'statusCode' in error
              ? Number((error as { statusCode?: unknown }).statusCode)
              : 0
          if (status === 404 || status === 410) {
            await req.payload.delete({
              collection: 'programme-push-subscriptions',
              id: doc.id,
              overrideAccess: true,
              req,
            })
            removed += 1
          } else {
            req.payload.logger.error({
              err: error,
              msg: `Failed to send conference notice push ${notice.id} to subscription ${doc.id}`,
            })
          }
        }
      }

      if (!result.hasNextPage) break
      page += 1
    }

    const updated = await req.payload.update({
      collection: 'conference-notices',
      id,
      data: {
        sentAt: new Date().toISOString(),
        pushSent: sent,
        pushRemoved: removed,
      },
      depth: 0,
      overrideAccess: false,
      req,
      user: req.user,
    })

    return Response.json({
      ok: true,
      sent,
      removed,
      skipped,
      doc: {
        id: updated.id,
        sentAt: updated.sentAt,
        pushSent: updated.pushSent,
        pushRemoved: updated.pushRemoved,
      },
    })
  },
}
