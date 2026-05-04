import { AQI_LEVELS } from '../constants/aqi'

const BREAKPOINTS = [
  { cLow: 0.0,   cHigh: 12.0,  iLow: 0,   iHigh: 50  },
  { cLow: 12.1,  cHigh: 35.4,  iLow: 51,  iHigh: 100 },
  { cLow: 35.5,  cHigh: 55.4,  iLow: 101, iHigh: 150 },
  { cLow: 55.5,  cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
]

export function calculateAQIFromPM25(pm25) {
  if (pm25 == null || pm25 < 0) return null
  if (pm25 > 500.4) return 500
  // Inclusive upper-bound match using cHigh; falls through to last segment.
  const bp = BREAKPOINTS.find(b => pm25 <= b.cHigh) ?? BREAKPOINTS[BREAKPOINTS.length - 1]
  const cLow = pm25 < bp.cLow ? bp.cLow : pm25 < BREAKPOINTS[0].cLow ? 0 : bp.cLow
  return Math.round(
    ((bp.iHigh - bp.iLow) / (bp.cHigh - cLow)) * (pm25 - cLow) + bp.iLow
  )
}

export function getAQILevel(aqi) {
  return AQI_LEVELS.find(l => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1]
}
