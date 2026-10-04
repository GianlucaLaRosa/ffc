'use client'

import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'

type KeyFactRow = {
  label?: string | null
  value?: string | null
}

export const KeyFactRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<KeyFactRow>()
  const n = data.rowNumber !== undefined ? data.rowNumber + 1 : ''
  const label = data.data?.label?.trim()
  const value = data.data?.value?.trim()

  if (label && value) return <div>{`${n}. ${label}: ${value}`}</div>
  if (label) return <div>{`${n}. ${label}`}</div>
  return <div>{`Fact ${n}`}</div>
}
