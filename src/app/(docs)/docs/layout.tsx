import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style-prefixed.css'

import { requireCmsUser } from '@/utilities/requireCmsUser'

import { filterDocsPageMap } from './filterDocsPageMap'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Guida alle conferenze',
    template: '%s · Guida FCR',
  },
  description:
    'Come creare e gestire le edizioni della conferenza FFC Ricerca dal pannello di amministrazione.',
  robots: {
    index: false,
    follow: false,
  },
}

const navbar = (
  <Navbar
    logo={<span style={{ fontWeight: 700 }}>Guida FCR</span>}
    logoLink="/docs"
  />
)

const footer = (
  <Footer>
    Guida riservata a chi ha un account sul pannello. <a href="/admin">Apri il pannello</a>
  </Footer>
)

export default async function DocsLayout({ children }: { children: ReactNode }) {
  await requireCmsUser('/docs')
  const pageMap = filterDocsPageMap(await getPageMap())

  return (
    <html lang="it" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={pageMap}
          copyPageButton={false}
          search={null}
          docsRepositoryBase="https://github.com/shuding/nextra"
          editLink={null}
          feedback={{ content: null }}
          lastUpdated={<LastUpdated locale="it">Ultimo aggiornamento</LastUpdated>}
          nextThemes={{
            defaultTheme: 'system',
            storageKey: 'fcr-docs-theme',
          }}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          themeSwitch={{
            dark: 'Scuro',
            light: 'Chiaro',
            system: 'Sistema',
          }}
          toc={{
            title: 'In questa pagina',
            backToTop: 'Torna su',
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
