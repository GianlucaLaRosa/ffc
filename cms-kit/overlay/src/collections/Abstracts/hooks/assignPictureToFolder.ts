import type { CollectionAfterChangeHook } from 'payload'

import {
  ABSTRACT_PICTURES_FOLDER_NAME,
  assignMediaToFolder,
  mediaIdFromUpload,
} from '@/utilities/mediaFolder'

export const assignPictureToFolder: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const rows = Array.isArray(doc.picture) ? doc.picture : []

  for (const row of rows) {
    const pictureId = mediaIdFromUpload(
      (row as { image?: unknown } | null | undefined)?.image,
    )
    if (pictureId == null) continue

    try {
      await assignMediaToFolder({
        folderName: ABSTRACT_PICTURES_FOLDER_NAME,
        mediaId: pictureId,
        payload: req.payload,
        req,
      })
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: `Failed to move abstract picture ${pictureId} into ${ABSTRACT_PICTURES_FOLDER_NAME} folder`,
      })
    }
  }

  return doc
}
