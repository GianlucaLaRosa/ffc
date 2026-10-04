'use client'

import type { RelationshipFieldClientComponent } from 'payload'
import { RelationshipField, useField, useForm, useFormFields } from '@payloadcms/ui'
import { useEffect, useRef } from 'react'

const toStatusId = (value: unknown): string | number | null => {
  if (value == null || value === '') return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: string | number }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

const titlesFromStatusValue = (value: unknown): string[] | null => {
  if (typeof value !== 'object' || value === null || !('defaultContent' in value)) return null
  const rows = (value as { defaultContent?: unknown }).defaultContent
  if (!Array.isArray(rows)) return null
  return rows
    .map((row) => {
      if (typeof row !== 'object' || row === null) return null
      const title = (row as { title?: unknown }).title
      return typeof title === 'string' && title.trim() ? title : null
    })
    .filter((title): title is string => title != null)
}

const contentIsEmpty = (value: unknown): boolean =>
  value == null || (Array.isArray(value) && value.length === 0)

/**
 * When status is selected and content has no rows yet, seed the default abstract sections.
 */
export const AbstractStatusField: RelationshipFieldClientComponent = (props) => {
  const { path } = props
  const { value: statusValue } = useField({ path })
  const { addFieldRow, getDataByPath } = useForm()
  const contentRows = useFormFields(([fields]) => fields.content?.rows)

  const previousStatusIdRef = useRef<string | number | null | undefined>(undefined)
  const seededForStatusIdRef = useRef<string | number | null>(null)

  useEffect(() => {
    let cancelled = false

    const statusId = toStatusId(statusValue)

    // Skip initial mount so opening an existing doc does not re-seed.
    if (previousStatusIdRef.current === undefined) {
      previousStatusIdRef.current = statusId
      return
    }

    if (statusId == null || statusId === previousStatusIdRef.current) {
      previousStatusIdRef.current = statusId
      return
    }

    previousStatusIdRef.current = statusId

    const seed = async () => {
      const currentContent = getDataByPath('content')
      const hasRows =
        !contentIsEmpty(currentContent) ||
        (Array.isArray(contentRows) && contentRows.length > 0)

      if (hasRows) return
      if (seededForStatusIdRef.current === statusId) return

      let titles = titlesFromStatusValue(statusValue)

      if (titles == null) {
        try {
          const params = new URLSearchParams({
            depth: '0',
            'select[defaultContent]': 'true',
          })
          const res = await fetch(`/api/abstract-statuses/${statusId}?${params.toString()}`)
          if (!res.ok) return
          const data = (await res.json()) as { defaultContent?: unknown }
          titles = titlesFromStatusValue({ defaultContent: data.defaultContent }) ?? []
        } catch {
          return
        }
      }

      if (cancelled || titles.length === 0) return

      // Re-check emptiness after the async fetch.
      const contentAfterFetch = getDataByPath('content')
      if (!contentIsEmpty(contentAfterFetch)) return

      seededForStatusIdRef.current = statusId

      titles.forEach((title, rowIndex) => {
        addFieldRow({
          path: 'content',
          rowIndex,
          schemaPath: 'content',
          subFieldState: {
            title: {
              initialValue: title,
              valid: true,
              value: title,
            },
            description: {
              initialValue: null,
              valid: true,
              value: null,
            },
          },
        })
      })
    }

    void seed()

    return () => {
      cancelled = true
    }
  }, [addFieldRow, contentRows, getDataByPath, statusValue])

  return <RelationshipField {...props} />
}
