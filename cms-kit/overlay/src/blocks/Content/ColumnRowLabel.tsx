'use client'

import { useRowLabel } from '@payloadcms/ui'

const SIZE_LABEL: Record<string, string> = {
  full: 'Full',
  twoThirds: 'Two thirds',
  half: 'Half',
  oneThird: 'One third',
}

type ContentColumnRow = {
  size?: string | null
}

export const ContentColumnRowLabel: React.FC = () => {
  const data = useRowLabel<ContentColumnRow>()
  const n = data.rowNumber !== undefined ? data.rowNumber + 1 : ''
  const size = data?.data?.size
  const width = size && SIZE_LABEL[size] ? SIZE_LABEL[size] : 'Column'

  return <div>{n ? `${n}. ${width}` : width}</div>
}
