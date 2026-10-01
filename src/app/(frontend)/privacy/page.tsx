import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, CheckCircle2, FileText, Lock, Globe } from 'lucide-react'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | FFC Scientific Conference',
  description:
    'Information on personal data processing for the official FFC Scientific Conference website in compliance with GDPR.',
}

export default function PrivacyPolicyPage() {
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
            <span>GDPR Compliant</span>
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Document Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Articles 13 &amp; 14 - Regulation (EU) 2016/679 (GDPR)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
            This notice describes how personal data is processed when visiting the official conference
            platform of the <strong>FFC Scientific Conference</strong>, operated by{' '}
            <strong>Fondazione Ricerca Fibrosi Cistica - ETS</strong>.
          </p>
          <p className="text-xs text-slate-400 font-mono">Last updated: {lastUpdated}</p>
        </div>

        {/* Detailed Sections Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8 text-slate-700 leading-relaxed">
          {/* Section 1: Data Controller */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">01.</span>
              Data Controller
            </h2>
            <p className="text-sm sm:text-base mb-3">
              The Data Controller responsible for the processing of personal data collected through this
              website is:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
              <p className="font-semibold text-slate-900">
                Fondazione Ricerca Fibrosi Cistica - ETS (FFC Ricerca)
              </p>
              <p className="text-slate-600">Piazza Bra 1 - Palazzo della Gran Guardia</p>
              <p className="text-slate-600">Verona (VR), Italy</p>
              <p className="text-slate-600">
                Website:{' '}
                <a
                  href="https://www.fibrosicisticaricerca.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline hover:text-emerald-900"
                >
                  www.fibrosicisticaricerca.it
                </a>
              </p>
            </div>
          </section>

          {/* Section 2: Categories of Data Collected */}
          <section className="border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">02.</span>
              Categories of Personal Data Collected
            </h2>
            <div className="space-y-4 text-sm sm:text-base">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">A. Technical Browsing Data (Log Files)</h3>
                <p className="text-slate-600">
                  During normal operation, the software procedures and IT infrastructure providing this
                  website automatically acquire specific data whose transmission is implicit in the use of
                  Internet communication protocols (e.g., IP addresses, device operating system, browser
                  user-agent, requested URI addresses, time of request, HTTP status code returned by the
                  server). This data is processed strictly for technical diagnostics, cyber-security, and
                  system stability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">B. Conference Scientific Directory</h3>
                <p className="text-slate-600">
                  Names, institutional affiliations, and scientific biographies of speakers, session
                  moderators, and abstract contributors displayed on this website are published solely for
                  academic and scientific dissemination purposes in connection with the conference proceedings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">C. Cookies and Trackers</h3>
                <p className="text-slate-600">
                  This website does <strong>not</strong> install cookies, tracking pixels, or fingerprinting
                  tools on visitors’ browsers. For complete details, consult our dedicated{' '}
                  <Link
                    href="/cookie-policy"
                    className="text-emerald-700 font-semibold underline hover:text-emerald-900"
                  >
                    Cookie Policy
                  </Link>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Legal Basis & Purpose */}
          <section className="border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">03.</span>
              Legal Basis and Purpose of Processing
            </h2>
            <ul className="space-y-3 text-sm sm:text-base list-disc list-inside text-slate-600 pl-1">
              <li>
                <strong className="text-slate-800">Operational Delivery &amp; Security:</strong> Processing
                technical connection data is necessary for the legitimate interest of the Data Controller to
                ensure network security, prevent cyber attacks, and maintain web platform availability (Art.
                6(1)(f) GDPR).
              </li>
              <li>
                <strong className="text-slate-800">Scientific Communication:</strong> Presentation of conference
                programmes, abstracts, and speaker credentials serves the legitimate statutory interest of the
                Foundation in fostering non-profit medical and scientific research (Art. 6(1)(f) GDPR).
              </li>
            </ul>
          </section>

          {/* Section 4: Data Retention */}
          <section className="border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">04.</span>
              Data Retention Periods
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Technical server connection logs are retained for no longer than necessary to verify server
              integrity and security incidents (typically up to 30 days), after which they are deleted or
              irreversibly anonymized. Scientific conference schedules and abstract archives remain accessible
              for historical reference and scientific documentation.
            </p>
          </section>

          {/* Section 5: Data Subject Rights */}
          <section className="border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-700 font-mono text-base">05.</span>
              Your Rights Under GDPR (Articles 15-22)
            </h2>
            <p className="text-sm sm:text-base mb-3 text-slate-600">
              As an interested data subject, you have the right to exercise at any time the rights guaranteed
              under Chapter III of the GDPR:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">Right of Access (Art. 15)</span>
                <span className="text-slate-600">Confirm whether your data is being processed and obtain copies.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">Right to Rectification (Art. 16)</span>
                <span className="text-slate-600">Request correction of inaccurate or incomplete information.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">Right to Erasure (Art. 17)</span>
                <span className="text-slate-600">Request deletion of data where legal grounds apply.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">Right to Object (Art. 21)</span>
                <span className="text-slate-600">Object at any time to processing based on legitimate interests.</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-4">
              You also have the right to lodge a formal complaint with the supervisory authority (in Italy:
              <em> Garante per la protezione dei dati personali</em>,{' '}
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                www.garanteprivacy.it
              </a>).
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
