import type { CollectionBeforeChangeHook, PayloadRequest } from 'payload'

import {
  ensureMediaFolder,
  folderNameFromRequest,
} from '@/utilities/mediaFolder'

function isMediaAdminCreate(req: PayloadRequest): boolean {
  const referer =
    typeof req.headers?.get === 'function'
      ? req.headers.get('referer')
      : typeof (req.headers as { referer?: string } | undefined)?.referer ===
          'string'
        ? (req.headers as unknown as { referer?: string }).referer ?? null
        : null

  return Boolean(referer?.includes('/admin/collections/media'))
}

export const assignFolderOnCreate: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data) return data
  if (data.folder != null && data.folder !== '') return data
  if (isMediaAdminCreate(req)) return data

  const folderName = folderNameFromRequest(req)
  if (!folderName) return data

  try {
    data.folder = await ensureMediaFolder({
      folderName,
      payload: req.payload,
      req,
    })
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Failed to assign new media to folder ${folderName}`,
    })
  }

  return data
}
