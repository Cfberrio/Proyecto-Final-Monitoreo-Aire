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
  temperatura: 'Temperatura',
  humidity: 'Humedad',
  humedad: 'Humedad',
  co2: 'CO₂',
  no2: 'NO₂',
  noise: 'Ruido',
  battery: 'Batería',
  velocidad_viento: 'Viento',
  hora_sin: 'Hora (sin)',
  hora_cos: 'Hora (cos)',
  dia_semana_sin: 'Día semana (sin)',
  dia_semana_cos: 'Día semana (cos)',
}

export function formatFeatureName(key) {
  if (FEATURE_NAMES[key]) return FEATURE_NAMES[key]
  return key
    .replace(/_juanmina/g, '')
    .replace(/pm25/g, 'PM 2.5')
    .replace(/pm10/g, 'PM 10')
    .replace(/_lag_/g, ' lag ')
    .replace(/_roll(\d+)_mean/g, ' media $1h')
    .replace(/_/g, ' ')
}
