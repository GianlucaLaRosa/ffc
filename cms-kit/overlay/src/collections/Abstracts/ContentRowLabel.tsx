'use client'

import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type ContentRow = {
  title?: string | null
}

export const ContentRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<ContentRow>()
  const title = data?.data?.title?.trim()
  const n = data.rowNumber !== undefined ? data.rowNumber + 1 : ''

  return <div>{title ? `${n}. ${title}` : `Section ${n}`}</div>
}
