import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatSensorValue(value, unit, decimals = 1) {
  if (value === null || value === undefined) return 'N/D'
  return `${Number(value).toFixed(decimals)} ${unit}`
}

export function formatDateTime(isoString) {
  if (!isoString) return '—'
  return format(parseISO(isoString), "d 'de' MMMM, HH:mm", { locale: es })
}

const FEATURE_NAMES = {
  pm25: 'PM 2.5',
  pm10: 'PM 10',
  pm1:  'PM 1.0',
  temperature: 'Temperatura',
  humidity: 'Humedad',
  co2: 'CO₂',
  no2: 'NO₂',
  noise: 'Ruido',
  battery: 'Batería',
}

export function formatFeatureName(key) {
  return FEATURE_NAMES[key] ?? key
}
