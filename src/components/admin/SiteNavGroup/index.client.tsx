'use client'

import { NavGroup, useTranslation } from '@payloadcms/ui'
import React from 'react'
import { asT } from '@/i18n/asT'

type Props = {
  children: React.ReactNode
}

export function SiteNavGroupClient({ children }: Props) {
  const { t } = useTranslation()
  return <NavGroup label={asT(t)('fcr:site')}>{children}</NavGroup>
}
