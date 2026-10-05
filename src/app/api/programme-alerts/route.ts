import { getPayload } from 'payload'
import configPromise from '@payload-config'
import webpush from 'web-push'
import {
  dueProgrammeAlerts,
  parseSavedAgendaItems,
  programmeAlertHref,
  type SavedAgendaItem,
} from '@/utilities/savedAgenda'
import { getServerSideURL } from '@/utilities/getURL'
import {
  loadProgrammeAlertSettings,
  vapidMailtoFromEmail,
} from '@/utilities/programmeAlertSettings'

type PushKeys = {
  p256dh?: string
  auth?: string
}

type IncomingSubscription = {
  endpoint?: string
  keys?: PushKeys
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

function asItems(value: unknown): SavedAgendaItem[] {
  return parseSavedAgendaItems(value)
}

function asIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(String).filter(Boolean)
}

export async function POST(request: Request): Promise<Response> {
  if (!vapidConfigured()) {
    return Response.json({ ok: false, reason: 'vapid-unconfigured' }, { status: 204 })
  }

  let body: {
    subscription?: IncomingSubscription
    conferenceId?: number | string
    canonicalPath?: string
    items?: SavedAgendaItem[]
    conferenceUpdates?: boolean
  }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const endpoint = body.subscription?.endpoint
  const p256dh = body.subscription?.keys?.p256dh
  const auth = body.subscription?.keys?.auth
  const conferenceId = Number(body.conferenceId)
  if (!endpoint || !p256dh || !auth || !Number.isFinite(conferenceId)) {
    return Response.json({ error: 'Invalid subscription' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const settings = await loadProgrammeAlertSettings(payload)
  if (!settings.enabled) {
    return Response.json({ ok: false, reason: 'alerts-disabled' }, { status: 403 })
  }

  const existing = await payload.find({
    collection: 'programme-push-subscriptions',
    where: { endpoint: { equals: endpoint } },
    limit: 1,
    overrideAccess: true,
  })

  const data = {
    endpoint,
    p256dh,
    auth,
    conference: conferenceId,
    canonicalPath: body.canonicalPath || '/',
    items: asItems(body.items),
    conferenceUpdates: body.conferenceUpdates !== false,
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'programme-push-subscriptions',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'programme-push-subscriptions',
      data: {
        ...data,
        notifiedSoon: [],
        notifiedLive: [],
      },
      overrideAccess: true,
    })
  }

  return Response.json({ ok: true })
}

export async function DELETE(request: Request): Promise<Response> {
  let body: { endpoint?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.endpoint) return Response.json({ error: 'Missing endpoint' }, { status: 400 })

  const payload = await getPayload({ config: configPromise })
  const existing = await payload.find({
    collection: 'programme-push-subscriptions',
    where: { endpoint: { equals: body.endpoint } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) {
    await payload.delete({
      collection: 'programme-push-subscriptions',
      id: existing.docs[0].id,
      overrideAccess: true,
    })
  }
  return Response.json({ ok: true })
}

function cronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return process.env.NODE_ENV !== 'production'
  const auth = request.headers.get('authorization')
  const header = request.headers.get('x-cron-secret')
  return auth === `Bearer ${secret}` || header === secret
}

export async function GET(request: Request): Promise<Response> {
  if (!cronAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!vapidConfigured()) {
    return Response.json({ ok: false, reason: 'vapid-unconfigured' })
  }

  const payload = await getPayload({ config: configPromise })
  const settings = await loadProgrammeAlertSettings(payload)
  if (!settings.enabled) {
    return Response.json({ ok: true, skipped: 'disabled', sent: 0, removed: 0 })
  }

  if (!configureVapid(settings.contactEmail)) {
    return Response.json({ ok: true, skipped: 'missing-contact-email', sent: 0, removed: 0 })
  }

  const now = new Date()
  const origin = getServerSideURL()
  let sent = 0
  let removed = 0
  let page = 1

  while (true) {
    const result = await payload.find({
      collection: 'programme-push-subscriptions',
      limit: 100,
      page,
      overrideAccess: true,
    })

    for (const doc of result.docs) {
      const items = asItems(doc.items)
      const soon = new Set(asIdList(doc.notifiedSoon))
      const live = new Set(asIdList(doc.notifiedLive))
      const path = typeof doc.canonicalPath === 'string' && doc.canonicalPath ? doc.canonicalPath : '/'
      let changed = false

      for (const alert of dueProgrammeAlerts(items, now, settings.leadMinutes)) {
        const bucket = alert.kind === 'live' ? live : soon
        if (bucket.has(alert.item.id)) continue

        const minutes = Math.max(1, Math.ceil(alert.minutes ?? settings.leadMinutes))
        const url = programmeAlertHref(origin, path, alert.item)
        try {
          await webpush.sendNotification(
            {
              endpoint: doc.endpoint,
              keys: { p256dh: doc.p256dh, auth: doc.auth },
            },
            JSON.stringify({
              title: settings.notificationTitle,
              body:
                alert.kind === 'live'
                  ? `${alert.item.title} is starting now`
                  : `Starts in ${minutes} min: ${alert.item.title}`,
              tag: `ffc-${alert.kind}-${alert.item.id}`,
              url,
              agendaId: alert.item.id,
              kind: alert.kind,
            }),
          )
          bucket.add(alert.item.id)
          changed = true
          sent += 1
        } catch (error) {
          const status = typeof error === 'object' && error && 'statusCode' in error ? Number(error.statusCode) : 0
          if (status === 404 || status === 410) {
            await payload.delete({
              collection: 'programme-push-subscriptions',
              id: doc.id,
              overrideAccess: true,
            })
            removed += 1
            changed = false
            break
          }
          console.error('Failed to send programme push', error)
        }
      }

      if (changed) {
        await payload.update({
          collection: 'programme-push-subscriptions',
          id: doc.id,
          data: {
            notifiedSoon: [...soon],
            notifiedLive: [...live],
          },
          overrideAccess: true,
        })
      }
    }

    if (!result.hasNextPage) break
    page += 1
  }

  return Response.json({ ok: true, sent, removed })
}
