'use client'

import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

const baseClass = 'nav'

type Props = {
  adminRoute: string
  enabledCount: number
  totalCount: number
}

export function ConferenceArchiveNavLinkClient({
  adminRoute,
  enabledCount,
  totalCount,
}: Props) {
  const pathname = usePathname()
  const href = formatAdminURL({
    adminRoute,
    path: '/globals/conference-archive',
  })
  const isActive = pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])
  const label =
    totalCount > 0
      ? `Archivio conferenze · ${enabledCount}/${totalCount} pubbliche`
      : 'Archivio conferenze'

  const content = (
    <>
      {isActive && <div className={`${baseClass}__link-indicator`} />}
      <span className={`${baseClass}__link-label`}>{label}</span>
    </>
  )

  if (pathname === href) {
    return (
      <div className={`${baseClass}__link`} id="nav-global-conference-archive">
        {content}
      </div>
    )
  }

  return (
    <Link className={`${baseClass}__link`} href={href} id="nav-global-conference-archive">
      {content}
    </Link>
  )
}
