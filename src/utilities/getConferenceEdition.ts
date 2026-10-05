import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { Abstract, Appendix, Conference, ConferenceDay, Footer as FooterGlobal, Media } from '@/payload-types'
import { joinDocs } from '@/utilities/conferenceUi'
import { relationId, relationSlug } from '@/utilities/conferenceRoutes'
import { CACHE_TAGS, conferenceIdTag, conferenceSlugTag } from '@/utilities/cacheTags'
import {
  DEFAULT_PROGRAMME_ALERT_SETTINGS,
  settingsFromGlobal,
  type ProgrammeAlertSettings,
} from '@/utilities/programmeAlertSettings'
import {
  isConferenceNoticeVisible,
  type PublicConferenceNotice,
} from '@/utilities/conferenceNotices'

export type ConferenceEditionData = {
  conference: Conference
  days: ConferenceDay[]
  abstracts: Abstract[]
  appendix: Appendix | null
  notices: PublicConferenceNotice[]
  footer: FooterGlobal | null
  activeSlug: string | null
  programmeAlerts: Pick<ProgrammeAlertSettings, 'enabled' | 'leadMinutes' | 'notificationTitle'>
}

async function fetchActiveConferenceId(): Promise<{
  id: number | string | null
  slug: string | null
}> {
  const payload = await getPayload({ config: configPromise })
  const activeSettings = await payload.findGlobal({
    slug: 'active-conference',
    depth: 1,
  })
  const activeConf = activeSettings?.conference
  return {
    id: relationId(activeConf),
    slug: relationSlug(typeof activeConf === 'object' ? activeConf : null),
  }
}

async function fetchConferenceEdition(conferenceId: number | string): Promise<ConferenceEditionData | null> {
  const payload = await getPayload({ config: configPromise })
  const { slug: activeSlug } = await fetchActiveConferenceId()

  const conference = (await payload.findByID({
    collection: 'conferences',
    id: conferenceId,
    depth: 4,
    draft: false,
  })) as Conference

  if (conference._status && conference._status !== 'published') return null

  const daysRes = await payload.find({
    collection: 'conference-days',
    where: {
      and: [{ conference: { equals: conference.id } }, { _status: { equals: 'published' } }],
    },
    sort: 'date',
    depth: 4,
    draft: false,
    limit: 50,
  })

  const orderedAbstracts = joinDocs<Abstract>(conference.abstracts).filter(
    (abs) => !abs._status || abs._status === 'published',
  )
  const orderedAbstractIds = orderedAbstracts.map((abs) => abs.id)
  let abstracts: Abstract[] = orderedAbstracts
  if (orderedAbstractIds.length > 0) {
    const abstractsRes = await payload.find({
      collection: 'abstracts',
      where: { id: { in: orderedAbstractIds } },
      depth: 3,
      draft: false,
      limit: orderedAbstractIds.length,
      pagination: false,
    })
    const byId = new Map(
      abstractsRes.docs.map((doc) => [String(doc.id), doc as Abstract]),
    )
    abstracts = orderedAbstractIds
      .map((id) => byId.get(String(id)))
      .filter((doc): doc is Abstract => Boolean(doc))
  }
  const appendixDocs = joinDocs<Appendix>(conference.appendices).filter(
    (doc) => !doc._status || doc._status === 'published',
  )

  let footer: FooterGlobal | null = null
  try {
    footer = (await payload.findGlobal({
      slug: 'footer',
      depth: 0,
    })) as FooterGlobal
  } catch {
    footer = null
  }

  let programmeAlerts = DEFAULT_PROGRAMME_ALERT_SETTINGS
  try {
    programmeAlerts = settingsFromGlobal(
      await payload.findGlobal({
        slug: 'programme-alerts',
        depth: 0,
        select: {
          enabled: true,
          leadMinutes: true,
          notificationTitle: true,
        },
      }),
    )
  } catch {
    programmeAlerts = DEFAULT_PROGRAMME_ALERT_SETTINGS
  }

  const noticesRes = await payload.find({
    collection: 'conference-notices',
    where: {
      and: [
        { conference: { equals: conference.id } },
        { showOnSite: { equals: true } },
      ],
    },
    sort: '_conference-notices_notices_order',
    depth: 0,
    limit: 20,
    pagination: false,
  })

  const now = new Date()
  const notices: PublicConferenceNotice[] = noticesRes.docs
    .map((doc) => {
      const related = relationId(doc.relatedAgendaItem)
      return {
        id: doc.id,
        title: typeof doc.title === 'string' ? doc.title : '',
        body: typeof doc.body === 'string' ? doc.body : '',
        severity:
          doc.severity === 'urgent' || doc.severity === 'info' || doc.severity === 'change'
            ? doc.severity
            : 'change',
        linkPath: typeof doc.linkPath === 'string' ? doc.linkPath : null,
        relatedAgendaItemId: related != null ? String(related) : null,
        startsAt: typeof doc.startsAt === 'string' ? doc.startsAt : null,
        expiresAt: typeof doc.expiresAt === 'string' ? doc.expiresAt : null,
      } satisfies PublicConferenceNotice
    })
    .filter((notice) => notice.title && notice.body && isConferenceNoticeVisible(notice, now))

  return {
    conference,
    days: daysRes.docs as ConferenceDay[],
    abstracts,
    appendix: appendixDocs[0] ?? null,
    notices,
    footer,
    activeSlug,
    programmeAlerts: {
      enabled: programmeAlerts.enabled,
      leadMinutes: programmeAlerts.leadMinutes,
      notificationTitle: programmeAlerts.notificationTitle,
    },
  }
}

