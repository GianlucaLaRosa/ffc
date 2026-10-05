import type { GlobalAfterChangeHook } from 'payload'

import {
  assignMediaToFolder,
  mediaIdFromUpload,
  PARTNER_LOGOS_FOLDER_NAME,
} from '@/utilities/mediaFolder'

export const assignPartnerLogosToFolder: GlobalAfterChangeHook = async ({
  doc,
  req,
}) => {
  const rows = Array.isArray(doc.partners) ? doc.partners : []

  for (const row of rows) {
    const mediaId = mediaIdFromUpload(
      (row as { image?: unknown } | null | undefined)?.image,
    )
    if (mediaId == null) continue

    try {
      await assignMediaToFolder({
        folderName: PARTNER_LOGOS_FOLDER_NAME,
        mediaId,
        payload: req.payload,
        req,
      })
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: `Failed to move partner logo ${mediaId} into ${PARTNER_LOGOS_FOLDER_NAME} folder`,
      })
    }
  }

  return doc
}
