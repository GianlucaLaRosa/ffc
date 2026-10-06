import React from 'react'
import type { Metadata, Viewport } from 'next'
import { CookieConsentBanner } from '@/components/CookieConsentBanner'
import { ThemeProvider } from '@/components/ThemeProvider'
import { PwaProvider } from '@/components/PwaProvider'
import { conferenceFaviconIcons } from '@/utilities/conferenceFavicon'
import { cssHex } from '@/utilities/conferenceTheme'
import { getActiveConferenceBrand, getActiveConferenceLogo } from '@/utilities/getConferenceEdition'
import './styles.css'

export async function generateMetadata(): Promise<Metadata> {
  const logo = await getActiveConferenceLogo()
  return {
    title: 'FFC Scientific Conference - Official Programme & Abstracts',
    description: 'Official conference application for the Cystic Fibrosis Scientific Conference.',
    manifest: '/manifest.webmanifest',
    icons: conferenceFaviconIcons(logo),
    appleWebApp: {
      capable: true,
      title: 'FFC Conference',
      statusBarStyle: 'default',
    },
    applicationName: 'FFC Conference',
    formatDetection: {
      telephone: false,
    },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const { primaryColor } = await getActiveConferenceBrand()
  return {
    themeColor: cssHex(primaryColor),
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__pwaDeferredPrompt=e;});',
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <PwaProvider>
            <div id="app">{children}</div>
            <CookieConsentBanner />
          </PwaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
