'use client'

import { NavGroup } from '@payloadcms/ui'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export function SiteNavGroupClient({ children }: Props) {
  return <NavGroup label="Site">{children}</NavGroup>
}
