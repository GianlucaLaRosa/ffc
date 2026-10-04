import type { CollectionAfterChangeHook } from 'payload'

import {
  assignMediaToFolder,
  CONFERENCE_LOGOS_FOLDER_NAME,
  mediaIdFromUpload,
} from '@/utilities/mediaFolder'

export const assignLogoToFolder: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const logoId = mediaIdFromUpload(doc.logo)

  if (logoId == null) return doc

  try {
    await assignMediaToFolder({
      folderName: CONFERENCE_LOGOS_FOLDER_NAME,
      mediaId: logoId,
      payload: req.payload,
      req,
    })
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Failed to move conference logo ${logoId} into ${CONFERENCE_LOGOS_FOLDER_NAME} folder`,
    })
  }

  return doc
}
