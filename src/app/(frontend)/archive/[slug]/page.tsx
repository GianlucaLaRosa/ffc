import React from 'react'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ConferenceEditionView } from '@/components/ConferenceEditionView'
import { conferenceMetadata } from '@/components/ConferenceSeo'
import {
  findPublishedConferenceBySlug,
  getActiveConferenceId,
  loadConferenceEdition,
} from '@/utilities/getConferenceEdition'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { slug: activeSlug } = await getActiveConferenceId()
  if (activeSlug && slug === activeSlug) {
    return { title: 'FFC Scientific Conference' }
  }

  const listed = await findPublishedConferenceBySlug(slug)
  if (!listed?.publicArchive) {
    return { title: 'Conference archive' }
  }

  const data = await loadConferenceEdition(listed.id)
  if (!data) return { title: 'Conference archive' }
  return conferenceMetadata({
    conference: data.conference,
    canonicalPath: `/archive/${slug}`,
  })
}

export default async function ArchiveConferencePage({ params }: PageProps) {
  const { slug } = await params
  const { slug: activeSlug } = await getActiveConferenceId()

  if (activeSlug && slug === activeSlug) {
    redirect('/')
  }

  const listed = await findPublishedConferenceBySlug(slug)
  if (!listed || !listed.publicArchive) {
    notFound()
  }

  const data = await loadConferenceEdition(listed.id)
  if (!data) notFound()

  return <ConferenceEditionView data={data} canonicalPath={`/archive/${slug}`} />
}
