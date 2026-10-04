/** Conference wall-clock timezone (Trieste / Italy). */
export const CONFERENCE_TIME_ZONE = 'Europe/Rome'

type TimeParts = {
  weekday: string
  day: string
  month: string
  monthShort: string
  year: string
  hour: string
  minute: string
  second: string
}

function pad2(value: string | number): string {
  return String(value).padStart(2, '0')
}

function partsInConferenceZone(
  date: Date,
  options: Intl.DateTimeFormatOptions,
): Record<string, string> {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CONFERENCE_TIME_ZONE,
    ...options,
  }).formatToParts(date)

  const map: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = part.value
  }
  return map
}

function conferenceParts(value: string): TimeParts | null {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const long = partsInConferenceZone(date, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const short = partsInConferenceZone(date, { month: 'short' })

  return {
    weekday: long.weekday ?? '',
    day: long.day ?? '',
    month: long.month ?? '',
    monthShort: short.month ?? '',
    year: long.year ?? '',
    hour: pad2(long.hour ?? '0'),
    minute: pad2(long.minute ?? '0'),
    second: pad2(long.second ?? '0'),
  }
}

/** HH:mm in Europe/Rome (stable across server and browser). */
export function formatConferenceTime(value?: string | null): string {
  if (!value) return ''
  const parts = conferenceParts(value)
  if (!parts) return ''
  return `${parts.hour}:${parts.minute}`
}

export function formatConferenceDayTitle(value: string): string {
  const parts = conferenceParts(value)
  if (!parts) return 'Conference day'
  return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year}`
}

export function formatConferenceDateRange(values: string[]): string {
  const dates = [...values]
    .filter((value) => !Number.isNaN(new Date(value).getTime()))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  if (dates.length === 0) return ''

  const start = conferenceParts(dates[0])
  const end = conferenceParts(dates[dates.length - 1])
  if (!start || !end) return ''

  if (start.year === end.year && start.month === end.month && start.day === end.day) {
    return `${end.day} ${end.monthShort} ${end.year}`
  }

  return `${start.day} ${start.monthShort} – ${end.day} ${end.monthShort} ${end.year}`
}

/**
 * Build an absolute instant from a calendar day + a time-only (or datetime) value,
 * using Europe/Rome wall clock so JSON-LD matches the public programme.
 */
export function conferenceDateTimeIso(dateValue: string, timeValue?: string | null): string | null {
  const day = new Date(dateValue)
  if (Number.isNaN(day.getTime())) return null

  const dayParts = partsInConferenceZone(day, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  let hour = '00'
  let minute = '00'
  let second = '00'
  if (timeValue) {
    const time = new Date(timeValue)
    if (!Number.isNaN(time.getTime())) {
      const timeParts = partsInConferenceZone(time, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      })
      hour = pad2(timeParts.hour ?? '0')
      minute = pad2(timeParts.minute ?? '0')
      second = pad2(timeParts.second ?? '0')
    }
  }

  const year = Number(dayParts.year)
  const month = Number(dayParts.month)
  const dayNum = Number(dayParts.day)
  if (!year || !month || !dayNum) return null

  const desiredUtcGuess = Date.UTC(
    year,
    month - 1,
    dayNum,
    Number(hour),
    Number(minute),
    Number(second),
  )

  const probe = new Date(desiredUtcGuess)
  const probeParts = partsInConferenceZone(probe, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const probeAsUtc = Date.UTC(
    Number(probeParts.year),
    Number(probeParts.month) - 1,
    Number(probeParts.day),
    Number(probeParts.hour),
    Number(probeParts.minute),
    Number(probeParts.second ?? '0'),
  )

  return new Date(desiredUtcGuess + (desiredUtcGuess - probeAsUtc)).toISOString()
}
