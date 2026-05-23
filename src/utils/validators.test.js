import { describe, it, expect } from 'vitest'
import { validateManualPrediction, FIELD_RULES } from './validators'

describe('validateManualPrediction', () => {
  const ok = { pm25: '15', pm10: '40', pm1: '8', temperature: '30', humidity: '70' }

  it('returns no errors for valid input', () => {
    expect(validateManualPrediction(ok)).toEqual({})
  })
  it('flags missing required field', () => {
    const errors = validateManualPrediction({ ...ok, pm25: '' })
    expect(errors.pm25).toMatch(/requerido/i)
  })
  it('flags non-numeric value', () => {
    const errors = validateManualPrediction({ ...ok, temperature: 'abc' })
    expect(errors.temperature).toMatch(/número/i)
  })
  it('flags out-of-range value', () => {
    const errors = validateManualPrediction({ ...ok, humidity: '150' })
    expect(errors.humidity).toMatch(/entre/i)
  })
})

describe('FIELD_RULES', () => {
  it('exposes a rule per known feature', () => {
    expect(Object.keys(FIELD_RULES)).toEqual(['pm25', 'pm10', 'pm1', 'temperature', 'humidity'])
  })
})
