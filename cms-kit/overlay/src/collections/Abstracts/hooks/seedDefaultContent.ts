import type { CollectionBeforeValidateHook } from 'payload'

const toRelationId = (value: unknown): number | string | null => {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

const contentHasRows = (value: unknown): boolean => Array.isArray(value) && value.length > 0

const titlesFromDefaultContent = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .map((row) => {
      if (typeof row !== 'object' || row === null) return null
      const title = (row as { title?: unknown }).title
      return typeof title === 'string' && title.trim() ? title : null
    })
    .filter((title): title is string => title != null)
}

/**
 * When status is set/changed and content is empty, seed section rows from the
 * selected abstract status's `defaultContent` titles.
 */
export const seedDefaultContent: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data
  // Only act when status is part of this write (selection / create), not on unrelated saves.
  if (data.status === undefined) return data

  const content = data.content !== undefined ? data.content : originalDoc?.content
  if (contentHasRows(content)) return data

  const statusId = toRelationId(data.status)
  if (statusId == null) return data

  try {
    const statusDoc = await req.payload.findByID({
      collection: 'abstract-statuses',
      depth: 0,
      id: statusId,
      overrideAccess: true,
      req,
      select: { defaultContent: true },
    })

    const titles = titlesFromDefaultContent(statusDoc.defaultContent)
    if (titles.length === 0) return data

    data.content = titles.map((title) => ({ title, description: null }))
  } catch {
    // Unknown / deleted status — leave content unchanged.
  }

  return data
}
