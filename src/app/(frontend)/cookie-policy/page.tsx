import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, CheckCircle2, Info, Lock, EyeOff } from 'lucide-react'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy | FFC Scientific Conference',
  description:
    'Information regarding cookies and tracking technologies on the official FFC Scientific Conference website.',
}

export default function CookiePolicyPage() {
  const lastUpdated = 'October 2026'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700" />
            <span>Back to Conference Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Tracking Platform</span>
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Document Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
            <span>Official Policy &amp; Compliance Statement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Cookie Policy
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
            Official statement on the non-use of cookies and tracking technologies for the{' '}
            <strong>FFC Scientific Conference</strong> website, managed by{' '}
            <strong>Fondazione Ricerca Fibrosi Cistica - ETS</strong>.
          </p>
          <p className="text-xs text-slate-400 font-mono">Last updated: {lastUpdated}</p>
        </div>

        {/* Executive Summary Highlight Card */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-950 mb-1">
                Summary: This website does not use cookies
              </h2>
              <p className="text-sm text-emerald-900 leading-relaxed mb-4">
                We believe in privacy-by-design. This website is built as an open, accessible scientific
                portal for researchers, clinicians, and participants. We do{' '}
                <strong>not</strong> store cookies on your device, we do <strong>not</strong> profile
                your browsing behavior, and we do <strong>not</strong> integrate advertising or third-party
                tracking networks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-emerald-200/60 font-medium text-emerald-950 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No Profiling Cookies</span>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-emerald-200/60 font-medium text-emerald-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No Third-Party Trackers</span>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-emerald-200/60 font-medium text-emerald-950 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No Banner Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8 text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">01.</span>
              What Are Cookies?
            </h3>
            <p className="text-sm sm:text-base mb-3">
              Cookies are small text files that websites often store on a visitor’s computer or mobile
              device when visiting a webpage. They are widely used to make websites work efficiently,
              remember user preferences, monitor visitor analytics, or deliver targeted advertising.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-t border-slate-100 pt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">02.</span>
              Our Zero-Cookie Architecture
            </h3>
            <p className="text-sm sm:text-base mb-4">
              On this public website (the conference presentation, programme schedule, scientific
              abstracts, and venue directions), <strong>no cookies of any kind are placed on your terminal</strong>:
            </p>
            <ul className="space-y-2.5 text-sm sm:text-base list-disc list-inside text-slate-600 pl-1">
              <li>
                <strong className="text-slate-800">No Profiling Cookies:</strong> We do not track or build
                behavioral profiles of users visiting this site.
              </li>
              <li>
                <strong className="text-slate-800">No Marketing or Advertising Cookies:</strong> We do not display
                commercial ads and do not share data with ad-tech brokers or marketing platforms.
              </li>
              <li>
                <strong className="text-slate-800">No Third-Party Analytics Cookies:</strong> We do not deploy
                invasive third-party analytics cookies (such as Google Analytics with cross-site tracking).
              </li>
              <li>
                <strong className="text-slate-800">No Social Network Widgets or Beacons:</strong> We do not embed
                active social media scripts (such as Meta Pixel or LinkedIn Insight Tag) that transmit user
                telemetry to third parties.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="border-t border-slate-100 pt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">03.</span>
              Why Is There No Cookie Banner?
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 text-sm text-slate-700">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
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
          <section className="border-t border-slate-100 pt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">04.</span>
              Technical Server Logs
            </h3>
            <p className="text-sm sm:text-base mb-3">
              Like virtually all web servers, the hosting infrastructure automatically records standard
              technical connection logs (such as your IP address, browser type and version, operating system,
              requested URL, and timestamp of the request).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              These technical logs are strictly processed for network security purposes (such as detecting and
              mitigating cyber-attacks or DDoS attempts) and guaranteeing the operational stability of the
              server. They are not used to identify visitors, are not matched with third-party databases, and
              are automatically purged in accordance with standard data retention schedules. For more details,
              please refer to our{' '}
              <Link href="/privacy" className="text-emerald-700 font-semibold underline hover:text-emerald-900">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="border-t border-slate-100 pt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">05.</span>
              Backoffice / Administrative Area
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Only authenticated conference administrators accessing the CMS backoffice (
              <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">/admin</code>) receive
              a strictly technical authentication session token (cookie) necessary to authenticate their login
              credentials and maintain secure access to the editorial dashboard. Regular public visitors
              browsing the conference website do not receive this token.
            </p>
          </section>

          {/* Section 6 */}
          <section className="border-t border-slate-100 pt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">06.</span>
              Data Controller &amp; Inquiries
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm space-y-2">
              <p className="font-semibold text-slate-900">
                Fondazione Ricerca Fibrosi Cistica - ETS (FFC Ricerca)
              </p>
              <p className="text-slate-600">
                Piazza Bra 1 - Palazzo della Gran Guardia / Scientific Secretariat
              </p>
              <p className="text-slate-600">Verona (VR), Italy</p>
              <p className="text-slate-600 pt-2">
                For questions regarding this policy or the processing of personal data, please contact the
                scientific secretariat or visit the official foundation portal at{' '}
                <a
                  href="https://www.fibrosicisticaricerca.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  www.fibrosicisticaricerca.it
                </a>.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
