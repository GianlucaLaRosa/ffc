import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'
import React from 'react'

import { IntroPreviewView } from '@/components/IntroPreviewView'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Conference } from '@/payload-types'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
}

const loadDraftConference = cache(async (slug: string): Promise<Conference | null> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'conferences',
    where: { slug: { equals: slug } },
    draft: true,
    depth: 2,
    limit: 1,
    overrideAccess: true,
  })

  return (result.docs[0] as Conference | undefined) ?? null
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return { robots: { index: false, follow: false } }

  const { slug } = await params
  const conference = await loadDraftConference(slug)

  return {
    title: conference?.title ? `${conference.title} intro preview` : 'Intro preview',
    robots: { index: false, follow: false },
  }
}

export default async function ConferenceIntroPreviewPage({ params }: PageProps) {
  const { isEnabled } = await draftMode()
  if (!isEnabled) notFound()

  const { slug } = await params
  const conference = await loadDraftConference(slug)
  if (!conference) notFound()

  return (
    <>
      <LivePreviewListener />
      <IntroPreviewView conference={conference} />
    </>
  )
}