async function fetchActiveConferenceBrand(): Promise<{
  primaryColor: string | null
  secondaryColor: string | null
}> {
  const { id } = await fetchActiveConferenceId()
  if (!id) return { primaryColor: null, secondaryColor: null }

  const payload = await getPayload({ config: configPromise })
  try {
    const conference = await payload.findByID({
      collection: 'conferences',
      id,
      depth: 0,
      draft: false,
      select: {
        primaryColor: true,
        secondaryColor: true,
        _status: true,
      },
    })
    if (conference._status && conference._status !== 'published') {
      return { primaryColor: null, secondaryColor: null }
    }
    return {
      primaryColor: conference.primaryColor ?? null,
      secondaryColor: conference.secondaryColor ?? null,
    }
  } catch {
    return { primaryColor: null, secondaryColor: null }
  }
}

async function fetchConferenceLogo(conferenceId: number | string): Promise<Media | null> {
  const payload = await getPayload({ config: configPromise })
  try {
    const conference = await payload.findByID({
      collection: 'conferences',
      id: conferenceId,
      depth: 1,
      draft: false,
      select: {
        logo: true,
        _status: true,
      },
    })
    if (conference._status && conference._status !== 'published') return null
    const logo = conference.logo
    return typeof logo === 'object' && logo ? logo : null
  } catch {
    return null
  }
}

async function fetchPublishedConferenceBySlug(slug: string): Promise<Conference | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'conferences',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    depth: 0,
    draft: false,
    limit: 1,
  })
  return (result.docs[0] as Conference | undefined) ?? null
}

export const getActiveConferenceId = cache(() =>
  unstable_cache(fetchActiveConferenceId, ['getActiveConferenceId'], {
    tags: [CACHE_TAGS.active],
  })(),
)

export const loadConferenceEdition = cache((conferenceId: number | string) =>
  unstable_cache(
    () => fetchConferenceEdition(conferenceId),
    ['loadConferenceEdition', String(conferenceId)],
    {
      tags: [
        conferenceIdTag(conferenceId),
        CACHE_TAGS.public,
        CACHE_TAGS.footer,
        CACHE_TAGS.active,
        CACHE_TAGS.programmeAlerts,
      ],
    },
  )(),
)

export const getActiveConferenceBrand = cache(() =>
  unstable_cache(fetchActiveConferenceBrand, ['getActiveConferenceBrand'], {
    tags: [CACHE_TAGS.active, CACHE_TAGS.public],
  })(),
)

export const getConferenceLogo = cache((conferenceId: number | string) =>
  unstable_cache(
    () => fetchConferenceLogo(conferenceId),
    ['getConferenceLogo', String(conferenceId)],
    {
      tags: [conferenceIdTag(conferenceId), CACHE_TAGS.public],
    },
  )(),
)

export const getActiveConferenceLogo = cache(async (): Promise<Media | null> => {
  const { id } = await getActiveConferenceId()
  if (!id) return null
  return getConferenceLogo(id)
})

export const findPublishedConferenceBySlug = cache((slug: string) =>
  unstable_cache(
    () => fetchPublishedConferenceBySlug(slug),
    ['findPublishedConferenceBySlug', slug],
    {
      tags: [CACHE_TAGS.archive, conferenceSlugTag(slug)],
    },
  )(),
)
