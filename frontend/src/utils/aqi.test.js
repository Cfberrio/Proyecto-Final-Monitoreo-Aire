import { describe, it, expect } from 'vitest'
import { calculateAQIFromPM25, getAQILevel } from './aqi'

describe('calculateAQIFromPM25', () => {
  it('returns 0 at PM2.5 = 0', () => {
    expect(calculateAQIFromPM25(0)).toBe(0)
  })
  it('returns 50 at PM2.5 = 12.0 (top of "Buena")', () => {
    expect(calculateAQIFromPM25(12.0)).toBe(50)
  })
  it('returns 100 at PM2.5 = 35.4 (top of "Moderada")', () => {
    expect(calculateAQIFromPM25(35.4)).toBe(100)
  })
  it('returns 150 at PM2.5 = 55.4', () => {
    expect(calculateAQIFromPM25(55.4)).toBe(150)
  })
  it('returns 200 at PM2.5 = 150.4', () => {
    expect(calculateAQIFromPM25(150.4)).toBe(200)
  })
  it('returns 300 at PM2.5 = 250.4', () => {
    expect(calculateAQIFromPM25(250.4)).toBe(300)
  })
  it('returns 500 above maximum range', () => {
    expect(calculateAQIFromPM25(700)).toBe(500)
  })
  it('returns null for negative values', () => {
    expect(calculateAQIFromPM25(-1)).toBeNull()
  })
})

describe('getAQILevel', () => {
  it('returns "Buena" for AQI 25', () => {
    expect(getAQILevel(25).label).toBe('Buena')
  })
  it('returns "Moderada" for AQI 75', () => {
    expect(getAQILevel(75).label).toBe('Moderada')
  })
  it('returns "Dañina" for AQI 175', () => {
    expect(getAQILevel(175).label).toBe('Dañina')
  })
  it('returns "Peligrosa" for AQI 450', () => {
    expect(getAQILevel(450).label).toBe('Peligrosa')
  })
  it('returns "Peligrosa" above 500', () => {
    expect(getAQILevel(900).label).toBe('Peligrosa')
  })
})
