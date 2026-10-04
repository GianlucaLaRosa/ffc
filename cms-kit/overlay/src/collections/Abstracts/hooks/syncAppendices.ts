import type { CollectionBeforeValidateHook } from 'payload'

type AppendixRow = {
  id?: string | null
  title?: string | null
  body?: unknown
}

const emptyRow = (): AppendixRow => ({ title: null, body: null })

/**
 * Keep appendices length at 1 (primary) + relatedCodes.length.
 * Index 0 = primary code/status; index n>=1 = relatedCodes[n-1].
 */
export const syncAppendices: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data

  const codes =
    data.relatedCodes !== undefined ? data.relatedCodes : originalDoc?.relatedCodes
  const codesLen = Array.isArray(codes) ? codes.length : 0
  const target = 1 + codesLen

  const existing =
    data.appendices !== undefined ? data.appendices : originalDoc?.appendices

  const current: AppendixRow[] = Array.isArray(existing)
    ? existing.map((row) => ({ ...(row as AppendixRow) }))
    : []

  if (current.length === target) return data

  if (current.length < target) {
    while (current.length < target) {
      current.push(emptyRow())
    }
  } else {
    current.length = target
  }

  data.appendices = current
  return data
}
