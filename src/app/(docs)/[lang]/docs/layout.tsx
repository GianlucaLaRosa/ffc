import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style-prefixed.css'

import {
  DOCS_DEFAULT_LOCALE,
  docsLocaleNames,
  docsPath,
  isDocsLocale,
  type DocsLocale,
} from '@/i18n/docsLocales'
import { requireCmsUser } from '@/utilities/requireCmsUser'

import { filterDocsPageMap } from './filterDocsPageMap'

export const dynamic = 'force-dynamic'

const copy: Record<
  DocsLocale,
  {
    titleDefault: string
    titleTemplate: string
    description: string
    logo: string
    footer: string
    openPanel: string
    lastUpdated: string
    dark: string
    light: string
    system: string
    toc: string
    backToTop: string
  }
> = {
  en: {
    titleDefault: 'Conference handbook',
    titleTemplate: '%s · FFC Ricerca guide',
    description: 'How to create and manage FFC Ricerca conference editions from the admin panel.',
    logo: 'FFC Ricerca guide',
    footer: 'This handbook is for people with a panel account.',
    openPanel: 'Open the panel',
    lastUpdated: 'Last updated',
    dark: 'Dark',
    light: 'Light',
    system: 'System',
    toc: 'On this page',
    backToTop: 'Back to top',
  },
  it: {
    titleDefault: 'Guida alle conferenze',
    titleTemplate: '%s · Guida FFC Ricerca',
    description:
      'Come creare e gestire le edizioni della conferenza FFC Ricerca dal pannello di amministrazione.',
    logo: 'Guida FFC Ricerca',
    footer: 'Guida riservata a chi ha un account sul pannello.',
    openPanel: 'Apri il pannello',
    lastUpdated: 'Ultimo aggiornamento',
    dark: 'Scuro',
    light: 'Chiaro',
    system: 'Sistema',
    toc: 'In questa pagina',
    backToTop: 'Torna su',
  },
}

type LayoutProps = {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { lang } = await params
  const locale = isDocsLocale(lang) ? lang : DOCS_DEFAULT_LOCALE
  const strings = copy[locale]
  return {
    title: {
      default: strings.titleDefault,
      template: strings.titleTemplate,
    },
    description: strings.description,
    icons: {
      icon: [{ url: '/brand/ffc-ricerca-32.png', type: 'image/png' }],
      apple: [{ url: '/brand/ffc-ricerca.png', type: 'image/png' }],
    },
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function DocsLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  if (!isDocsLocale(lang)) notFound()

  const strings = copy[lang]
  const home = docsPath(lang)
  await requireCmsUser(home)
  const pageMap = filterDocsPageMap(await getPageMap(`/${lang}`))

  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={
            <Navbar
              logo={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img
                    alt=""
                    height={28}
                    src="/brand/ffc-ricerca-32.png"
                    style={{ borderRadius: 4 }}
                    width={28}
                  />
                  <span style={{ fontWeight: 700 }}>{strings.logo}</span>
                </span>
              }
              logoLink={home}
            />
          }
          footer={
            <Footer>
              {strings.footer} <a href="/admin">{strings.openPanel}</a>
            </Footer>
          }
          pageMap={pageMap}
          copyPageButton={false}
          search={null}
          docsRepositoryBase="https://github.com/shuding/nextra"
          editLink={null}
          feedback={{ content: null }}
          i18n={docsLocaleNames}
          lastUpdated={<LastUpdated locale={lang}>{strings.lastUpdated}</LastUpdated>}
          nextThemes={{
            defaultTheme: 'system',
            storageKey: 'fcr-docs-theme',
          }}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          themeSwitch={{
            dark: strings.dark,
            light: strings.light,
            system: strings.system,
          }}
          toc={{
            title: strings.toc,
            backToTop: strings.backToTop,
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
