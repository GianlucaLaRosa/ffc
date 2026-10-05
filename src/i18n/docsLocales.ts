export const DOCS_LOCALES = ['en', 'it'] as const
export type DocsLocale = (typeof DOCS_LOCALES)[number]
export const DOCS_DEFAULT_LOCALE: DocsLocale = 'en'

export const docsLocaleNames: { locale: DocsLocale; name: string }[] = [
  { locale: 'en', name: 'English' },
  { locale: 'it', name: 'Italiano' },
]

export function isDocsLocale(value: string | undefined): value is DocsLocale {
  return value === 'en' || value === 'it'
}

export function docsPath(locale: DocsLocale, slug = ''): string {
  const suffix = slug ? `/${slug.replace(/^\//, '')}` : ''
  return `/${locale}/docs${suffix}`
}
