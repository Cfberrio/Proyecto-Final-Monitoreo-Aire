import { describe, it, expect } from 'vitest'
import { needleAngleForAQI } from './AQIGauge'

describe('needleAngleForAQI', () => {
  it('returns -180° at AQI 0', () => expect(needleAngleForAQI(0)).toBeCloseTo(-180))
  it('returns -90° at AQI 250', () => expect(needleAngleForAQI(250)).toBeCloseTo(-90))
  it('returns 0° at AQI 500', () => expect(needleAngleForAQI(500)).toBeCloseTo(0))
  it('clamps above 500', () => expect(needleAngleForAQI(800)).toBeCloseTo(0))
  it('clamps below 0', () => expect(needleAngleForAQI(-50)).toBeCloseTo(-180))
})
