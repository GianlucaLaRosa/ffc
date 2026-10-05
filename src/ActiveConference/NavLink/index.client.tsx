'use client'

import { Link, useTranslation } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'
import { asT } from '@/i18n/asT'

const baseClass = 'nav'

type Props = {
  adminRoute: string
  conferenceTitle: string | null
}

export function ActiveConferenceNavLinkClient({ adminRoute, conferenceTitle }: Props) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const href = formatAdminURL({
    adminRoute,
    path: '/globals/active-conference',
  })
  const isActive = pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])
  const label = conferenceTitle
    ? `${asT(t)('fcr:activeConference')} · ${conferenceTitle}`
    : asT(t)('fcr:activeConference')

  const content = (
    <>
      {isActive && <div className={`${baseClass}__link-indicator`} />}
      <span className={`${baseClass}__link-label`}>{label}</span>
    </>
  )

  if (pathname === href) {
    return (
      <div className={`${baseClass}__link`} id="nav-global-active-conference">
        {content}
      </div>
    )
  }

  return (
    <Link className={`${baseClass}__link`} href={href} id="nav-global-active-conference">
      {content}
    </Link>
  )
}
