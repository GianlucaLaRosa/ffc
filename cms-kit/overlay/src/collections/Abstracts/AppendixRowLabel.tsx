'use client'

import { RowLabelProps, useForm, useRowLabel } from '@payloadcms/ui'

type AppendixRow = {
  title?: string | null
}

type RelatedCodeRow = {
  code?: string | null
}

export const AppendixRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<AppendixRow>()
  const { getDataByPath } = useForm()
  const n = data.rowNumber
  const displayN = n !== undefined ? n + 1 : ''
  const title = data?.data?.title?.trim()

  if (n === 0) {
    const primaryCode = (getDataByPath('code') as string | null | undefined)?.trim()
    if (title) return <div>{`1. ${title}`}</div>
    if (primaryCode) return <div>{`1. ${primaryCode}`}</div>
    return <div>1. Primary</div>
  }

  const relatedCodes = getDataByPath('relatedCodes') as RelatedCodeRow[] | undefined
  const code =
    n !== undefined && Array.isArray(relatedCodes)
      ? relatedCodes[n - 1]?.code?.trim()
      : undefined

  if (title) return <div>{`${displayN}. ${title}`}</div>
  if (code) return <div>{`${displayN}. ${code}`}</div>
  return <div>{`Appendix ${displayN}`}</div>
}
