import type { UploadField } from 'payload'

/**
 * Marks an upload field so new media created from it land in a named folder.
 */
export function mediaFolderUploadAdmin(
  folderName: string,
  admin: UploadField['admin'] = {},
): UploadField['admin'] {
  return {
    ...admin,
    components: {
      ...admin.components,
      afterInput: [
        {
          clientProps: { folderName },
          path: '@/components/admin/AssignUploadFolder',
        },
      ],
    },
  }
}
