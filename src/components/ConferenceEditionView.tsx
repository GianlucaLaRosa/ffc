import React from 'react'
import { ConferenceTheme } from '@/components/ConferenceTheme'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { IntroSection } from '@/components/IntroSection'
import { ProgrammeSection } from '@/components/ProgrammeSection'
import { VenueSection } from '@/components/VenueSection'
import { AppendixSection } from '@/components/AppendixSection'
import { Footer } from '@/components/Footer'
import { ModalProvider } from '@/context/ModalContext'
import { SavedAgendaProvider } from '@/context/SavedAgendaContext'
import { ConferenceJsonLd } from '@/components/ConferenceSeo'
import { UpcomingSessionBanner } from '@/components/SavedAgendaMenu'
import { ConferenceNoticesBanner } from '@/components/ConferenceNoticesBanner'
import { conferenceJsonLd } from '@/utilities/conferenceJsonLd'
import type { ConferenceEditionData } from '@/utilities/getConferenceEdition'

export function ConferenceEditionView({
  data,
  canonicalPath,
}: {
  data: ConferenceEditionData
  canonicalPath: string
}) {
  const { conference, days, abstracts, appendix, notices, footer, programmeAlerts } = data

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
          />
          <div className="sticky top-16 sm:top-20 z-30 flex flex-col">
            <ConferenceNoticesBanner notices={notices ?? []} canonicalPath={canonicalPath} />
            <UpcomingSessionBanner />
          </div>

          <HeroSection conference={conference} days={days} />

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <IntroSection conference={conference} />
            <ProgrammeSection days={days} />
            <VenueSection conference={conference} />
            <AppendixSection abstracts={abstracts} appendix={appendix} />
          </main>

          <Footer editionYear={conference.year} footer={footer} />
        </ConferenceTheme>
      </SavedAgendaProvider>
    </ModalProvider>
  )
}
