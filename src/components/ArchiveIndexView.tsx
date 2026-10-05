import React from 'react'
import Link from 'next/link'
import { Archive, ArrowRight, Calendar, MapPin } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PolicyChrome } from '@/components/PolicyChrome'
import { ConferenceJsonLd } from '@/components/ConferenceSeo'
import { conferencePublicPath } from '@/utilities/conferenceRoutes'
import { getServerSideURL } from '@/utilities/getURL'
import type { ArchivedEditionLink } from '@/utilities/getConferenceEdition'
import type { Footer as FooterGlobal, Media } from '@/payload-types'

function editionHref(edition: ArchivedEditionLink) {
  return conferencePublicPath({ slug: edition.slug, publicArchive: true }) ?? `/archive/${edition.slug}`
}

export function ArchiveIndexView({
  editions,
  footer,
  logo,
}: {
  editions: ArchivedEditionLink[]
  footer: FooterGlobal | null
  logo: Media | null
}) {
  const origin = getServerSideURL()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Conference archive',
    url: `${origin}/archive`,
    hasPart: editions.map((edition) => ({
      '@type': 'WebPage',
      name: edition.year != null ? `${edition.year} · ${edition.title}` : edition.title,
      url: `${origin}${editionHref(edition)}`,
    })),
  }

  return (
    <PolicyChrome>
      <ConferenceJsonLd jsonLd={jsonLd} />
      <Header
        editionName={null}
        logo={logo}
        archivedEditions={editions}
        isArchived
        brand="archive"
        showSectionNav={false}
        showSavedAgenda={false}
      />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand-soft-fg text-xs font-bold uppercase tracking-wider border border-brand-border/60 mb-4">
            <Archive className="w-3.5 h-3.5 text-brand" aria-hidden />
            Past editions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight mb-3">
            Conference archive
          </h1>
          <p className="text-fg-muted text-base sm:text-lg leading-relaxed max-w-2xl">
            Browse previous FFC Scientific Conference programmes, venues, and abstracts.
          </p>
        </div>

        {editions.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-8 sm:p-10 text-center">
            <p className="text-fg-muted">No archived editions are public yet.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-soft-fg hover:underline"
            >
              Current edition
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <ul className="grid gap-3 sm:gap-4">
            {editions.map((edition) => (
              <li key={edition.slug}>
                <Link
                  href={editionHref(edition)}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 sm:px-6 sm:py-5 shadow-xs hover:border-brand-border hover:bg-brand-soft/40 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block text-base sm:text-lg font-bold text-fg group-hover:text-brand-soft-fg">
                      {edition.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
                      {edition.year != null ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand" aria-hidden />
                          {edition.year}
                        </span>
                      ) : null}
                      {edition.city ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand" aria-hidden />
                          {edition.city}
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <ArrowRight
                    className="w-5 h-5 shrink-0 text-fg-subtle group-hover:text-brand"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer footer={footer} />
    </PolicyChrome>
  )
}
