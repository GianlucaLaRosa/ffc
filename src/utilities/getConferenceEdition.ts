import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getPayload, type Payload } from 'payload'
import configPromise from '@/payload.config'
import type { Abstract, Appendix, Conference, ConferenceDay, Footer as FooterGlobal, Media } from '@/payload-types'
import { joinDocIds, joinDocs } from '@/utilities/conferenceUi'
import { attachProgrammeAbstracts, hydrateProgrammeAgenda } from '@/utilities/programmeAbstracts'
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

export type ArchivedEditionLink = {
  slug: string
  title: string
  year: number | null
  city: string | null
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

/** Join depth on conference does not populate appendix block relationships. */
async function hydrateAppendixForPublic({
  payload,
  appendix,
}: {
  payload: Payload
  appendix: Appendix
}): Promise<Appendix> {
  return (await payload.findByID({
    collection: 'appendices',
    id: appendix.id,
    depth: 2,
    draft: false,
  })) as Appendix
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

  const abstractsRes = await payload.find({
    collection: 'abstracts',
    where: {
      and: [{ conference: { equals: conference.id } }, { _status: { equals: 'published' } }],
    },
    depth: 4,
    draft: false,
    limit: 1000,
    pagination: false,
  })
  const abstractsById = new Map(
    abstractsRes.docs.map((doc) => [String(doc.id), doc as Abstract]),
  )
  const orderedAbstractIds = joinDocIds(conference.abstracts)
  const seenAbstractIds = new Set<string>()
  const abstracts: Abstract[] = []
  for (const id of orderedAbstractIds) {
    const doc = abstractsById.get(id)
    if (!doc || seenAbstractIds.has(id)) continue
    abstracts.push(doc)
    seenAbstractIds.add(id)
  }
  for (const doc of abstractsRes.docs) {
    const id = String(doc.id)
    if (seenAbstractIds.has(id)) continue
    abstracts.push(doc as Abstract)
    seenAbstractIds.add(id)
  }
  const appendixDocs = joinDocs<Appendix>(conference.appendices).filter(
    (doc) => !doc._status || doc._status === 'published',
  )
  const appendix = appendixDocs[0]
    ? await hydrateAppendixForPublic({ payload, appendix: appendixDocs[0] })
    : null

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
    days: attachProgrammeAbstracts(
      await hydrateProgrammeAgenda({
        payload,
        days: daysRes.docs as ConferenceDay[],
      }),
      abstracts,
    ),
    abstracts,
    appendix,
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

async function fetchPublicArchiveEnabled(): Promise<boolean> {
  const payload = await getPayload({ config: configPromise })
  try {
    const settings = await payload.findGlobal({
      slug: 'conference-archive',
      depth: 0,
      select: {
        enablePublicArchive: true,
      },
    })
    return settings.enablePublicArchive !== false
  } catch {
    return true
  }
}

async function fetchArchivedConferences(): Promise<ArchivedEditionLink[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'conferences',
    where: {
      and: [{ _status: { equals: 'published' } }, { publicArchive: { equals: true } }],
    },
    sort: '-year',
    depth: 0,
    draft: false,
    limit: 100,
    pagination: false,
    select: {
      title: true,
      slug: true,
      year: true,
      city: true,
    },
  })

  const editions = result.docs.flatMap((doc) => {
    if (typeof doc.slug !== 'string' || !doc.slug) return []
    return [
      {
        slug: doc.slug,
        title: typeof doc.title === 'string' && doc.title ? doc.title : doc.slug,
        year: typeof doc.year === 'number' ? doc.year : null,
        city: typeof doc.city === 'string' && doc.city ? doc.city : null,
      } satisfies ArchivedEditionLink,
    ]
  })

  editions.sort((a, b) => {
    const yearDiff = (b.year ?? 0) - (a.year ?? 0)
    if (yearDiff !== 0) return yearDiff
    return a.title.localeCompare(b.title)
  })

  return editions
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
    ['loadConferenceEdition', 'programme-abstracts', 'agenda-hydrate', 'appendix-institutions', String(conferenceId)],
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

export const getArchivedConferences = cache(() =>
  unstable_cache(fetchArchivedConferences, ['getArchivedConferences'], {
    tags: [CACHE_TAGS.archive, CACHE_TAGS.active],
  })(),
)

export const isPublicArchiveEnabled = cache(() =>
  unstable_cache(fetchPublicArchiveEnabled, ['isPublicArchiveEnabled'], {
    tags: [CACHE_TAGS.archive],
  })(),
)

async function fetchPublicFooter(): Promise<FooterGlobal | null> {
  const payload = await getPayload({ config: configPromise })
  try {
    return (await payload.findGlobal({
      slug: 'footer',
      depth: 1,
    })) as FooterGlobal
  } catch {
    return null
  }
}

export const getPublicFooter = cache(() =>
  unstable_cache(fetchPublicFooter, ['getPublicFooter', 'with-policies'], {
    tags: [CACHE_TAGS.footer],
    revalidate: 60,
  })(),
)
