'use client'

import { useRowLabel } from '@payloadcms/ui'

type AccordionItemRow = {
  title?: string | null
}

export const AccordionItemRowLabel: React.FC = () => {
  const data = useRowLabel<AccordionItemRow>()
  const n = data.rowNumber !== undefined ? data.rowNumber + 1 : ''
  const title = data?.data?.title?.trim()

  return <div>{title ? `${n}. ${title}` : `Item ${n}`}</div>
}
