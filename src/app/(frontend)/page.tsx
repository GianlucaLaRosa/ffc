import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Archive, ArrowRight } from 'lucide-react'
import { ConferenceEditionView } from '@/components/ConferenceEditionView'
import { ThemeToggle } from '@/components/ThemeToggle'
import { InstallPwaButton } from '@/components/InstallPwaButton'
import { conferenceMetadata } from '@/components/ConferenceSeo'
import {
  getActiveConferenceId,
  getArchivedConferences,
  isPublicArchiveEnabled,
  loadConferenceEdition,
} from '@/utilities/getConferenceEdition'

export const revalidate = 60

function ComingSoon({ showArchiveLink = false }: { showArchiveLink?: boolean }) {
  return (
    <div className="theme min-h-screen flex items-center justify-center p-6 bg-page text-center relative">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <InstallPwaButton />
        <ThemeToggle />
      </div>
      <div className="max-w-md p-8 rounded-2xl bg-surface border border-line shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="FFC Ricerca Logo"
          className="w-12 h-12 object-contain mx-auto mb-4"
        />
        <h1 className="text-xl font-bold text-fg mb-2">FFC Scientific Conference</h1>
        <p className="text-sm text-fg-muted">The next edition will be announced here.</p>
        {showArchiveLink ? (
          <Link
            href="/archive"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-soft-fg hover:underline"
          >
            <Archive className="w-4 h-4 text-brand" aria-hidden />
            Conference archive
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        ) : null}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { id } = await getActiveConferenceId()
  if (!id) {
    return {
      title: 'FFC Scientific Conference',
      description: 'Official conference application for the Cystic Fibrosis Scientific Conference.',
    }
  }
  const data = await loadConferenceEdition(id)
  if (!data) return { title: 'FFC Scientific Conference' }
  return conferenceMetadata({ conference: data.conference, canonicalPath: '/' })
}

async function comingSoonProps() {
  const [archivedEditions, showArchiveNav] = await Promise.all([
    getArchivedConferences(),
    isPublicArchiveEnabled(),
  ])
  return { showArchiveLink: showArchiveNav && archivedEditions.length > 0 }
}

export default async function HomePage() {
  const { id: activeConferenceId } = await getActiveConferenceId()

  if (!activeConferenceId) {
    return <ComingSoon {...(await comingSoonProps())} />
  }

  const data = await loadConferenceEdition(activeConferenceId)
  if (!data) {
    return <ComingSoon {...(await comingSoonProps())} />
  }

  return <ConferenceEditionView data={data} canonicalPath="/" />
}
