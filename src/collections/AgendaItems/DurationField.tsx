'use client'

import { FieldDescription, FieldLabel, useFormFields } from '@payloadcms/ui'

import { formatMinutesLabel, minutesLocal } from './timeUtils'

const toTimeValue = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString()
  return null
}

const liveDurationMinutes = (start: string, end: string): number | null => {
  const startMin = minutesLocal(start)
  const endMin = minutesLocal(end)
  if (Number.isNaN(startMin) || Number.isNaN(endMin)) return null
  if (endMin >= startMin) return endMin - startMin
  return 24 * 60 - startMin + endMin
}

type DurationFieldProps = {
  field: {
    admin?: {
      className?: string
      description?: string
    }
    label?: string
  }
  path: string
}

/**
 * Live duration from start/end times in the form (updates as soon as both are set).
 */
export const DurationField = (props: DurationFieldProps) => {
  const {
    field: {
      admin: { className, description } = {},
      label,
    },
    path,
  } = props

  const startTime = useFormFields(([fields]) => toTimeValue(fields.startTime?.value))
  const endTime = useFormFields(([fields]) => toTimeValue(fields.endTime?.value))
  const minutes = startTime && endTime ? liveDurationMinutes(startTime, endTime) : null

  return (
    <div className={['field-type', className].filter(Boolean).join(' ')}>
      <FieldLabel label={label ?? 'Duration'} path={path} />
      <div className="field-type__wrap">
        <p style={{ fontSize: 14, margin: '0 0 4px' }}>
          {minutes == null ? (
            <span style={{ color: 'var(--theme-elevation-500)' }}>
              Compare quando Start time e End time sono entrambi impostati
            </span>
          ) : (
            <>
              <strong>{minutes}</strong>
              <span style={{ color: 'var(--theme-elevation-500)' }}>
                {' '}
                min ({formatMinutesLabel(minutes)})
              </span>
            </>
          )}
        </p>
        {typeof description === 'string' ? (
          <FieldDescription description={description} path={path} />
        ) : null}
      </div>
    </div>
  )
}
