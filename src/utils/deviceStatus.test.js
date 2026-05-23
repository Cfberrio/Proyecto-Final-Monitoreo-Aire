import { describe, it, expect } from 'vitest'
import { getDeviceStatus } from './deviceStatus'

const NOW = new Date('2026-05-03T12:00:00Z')

describe('getDeviceStatus', () => {
  it('returns "offline" when lastReadingAt is null', () => {
    expect(getDeviceStatus(null, NOW)).toBe('offline')
  })
  it('returns "online" when reading is < 5 minutes old', () => {
    const t = new Date(NOW.getTime() - 2 * 60_000).toISOString()
    expect(getDeviceStatus(t, NOW)).toBe('online')
  })
  it('returns "stale" between 5 and 30 minutes', () => {
    const t = new Date(NOW.getTime() - 10 * 60_000).toISOString()
    expect(getDeviceStatus(t, NOW)).toBe('stale')
  })
  it('returns "offline" when reading > 30 minutes old', () => {
    const t = new Date(NOW.getTime() - 60 * 60_000).toISOString()
    expect(getDeviceStatus(t, NOW)).toBe('offline')
  })
})
