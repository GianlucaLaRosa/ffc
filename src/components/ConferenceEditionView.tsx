import React from 'react'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { ProgrammeSection } from '@/components/ProgrammeSection'
import { VenueSection } from '@/components/VenueSection'
import { AppendixSection } from '@/components/AppendixSection'
import { Footer } from '@/components/Footer'
import { ModalProvider } from '@/context/ModalContext'
import { ConferenceJsonLd } from '@/components/ConferenceSeo'
import { conferenceJsonLd } from '@/utilities/conferenceJsonLd'
import type { ConferenceEditionData } from '@/utilities/getConferenceEdition'

export function ConferenceEditionView({
  data,
  canonicalPath,
}: {
  data: ConferenceEditionData
  canonicalPath: string
}) {
  const { conference, days, abstracts, appendix, footer, activeSlug } = data

  return (
    <ModalProvider allAbstracts={abstracts}>
      <ConferenceJsonLd jsonLd={conferenceJsonLd({ conference, days, canonicalPath })} />
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Header
          editionName={conference.name}
          editionYear={conference.year}
          logo={conference.logo}
          primaryColor={conference.primaryColor}
        />

        <HeroSection conference={conference} days={days} />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ProgrammeSection days={days} />
          <VenueSection conference={conference} />
          <AppendixSection abstracts={abstracts} appendix={appendix} />
        </main>

        <Footer editionYear={conference.year} footer={footer} activeSlug={activeSlug} />
      </div>
    </ModalProvider>
  )
}
