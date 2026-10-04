'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { getClientSideURL } from '@/utilities/getURL'

export function LivePreviewListener() {
  const router = useRouter()

  return <RefreshRouteOnSave refresh={router.refresh} serverURL={getClientSideURL()} />
}
