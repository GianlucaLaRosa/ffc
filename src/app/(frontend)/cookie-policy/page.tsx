import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, CheckCircle2, Info, Lock, EyeOff } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { PolicyChrome } from '@/components/PolicyChrome'
import { ThemeToggle } from '@/components/ThemeToggle'
import { InstallPwaButton } from '@/components/InstallPwaButton'

export const metadata: Metadata = {
  title: 'Cookie Policy | FFC Scientific Conference',
  description:
    'Information regarding cookies and tracking technologies on the official FFC Scientific Conference website.',
}

export const revalidate = 60

export default async function CookiePolicyPage() {
  const lastUpdated = 'October 2026'

  return (
    <PolicyChrome>
      {/* Top navigation bar */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-line/80 pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center gap-2 min-h-11 text-sm font-medium text-fg-muted hover:text-brand-soft-fg transition-colors min-w-0"
          >
            <ArrowLeft className="w-4 h-4 text-brand shrink-0" />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to Conference Home</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-brand-soft-fg bg-brand-soft border border-brand-border/80 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              <span>Zero Tracking Platform</span>
            </div>
            <InstallPwaButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Document Header Card */}
        <div className="bg-surface rounded-2xl border border-line shadow-xs p-6 sm:p-10 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-subtle text-fg-muted text-xs font-semibold mb-4">
            <span>Official Policy &amp; Compliance Statement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight mb-3">
            Cookie Policy
          </h1>
          <p className="text-fg-muted text-base sm:text-lg leading-relaxed mb-4">
            Official statement on the non-use of cookies and tracking technologies for the{' '}
            <strong>FFC Scientific Conference</strong> website, managed by{' '}
            <strong>Fondazione Ricerca Fibrosi Cistica - ETS</strong>.
          </p>
          <p className="text-xs text-fg-subtle font-mono">Last updated: {lastUpdated}</p>
        </div>

        {/* Executive Summary Highlight Card */}
        <div className="bg-brand-soft/80 border border-brand-border rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-brand text-brand-fg shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-soft-fg mb-1">
                Summary: This website does not use cookies
              </h2>
              <p className="text-sm text-brand-soft-fg leading-relaxed mb-4">
                We believe in privacy-by-design. This website is built as an open, accessible scientific
                portal for researchers, clinicians, and participants. We do{' '}
                <strong>not</strong> store cookies on your device, we do <strong>not</strong> profile
                your browsing behavior, and we do <strong>not</strong> integrate advertising or third-party
                tracking networks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-surface/80 backdrop-blur-xs p-3 rounded-lg border border-brand-border/60 font-medium text-brand-soft-fg flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-brand shrink-0" />
                  <span>No Profiling Cookies</span>
                </div>
                <div className="bg-surface/80 backdrop-blur-xs p-3 rounded-lg border border-brand-border/60 font-medium text-brand-soft-fg flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
                  <span>No Third-Party Trackers</span>
                </div>
                <div className="bg-surface/80 backdrop-blur-xs p-3 rounded-lg border border-brand-border/60 font-medium text-brand-soft-fg flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand shrink-0" />
                  <span>No Banner Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-surface rounded-2xl border border-line shadow-xs p-6 sm:p-10 space-y-8 text-fg-muted leading-relaxed">
          {/* Section 1 */}
          <section>
            <h3 className="text-xl font-bold text-fg mb-3 flex items-center gap-2">
              <span className="text-brand font-mono text-base">01.</span>
              What Are Cookies?
            </h3>
            <p className="text-sm sm:text-base mb-3">
              Cookies are small text files that websites often store on a visitor’s computer or mobile
              device when visiting a webpage. They are widely used to make websites work efficiently,
              remember user preferences, monitor visitor analytics, or deliver targeted advertising.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-t border-line pt-8">
            <h3 className="text-xl font-bold text-fg mb-3 flex items-center gap-2">
              <span className="text-brand font-mono text-base">02.</span>
              Our Zero-Cookie Architecture
            </h3>
            <p className="text-sm sm:text-base mb-4">
              On this public website (the conference presentation, programme schedule, scientific
              abstracts, and venue directions), <strong>no cookies of any kind are placed on your terminal</strong>:
            </p>
            <ul className="space-y-2.5 text-sm sm:text-base list-disc list-inside text-fg-muted pl-1">
              <li>
                <strong className="text-fg">No Profiling Cookies:</strong> We do not track or build
                behavioral profiles of users visiting this site.
              </li>
              <li>
                <strong className="text-fg">No Marketing or Advertising Cookies:</strong> We do not display
                commercial ads and do not share data with ad-tech brokers or marketing platforms.
              </li>
              <li>
                <strong className="text-fg">No Third-Party Analytics Cookies:</strong> We do not deploy
                invasive third-party analytics cookies (such as Google Analytics with cross-site tracking).
              </li>
              <li>
                <strong className="text-fg">No Social Network Widgets or Beacons:</strong> We do not embed
                active social media scripts (such as Meta Pixel or LinkedIn Insight Tag) that transmit user
                telemetry to third parties.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="border-t border-line pt-8">
            <h3 className="text-xl font-bold text-fg mb-3 flex items-center gap-2">
              <span className="text-brand font-mono text-base">03.</span>
              Why Is There No Cookie Banner?
            </h3>
            <div className="bg-subtle border border-line rounded-xl p-4 sm:p-5 text-sm text-fg-muted">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-fg-subtle shrink-0 mt-0.5" />
                <div>
                  <p className="mb-2">
                    Under the <strong>EU ePrivacy Directive (Directive 2002/58/EC)</strong>, the{' '}
                    <strong>General Data Protection Regulation (GDPR - Regulation EU 2016/679)</strong>,
                    and the <strong>Guidelines on Cookies and other Tracking Tools</strong> issued by the
                    Italian Data Protection Authority (<em>Garante per la protezione dei dati personali</em>,
                    June 10, 2021), a consent banner is <strong>only mandatory</strong> when non-technical
                    cookies or trackers are utilized.
                  </p>
                  <p>
                    Because this website does not set any profiling, advertising, or third-party tracking
                    cookies, <strong>no consent banner is required by law</strong>. You can browse the
                    conference schedule and read research abstracts with complete peace of mind, free from
                    intrusive pop-ups.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-t border-line pt-8">
            <h3 className="text-xl font-bold text-fg mb-3 flex items-center gap-2">
              <span className="text-brand font-mono text-base">04.</span>
              Technical Server Logs
            </h3>
            <p className="text-sm sm:text-base mb-3">
              Like virtually all web servers, the hosting infrastructure automatically records standard
              technical connection logs (such as your IP address, browser type and version, operating system,
              requested URL, and timestamp of the request).
            </p>
            <p className="text-sm text-fg-muted leading-relaxed">
              These technical logs are strictly processed for network security purposes (such as detecting and
              mitigating cyber-attacks or DDoS attempts) and guaranteeing the operational stability of the
              server. They are not used to identify visitors, are not matched with third-party databases, and
              are automatically purged in accordance with standard data retention schedules. For more details,
              please refer to our{' '}
              <Link href="/privacy" className="text-brand font-semibold underline hover:text-brand-hover">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="border-t border-line pt-8">
            <h3 className="text-xl font-bold text-fg mb-3 flex items-center gap-2">
              <span className="text-brand font-mono text-base">05.</span>
              Staff authentication
            </h3>
            <p className="text-sm sm:text-base text-fg-muted">
              Authenticated conference staff receive a strictly technical session cookie needed to stay
              signed in to the editorial area. Regular public visitors browsing the conference website do
              not receive this token.
            </p>
          </section>

          {/* Section 6 */}
          <section className="border-t border-line pt-8">
            <h3 className="text-xl font-bold text-fg mb-3 flex items-center gap-2">
              <span className="text-brand font-mono text-base">06.</span>
              Data Controller &amp; Inquiries
            </h3>
            <div className="bg-subtle border border-line rounded-xl p-5 text-sm space-y-2">
              <p className="font-semibold text-fg">
                Fondazione Ricerca Fibrosi Cistica - ETS (FFC Ricerca)
              </p>
              <p className="text-fg-muted">
                Piazza Bra 1 - Palazzo della Gran Guardia / Scientific Secretariat
              </p>
              <p className="text-fg-muted">Verona (VR), Italy</p>
              <p className="text-fg-muted pt-2">
                For questions regarding this policy or the processing of personal data, please contact the
                scientific secretariat or visit the official foundation portal at{' '}
                <a
                  href="https://www.fibrosicisticaricerca.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand font-semibold hover:underline"
                >
                  www.fibrosicisticaricerca.it
                </a>.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </PolicyChrome>
  )
}
