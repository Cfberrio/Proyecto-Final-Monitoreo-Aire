import { describe, it, expect } from 'vitest'
import { formatSensorValue, formatFeatureName } from './formatters'

describe('formatSensorValue', () => {
  it('returns "N/D" for null', () => expect(formatSensorValue(null, 'µg/m³')).toBe('N/D'))
  it('returns "N/D" for undefined', () => expect(formatSensorValue(undefined, 'µg/m³')).toBe('N/D'))
  it('formats with one decimal by default', () => expect(formatSensorValue(12.345, 'µg/m³')).toBe('12.3 µg/m³'))
  it('honors decimals argument', () => expect(formatSensorValue(12.345, '°C', 2)).toBe('12.35 °C'))
})

describe('formatFeatureName', () => {
  it('maps known keys', () => expect(formatFeatureName('pm25')).toBe('PM 2.5'))
  it('falls back to raw key', () => expect(formatFeatureName('xyz')).toBe('xyz'))
})
