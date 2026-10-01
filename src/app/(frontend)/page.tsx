import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { ProgrammeSection } from '@/components/ProgrammeSection'
import { VenueSection } from '@/components/VenueSection'
import { AppendixSection } from '@/components/AppendixSection'
import { Footer } from '@/components/Footer'
import { ModalProvider } from '@/context/ModalContext'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  // 1. Fetch active conference from Global site-settings
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 3,
  })

  const activeConf = siteSettings?.activeConference
  const activeConferenceId =
    typeof activeConf === 'object' && activeConf !== null ? activeConf.id : activeConf

  if (!activeConferenceId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="FFC Ricerca Logo"
            className="w-12 h-12 object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-slate-900 mb-2">No Active Conference Selected</h1>
          <p className="text-sm text-slate-600 mb-6">
            Please log in to the Payload CMS backoffice and select the active conference edition in
            Site Settings.
          </p>
          <a
            href="/admin"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 transition-colors"
          >
            Go to Backoffice Admin
          </a>
        </div>
      </div>
    )
  }

  // 2. Fetch full Conference details
  const conference = await payload.findByID({
    collection: 'conferences',
    id: activeConferenceId,
    depth: 4,
  })

  // 3. Extract Days
  const rawDays = Array.isArray(conference.days) ? conference.days : []
  const days = rawDays
    .map((d: any) => (typeof d === 'object' && d !== null ? d : null))
    .filter(Boolean)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

  const dayIds = days.map((d: any) => d.id)

  // 4. Fetch Agenda Items for these days
  const agendaItemsRes = await payload.find({
    collection: 'agenda-items',
    where: {
      day: {
        in: dayIds,
      },
    },
    depth: 4,
    limit: 200,
  })
  const agendaItems = agendaItemsRes.docs

  // 5. Fetch all Abstracts for Appendix 1
  const abstractsRes = await payload.find({
    collection: 'abstracts',
    depth: 4,
    limit: 100,
  })

  // 6. Fetch all Institutions for Appendix 2
  const institutionsRes = await payload.find({
    collection: 'institutions',
    depth: 2,
    limit: 100,
  })

  // 7. Fetch all People for Appendix 3
  const peopleRes = await payload.find({
    collection: 'people',
    depth: 3,
    limit: 100,
  })

  // 8. Combine all available abstracts for fast lookup and modal deep-linking
  const allAbstractsMap = new Map<string, any>()
  for (const a of abstractsRes.docs) {
    if (a?.id) allAbstractsMap.set(String(a.id), a)
  }
  for (const item of agendaItems) {
    const itemAbstract = item.abstract as any
    if (itemAbstract && typeof itemAbstract === 'object' && itemAbstract.id) {
      allAbstractsMap.set(String(itemAbstract.id), itemAbstract)
    }
    if (Array.isArray(item.children)) {
      for (const child of item.children) {
        const childObj = child as any
        if (
          childObj &&
          typeof childObj === 'object' &&
          childObj.abstract &&
          typeof childObj.abstract === 'object' &&
          childObj.abstract.id
        ) {
          allAbstractsMap.set(String(childObj.abstract.id), childObj.abstract)
        }
      }
    }
  }
  const allAbstracts = Array.from(allAbstractsMap.values())

  return (
    <ModalProvider allAbstracts={allAbstracts}>
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        {/* Dynamic Header */}
        <Header
          editionName={conference.editionName}
          editionYear={conference.editionYear}
          logo={conference.logo}
          primaryColor={conference.primaryColor}
        />

        {/* Hero Overview */}
        <HeroSection conference={conference} />

        {/* Main Single Page Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* 1. Programme Section */}
          <ProgrammeSection days={days} agendaItems={agendaItems} />

          {/* 2. Venue Section */}
          <VenueSection conference={conference} />

          {/* 3. Appendix Section */}
          <AppendixSection
            abstracts={abstractsRes.docs}
            institutions={institutionsRes.docs}
            people={peopleRes.docs}
          />
        </main>

        {/* Institutional Footer */}
        <Footer editionYear={conference.editionYear} />
      </div>
    </ModalProvider>
  )
}
