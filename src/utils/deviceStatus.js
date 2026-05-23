import { differenceInMinutes } from 'date-fns'

export function getDeviceStatus(lastReadingAt, now = new Date()) {
  if (!lastReadingAt) return 'offline'
  const minutes = differenceInMinutes(now, new Date(lastReadingAt))
  if (minutes < 5) return 'online'
  if (minutes < 30) return 'stale'
  return 'offline'
}
