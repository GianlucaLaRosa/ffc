'use client'

import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type RelatedCodeRow = {
  code?: string | null
}

export const RelatedCodeRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<RelatedCodeRow>()
  const code = data?.data?.code?.trim()
  const n = data.rowNumber !== undefined ? data.rowNumber + 1 : ''

  return <div>{code ? `${n}. ${code}` : `Related code ${n}`}</div>
}
