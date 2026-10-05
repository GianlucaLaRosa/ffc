import React from 'react'
import type { Metadata } from 'next'
import { CheckCircle2, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { PolicyLayout } from '@/components/PolicyLayout'
import { RichText } from '@/components/RichText'
import { getPublicFooter } from '@/utilities/getConferenceEdition'

export const revalidate = 60

const HIGHLIGHT_ICONS = [EyeOff, ShieldCheck, Lock] as const

export async function generateMetadata(): Promise<Metadata> {
  const footer = await getPublicFooter()
  const policy = footer?.cookiePolicy
  const title = policy?.title?.trim() || 'Cookie Policy'
  const description =
    policy?.metaDescription?.trim() ||
    'Information regarding cookies and tracking technologies on the official FFC Scientific Conference website.'

  return {
    title: `${title} | FFC Scientific Conference`,
    description,
  }
}

export default async function CookiePolicyPage() {
  const footer = await getPublicFooter()
  const policy = footer?.cookiePolicy
  const title = policy?.title?.trim() || 'Cookie Policy'
  const highlights = policy?.highlights?.filter((item) => item.label?.trim()) ?? []

  return (
    <PolicyLayout
      headerBadge={policy?.headerBadge}
      title={title}
      kicker={policy?.kicker}
      intro={policy?.intro ? <RichText content={policy.intro} disableContainer /> : null}
      lastUpdated={policy?.lastUpdated}
      footer={footer}
    >
      {policy?.summaryTitle || policy?.summary || highlights.length > 0 ? (
        <div className="bg-brand-soft/80 border border-brand-border rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-brand text-brand-fg shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              {policy?.summaryTitle ? (
                <h2 className="text-lg font-bold text-brand-soft-fg mb-1">{policy.summaryTitle}</h2>
              ) : null}
              {policy?.summary ? (
                <div className="text-sm text-brand-soft-fg leading-relaxed mb-4 policy-summary">
                  <RichText content={policy.summary} disableContainer />
                </div>
              ) : null}
              {highlights.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {highlights.map((item, index) => {
                    const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length]
                    return (
                      <div
                        key={item.id ?? `${item.label}-${index}`}
                        className="bg-surface/80 backdrop-blur-xs p-3 rounded-lg border border-brand-border/60 font-medium text-brand-soft-fg flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4 text-brand shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {policy?.content ? (
        <div className="bg-surface rounded-2xl border border-line shadow-xs p-6 sm:p-10 text-fg-muted leading-relaxed">
          <RichText content={policy.content} className="policy-rich-text" />
        </div>
      ) : null}
    </PolicyLayout>
  )
}
