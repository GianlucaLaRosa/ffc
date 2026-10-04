import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { Abstract, Appendix, Conference, ConferenceDay, Footer as FooterGlobal } from '@/payload-types'
import { joinDocs } from '@/utilities/conferenceUi'
import { relationId, relationSlug } from '@/utilities/conferenceRoutes'

export type ConferenceEditionData = {
  conference: Conference
  days: ConferenceDay[]
  abstracts: Abstract[]
  appendix: Appendix | null
  footer: FooterGlobal | null
  activeSlug: string | null
}

export const getActiveConferenceId = cache(async (): Promise<{
  id: number | string | null
  slug: string | null
}> => {
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
})

export const loadConferenceEdition = cache(
  async (conferenceId: number | string): Promise<ConferenceEditionData | null> => {
    const payload = await getPayload({ config: configPromise })
    const { slug: activeSlug } = await getActiveConferenceId()

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

    const abstracts = joinDocs<Abstract>(conference.abstracts).filter(
      (abs) => !abs._status || abs._status === 'published',
    )
    const appendixDocs = joinDocs<Appendix>(conference.appendices).filter(
      (doc) => !doc._status || doc._status === 'published',
    )

    let footer: FooterGlobal | null = null
    try {
      footer = (await payload.findGlobal({
        slug: 'footer',
        depth: 1,
      })) as FooterGlobal
    } catch {
      footer = null
    }

    return {
      conference,
      days: daysRes.docs as ConferenceDay[],
      abstracts,
      appendix: appendixDocs[0] ?? null,
      footer,
      activeSlug,
    }
  },
)

export const findPublishedConferenceBySlug = cache(async (slug: string): Promise<Conference | null> => {
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
})
