import React from 'react'
import { ConferenceTheme } from '@/components/ConferenceTheme'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { IntroSection } from '@/components/IntroSection'
import { ProgrammeSection } from '@/components/ProgrammeSection'
import { VenueSection } from '@/components/VenueSection'
import { PartnersSection } from '@/components/PartnersSection'
import { AppendixSection } from '@/components/AppendixSection'
import { Footer } from '@/components/Footer'
import { ModalProvider } from '@/context/ModalContext'
import { SavedAgendaProvider } from '@/context/SavedAgendaContext'
import { ConferenceJsonLd } from '@/components/ConferenceSeo'
import { UpcomingSessionBanner } from '@/components/SavedAgendaMenu'
import { ConferenceNoticesBanner } from '@/components/ConferenceNoticesBanner'
import { conferenceJsonLd } from '@/utilities/conferenceJsonLd'
import {
  getArchivedConferences,
  getPublicFooter,
  isPublicArchiveEnabled,
  type ConferenceEditionData,
} from '@/utilities/getConferenceEdition'
import { ArchivedEditionBanner } from '@/components/ArchivedEditionBanner'

export async function ConferenceEditionView({
  data,
  canonicalPath,
}: {
  data: ConferenceEditionData
  canonicalPath: string
}) {
  const { conference, days, abstracts, appendix, notices, footer: editionFooter, programmeAlerts } =
    data
  const [archivedEditions, showArchiveNav, footer] = await Promise.all([
    getArchivedConferences(),
    isPublicArchiveEnabled(),
    getPublicFooter(),
  ])
  const siteFooter = footer ?? editionFooter

  const isArchived = canonicalPath.startsWith('/archive')

  return (
    <ModalProvider allAbstracts={abstracts}>
      <SavedAgendaProvider
        conferenceId={conference.id}
        canonicalPath={canonicalPath}
        alertsEnabled={programmeAlerts?.enabled ?? true}
        leadMinutes={programmeAlerts?.leadMinutes ?? 5}
        notificationTitle={programmeAlerts?.notificationTitle ?? 'FFC Conference'}
      >
        <ConferenceJsonLd jsonLd={conferenceJsonLd({ conference, days, canonicalPath })} />
        <ConferenceTheme
          className="min-h-screen flex flex-col bg-page"
          primaryColor={conference.primaryColor}
          secondaryColor={conference.secondaryColor}
        >
          <Header
            editionName={conference.name}
            editionYear={conference.year}
            logo={conference.logo}
            archivedEditions={archivedEditions}
            showArchiveNav={showArchiveNav}
            isArchived={isArchived}
          />
          <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] sm:top-[calc(5rem+env(safe-area-inset-top))] z-30 flex flex-col">
            {isArchived ? <ArchivedEditionBanner year={conference.year} /> : null}
            <ConferenceNoticesBanner notices={notices ?? []} canonicalPath={canonicalPath} />
            <UpcomingSessionBanner />
          </div>

          <HeroSection conference={conference} days={days} />

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <IntroSection conference={conference} />
            <ProgrammeSection days={days} isArchived={isArchived} />
            <VenueSection conference={conference} />
            <PartnersSection footer={siteFooter} />
            <AppendixSection abstracts={abstracts} appendix={appendix} />
          </main>

          <Footer editionYear={conference.year} footer={siteFooter} />
        </ConferenceTheme>
      </SavedAgendaProvider>
    </ModalProvider>
  )
}
