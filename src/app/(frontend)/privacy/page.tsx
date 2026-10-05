import React from 'react'
import type { Metadata } from 'next'
import { PolicyLayout } from '@/components/PolicyLayout'
import { RichText } from '@/components/RichText'
import { getPublicFooter } from '@/utilities/getConferenceEdition'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const footer = await getPublicFooter()
  const policy = footer?.privacyPolicy
  const title = policy?.title?.trim() || 'Privacy Policy'
  const description =
    policy?.metaDescription?.trim() ||
    'Information on personal data processing for the official FFC Scientific Conference website in compliance with GDPR.'

  return {
    title: `${title} | FFC Scientific Conference`,
    description,
  }
}

function websiteHost(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

export default async function PrivacyPolicyPage() {
  const footer = await getPublicFooter()
  const policy = footer?.privacyPolicy
  const title = policy?.title?.trim() || 'Privacy Policy'
  const website = policy?.controllerWebsite?.trim() || ''
  const rights = policy?.rights?.filter((item) => item.title?.trim()) ?? []
  const hasController =
    Boolean(policy?.controllerName?.trim()) ||
    Boolean(policy?.controllerAddress?.trim()) ||
    Boolean(website)

  return (
    <PolicyLayout
      headerBadge={policy?.headerBadge}
      title={title}
      kicker={policy?.kicker}
      intro={policy?.intro ? <RichText content={policy.intro} disableContainer /> : null}
      lastUpdated={policy?.lastUpdated}
      footer={footer}
    >
      <div className="bg-surface rounded-2xl border border-line shadow-xs p-6 sm:p-10 space-y-8 text-fg-muted leading-relaxed">
        {hasController ? (
          <section>
            <h2 className="text-xl font-bold text-fg mb-3 flex items-center gap-2">
              <span className="text-brand font-mono text-base">01.</span>
              Data Controller
            </h2>
            <p className="text-sm sm:text-base mb-3">
              The Data Controller responsible for the processing of personal data collected through this
              website is:
            </p>
            <div className="bg-subtle border border-line rounded-xl p-4 text-sm space-y-1">
              {policy?.controllerName ? (
                <p className="font-semibold text-fg">{policy.controllerName}</p>
              ) : null}
              {policy?.controllerAddress
                ? policy.controllerAddress.split('\n').map((line, index) => (
                    <p key={`${index}-${line}`} className="text-fg-muted">
                      {line}
                    </p>
                  ))
                : null}
              {website ? (
                <p className="text-fg-muted">
                  Website:{' '}
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline hover:text-brand-hover"
                  >
                    {websiteHost(website)}
                  </a>
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {policy?.content ? (
          <div className={hasController ? 'border-t border-line pt-8' : undefined}>
            <RichText content={policy.content} className="policy-rich-text" />
          </div>
        ) : null}

        {policy?.rightsHeading || policy?.rightsIntro || rights.length > 0 || policy?.complaintNote ? (
          <section className="border-t border-line pt-8">
            {policy?.rightsHeading ? (
              <h2 className="text-xl font-bold text-fg mb-3">{policy.rightsHeading}</h2>
            ) : null}
            {policy?.rightsIntro ? (
              <div className="text-sm sm:text-base mb-3 text-fg-muted">
                <RichText content={policy.rightsIntro} disableContainer />
              </div>
            ) : null}
            {rights.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {rights.map((item, index) => (
                  <div
                    key={item.id ?? `${item.title}-${index}`}
                    className="p-3 rounded-xl bg-subtle border border-line"
                  >
                    <span className="font-semibold text-fg block mb-0.5">{item.title}</span>
                    {item.description ? (
                      <span className="text-fg-muted">{item.description}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {policy?.complaintNote ? (
              <div className="text-xs sm:text-sm text-fg-subtle mt-4">
                <RichText content={policy.complaintNote} disableContainer />
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </PolicyLayout>
  )
}
