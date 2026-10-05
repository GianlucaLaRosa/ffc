import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { DOCS_DEFAULT_LOCALE, isDocsLocale } from '@/i18n/docsLocales'

const COOKIE_NAME = 'NEXT_LOCALE'

function preferredLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value
  if (cookieLocale && isDocsLocale(cookieLocale)) return cookieLocale
  return DOCS_DEFAULT_LOCALE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const localized = pathname.match(/^\/(en|it)\/docs(\/.*)?$/)

  if (localized) {
    const locale = localized[1]
    if (request.cookies.get(COOKIE_NAME)?.value !== locale) {
      const response = NextResponse.next()
      response.cookies.set(COOKIE_NAME, locale)
      return response
    }
    return
  }

  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    const locale = preferredLocale(request)
    const rest = pathname === '/docs' ? '' : pathname.slice('/docs'.length)
    return NextResponse.redirect(new URL(`/${locale}/docs${rest}`, request.url))
  }
}

export const config = {
  matcher: ['/docs', '/docs/:path*', '/en/docs', '/en/docs/:path*', '/it/docs', '/it/docs/:path*'],
}
