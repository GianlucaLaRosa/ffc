import React from 'react'
import type { Metadata } from 'next'
import { ArchiveIndexView } from '@/components/ArchiveIndexView'
import { getServerSideURL } from '@/utilities/getURL'
import {
  getActiveConferenceLogo,
  getArchivedConferences,
  getPublicFooter,
  isPublicArchiveEnabled,
} from '@/utilities/getConferenceEdition'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${getServerSideURL()}/archive`
  return {
    title: 'Conference archive | FFC Scientific Conference',
    description: 'Past editions of the FFC Scientific Conference: programmes, venues, and abstracts.',
    alternates: { canonical },
    openGraph: {
      title: 'Conference archive | FFC Scientific Conference',
      description: 'Past editions of the FFC Scientific Conference: programmes, venues, and abstracts.',
      url: canonical,
      type: 'website',
    },
  }
}

export default async function ArchiveIndexPage() {
  const [editions, footer, logo, showArchiveNav] = await Promise.all([
    getArchivedConferences(),
    getPublicFooter(),
    getActiveConferenceLogo(),
    isPublicArchiveEnabled(),
  ])

  return (
    <ArchiveIndexView
      editions={editions}
      footer={footer}
      logo={logo}
      showArchiveNav={showArchiveNav}
    />
  )
}
