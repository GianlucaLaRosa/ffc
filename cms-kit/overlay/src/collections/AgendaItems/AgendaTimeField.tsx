'use client'

import type { DateFieldClientComponent } from 'payload'
import {
  DatePicker,
  FieldDescription,
  FieldError,
  FieldLabel,
  useField,
  useFormFields,
  usePayloadAPI,
} from '@payloadcms/ui'
import type { ComponentProps } from 'react'
import { useEffect, useMemo } from 'react'

import { isTimeWithinWindow, minutesLocal } from './timeUtils'

type DatePickerAdmin = Pick<
  ComponentProps<typeof DatePicker>,
  'displayFormat' | 'overrides' | 'timeFormat' | 'timeIntervals'
>

type DayTimes = {
  startTime?: string | null
  endTime?: string | null
}

const toDayId = (value: unknown): string | number | null => {
  if (value == null || value === '') return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: string | number }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

const formatHm = (date: Date): string =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

export const AgendaTimeField: DateFieldClientComponent = (props) => {
  const {
    field: {
      admin: { className, date: dateAdmin, description } = {},
      label,
      localized,
      required,
    },
    path: pathFromProps,
    readOnly,
  } = props

  const datePickerProps = (dateAdmin ?? {}) as DatePickerAdmin

  const { path, setValue, showError, value } = useField<string | null>({
    potentiallyStalePath: pathFromProps,
  })

  const dayValue = useFormFields(([fields]) => fields.day?.value)
  const dayId = toDayId(dayValue)

  const [{ data: dayDoc, isLoading }, { setParams }] = usePayloadAPI(
    dayId != null ? `/api/conference-days/${dayId}` : '/api/conference-days',
    {
      initialParams: {
        depth: 0,
        draft: true,
      },
    },
  )

  useEffect(() => {
    setParams({
      depth: 0,
      draft: true,
    })
  }, [dayId, setParams])

  const dayTimes = (dayId != null ? dayDoc : null) as DayTimes | null

  const bounds = useMemo(() => {
    if (!dayTimes?.startTime || !dayTimes?.endTime) return null
    return {
      start: new Date(dayTimes.startTime),
      end: new Date(dayTimes.endTime),
      startMinutes: minutesLocal(dayTimes.startTime),
      endMinutes: minutesLocal(dayTimes.endTime),
    }
  }, [dayTimes?.endTime, dayTimes?.startTime])

  // Clear the time if the day changes and the current value falls outside the window.
  useEffect(() => {
    if (!value || !bounds) return
    if (!isTimeWithinWindow(minutesLocal(value), bounds.startMinutes, bounds.endMinutes)) {
      setValue(null)
    }
  }, [bounds, setValue, value])

  if (!dayId) {
    return (
      <div className={['field-type', 'date-time-field', className].filter(Boolean).join(' ')}>
        <FieldLabel label={label} localized={localized} path={path} required={required} />
        <div className="field-type__wrap">
          <p style={{ color: 'var(--theme-elevation-500)', fontSize: 13, margin: 0 }}>
            Select a conference day first to choose a time within that day&apos;s hours.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading || !bounds) {
    return (
      <div className={['field-type', 'date-time-field', className].filter(Boolean).join(' ')}>
        <FieldLabel label={label} localized={localized} path={path} required={required} />
        <div className="field-type__wrap">
          <p style={{ color: 'var(--theme-elevation-500)', fontSize: 13, margin: 0 }}>
            Loading day hours…
          </p>
        </div>
      </div>
    )
  }

  const overnight = bounds.endMinutes < bounds.startMinutes

  return (
    <div
      className={['field-type', 'date-time-field', className, showError && 'error']
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel label={label} localized={localized} path={path} required={required} />
      <div className="field-type__wrap" id={`field-${path.replace(/\./g, '__')}`}>
        <FieldError path={path} showError={showError} />
        <DatePicker
          displayFormat={datePickerProps?.displayFormat ?? 'HH:mm'}
          onChange={(incoming: Date | null) => {
            if (readOnly) return
            setValue(incoming?.toISOString() ?? null)
          }}
          overrides={{
            ...datePickerProps?.overrides,
            filterTime: (time: Date) =>
              isTimeWithinWindow(minutesLocal(time), bounds.startMinutes, bounds.endMinutes),
            ...(overnight
              ? {}
              : {
                  maxTime: bounds.end,
                  minTime: bounds.start,
                }),
          }}
          pickerAppearance="timeOnly"
          readOnly={Boolean(readOnly)}
          timeFormat={datePickerProps?.timeFormat ?? 'HH:mm'}
          timeIntervals={datePickerProps.timeIntervals ?? 5}
          value={value ?? undefined}
        />
        {description ? <FieldDescription description={description} path={path} /> : null}
        <FieldDescription
          description={
            overnight
              ? `Allowed times: within this overnight day (${formatHm(bounds.start)} → ${formatHm(bounds.end)}).`
              : `Allowed times: ${formatHm(bounds.start)} – ${formatHm(bounds.end)} (from the selected day).`
          }
          path={`${path}-day-bounds`}
        />
      </div>
    </div>
  )
}
