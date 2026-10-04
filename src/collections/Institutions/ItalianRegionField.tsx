'use client'

import type { RelationshipFieldClientComponent } from 'payload'
import { RelationshipField, useField, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

const ITALY_NAME = 'Italy'

const toCountryId = (value: unknown): string | number | null => {
  if (value == null || value === '') return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: string | number }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

const countryNameFromValue = (value: unknown): string | null => {
  if (typeof value === 'object' && value !== null && 'name' in value) {
    const name = (value as { name?: unknown }).name
    return typeof name === 'string' ? name : null
  }
  return null
}

/**
 * Shows the Italian region relationship only when the selected country is Italy.
 */
export const ItalianRegionField: RelationshipFieldClientComponent = (props) => {
  const { path } = props
  const { setValue } = useField({ path })
  const countryValue = useFormFields(([fields]) => fields.country?.value)

  const [isItaly, setIsItaly] = useState(false)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    let cancelled = false

    const resolve = async () => {
      setResolved(false)

      const embeddedName = countryNameFromValue(countryValue)
      if (embeddedName != null) {
        if (!cancelled) {
          setIsItaly(embeddedName === ITALY_NAME)
          setResolved(true)
        }
        return
      }

      const countryId = toCountryId(countryValue)
      if (countryId == null) {
        if (!cancelled) {
          setIsItaly(false)
          setResolved(true)
        }
        return
      }

      try {
        const params = new URLSearchParams({
          depth: '0',
          'select[name]': 'true',
        })
        const res = await fetch(`/api/countries/${countryId}?${params.toString()}`)
        if (!res.ok) {
          if (!cancelled) {
            setIsItaly(false)
            setResolved(true)
          }
          return
        }
        const data = (await res.json()) as { name?: string }
        if (!cancelled) {
          setIsItaly(data.name === ITALY_NAME)
          setResolved(true)
        }
      } catch {
        if (!cancelled) {
          setIsItaly(false)
          setResolved(true)
        }
      }
    }

    void resolve()
    return () => {
      cancelled = true
    }
  }, [countryValue])

  useEffect(() => {
    if (resolved && !isItaly) {
      setValue(null, true)
    }
  }, [isItaly, resolved, setValue])

  if (!resolved || !isItaly) return null

  return <RelationshipField {...props} />
}
