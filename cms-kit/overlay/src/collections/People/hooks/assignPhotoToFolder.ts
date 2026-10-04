import type { CollectionAfterChangeHook } from 'payload'

import {
  assignMediaToFolder,
  mediaIdFromUpload,
  PEOPLE_PHOTOS_FOLDER_NAME,
} from '@/utilities/mediaFolder'

export const assignPhotoToFolder: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const photoId = mediaIdFromUpload(doc.photo)

  if (photoId == null) return doc

  try {
    await assignMediaToFolder({
      folderName: PEOPLE_PHOTOS_FOLDER_NAME,
      mediaId: photoId,
      payload: req.payload,
      req,
    })
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Failed to move people photo ${photoId} into ${PEOPLE_PHOTOS_FOLDER_NAME} folder`,
    })
  }

  return doc
}
