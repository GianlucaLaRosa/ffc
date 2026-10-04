/** Minutes since midnight (UTC components — consistent for Payload timeOnly ISO values). */
export const minutesUtc = (value: string | Date): number => {
  const date = value instanceof Date ? value : new Date(value)
  return date.getUTCHours() * 60 + date.getUTCMinutes()
}

/** Minutes since midnight in local time (for react-datepicker filterTime). */
export const minutesLocal = (value: string | Date): number => {
  const date = value instanceof Date ? value : new Date(value)
  return date.getHours() * 60 + date.getMinutes()
}

export const isOvernightWindow = (startMinutes: number, endMinutes: number): boolean =>
  endMinutes < startMinutes

/** Whether `timeMinutes` falls inside [start, end], supporting overnight windows. */
export const isTimeWithinWindow = (
  timeMinutes: number,
  startMinutes: number,
  endMinutes: number,
): boolean => {
  if (isOvernightWindow(startMinutes, endMinutes)) {
    return timeMinutes >= startMinutes || timeMinutes <= endMinutes
  }
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes
}

/**
 * Duration in minutes from start→end.
 * If end is before start, treats the span as overnight (crosses midnight).
 */
export const durationMinutes = (start: string, end: string): number | null => {
  const startMin = minutesUtc(start)
  const endMin = minutesUtc(end)
  if (Number.isNaN(startMin) || Number.isNaN(endMin)) return null

  if (endMin >= startMin) return endMin - startMin
  return 24 * 60 - startMin + endMin
}

export const formatMinutesLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}
