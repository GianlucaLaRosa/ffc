'use client'

import { Link, useTranslation } from '@payloadcms/ui'
import { Pencil } from 'lucide-react'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'
import { asT } from '@/i18n/asT'

import './index.scss'

type Props = {
  adminRoute: string
  conferenceId: number | string
  conferenceTitle: string | null
}

export function EditActiveEditionNavLinkClient({
  adminRoute,
  conferenceId,
  conferenceTitle,
}: Props) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const href = formatAdminURL({
    adminRoute,
    path: `/collections/conferences/${conferenceId}`,
  })
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  const label = asT(t)('fcr:editActiveEdition')

  const content = (
    <>
      <span aria-hidden className="edit-active-edition__icon">
        <Pencil size={15} strokeWidth={2.25} />
      </span>
      <span className="edit-active-edition__copy">
        <span className="edit-active-edition__label">{label}</span>
        {conferenceTitle ? (
          <span className="edit-active-edition__title">{conferenceTitle}</span>
        ) : null}
      </span>
    </>
  )

  const className = `edit-active-edition__link${isActive ? ' is-active' : ''}`

  if (isActive) {
    return (
      <div className="edit-active-edition">
        <div className={className} id="nav-edit-active-edition">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="edit-active-edition">
      <Link className={className} href={href} id="nav-edit-active-edition">
        {content}
      </Link>
    </div>
  )
}
