import React from 'react'
import { PartnerLogo, footerPartners } from '@/components/PartnerLogos'
import type { Footer as FooterGlobal } from '@/payload-types'

export interface PartnersSectionProps {
  footer?: FooterGlobal | null
}

export function PartnersSection({ footer }: PartnersSectionProps) {
  const partners = footerPartners(footer)
  if (partners.length === 0) return null

  return (
    <section className="py-10 sm:py-16" aria-label="Partners">
      <div className="mb-8 pb-4 border-b border-line">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">Partners</h2>
      </div>

      <ul className="flex flex-wrap items-center justify-center sm:justify-start gap-x-10 gap-y-8">
        {partners.map((partner) => (
          <li key={partner.id ?? `${partner.url}-${partner.alt}`}>
            <PartnerLogo image={partner.image} url={partner.url} alt={partner.alt} />
          </li>
        ))}
      </ul>
    </section>
  )
}
