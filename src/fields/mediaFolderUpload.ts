/**
 * Marks an upload field so new media created from it land in a named folder.
 */
export function mediaFolderUploadAdmin(folderName: string, admin: object = {}) {
  const current = admin as { components?: { afterInput?: unknown[] } }
  return {
    ...current,
    components: {
      ...current.components,
      afterInput: [
        {
          clientProps: { folderName },
          path: '@/components/admin/AssignUploadFolder',
        },
      ],
    },
  }
}
