import React from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export interface FooterProps {
  editionYear?: number | null
}

export function Footer({ editionYear = 2026 }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Privacy badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cookie-Free &amp; Privacy-First Platform</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <Link
              href="/cookie-policy"
              prefetch={false}
              className="font-medium text-slate-600 hover:text-emerald-800 transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/privacy"
              prefetch={false}
              className="font-medium text-slate-600 hover:text-emerald-800 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
