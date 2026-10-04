'use client'

import { useBulkUpload, useConfig } from '@payloadcms/ui'
import { useEffect } from 'react'

import {
  isManagedMediaFolderName,
  UPLOAD_FOLDER_COOKIE,
} from '@/utilities/mediaFolder'

type Props = {
  folderName: string
  path?: string
}

function fieldElementId(path: string): string {
  return `field-${path.replace(/\./g, '__')}`
}

function markUploadFolder(folderName: string) {
  document.cookie = `${UPLOAD_FOLDER_COOKIE}=${encodeURIComponent(folderName)}; Path=/; SameSite=Lax; Max-Age=600`
}

export default function AssignUploadFolder({ folderName, path }: Props) {
  const { setFolderID } = useBulkUpload()
  const {
    config: {
      routes: { api },
    },
  } = useConfig()

  useEffect(() => {
    if (!isManagedMediaFolderName(folderName)) return

    let cancelled = false

    const loadFolderId = async () => {
      const params = new URLSearchParams({
        depth: '0',
        limit: '1',
        'where[name][equals]': folderName,
      })
      const response = await fetch(`${api}/payload-folders?${params}`, {
        credentials: 'include',
      })
      if (!response.ok) return
      const json = (await response.json()) as { docs?: { id?: number }[] }
      const id = json.docs?.[0]?.id
      if (id != null && !cancelled) setFolderID(id)
    }

    void loadFolderId()

    return () => {
      cancelled = true
    }
  }, [api, folderName, setFolderID])

  useEffect(() => {
    if (!isManagedMediaFolderName(folderName) || !path) return

    const root = document.getElementById(fieldElementId(path))
    if (!root) return

    const mark = () => markUploadFolder(folderName)
    root.addEventListener('pointerdown', mark)
    root.addEventListener('focusin', mark)

    return () => {
      root.removeEventListener('pointerdown', mark)
      root.removeEventListener('focusin', mark)
    }
  }, [folderName, path])

  return null
}
