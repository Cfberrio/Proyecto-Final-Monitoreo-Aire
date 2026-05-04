import { SENSOR_CONFIG } from '../constants/sensors'
import { calculateAQIFromPM25, getAQILevel } from '../utils/aqi'

const STATE = {}
const PREV = {}

function gauss(stdDev = 1) {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * stdDev
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function initSensor(id) {
  const cfg = SENSOR_CONFIG[id]
  const [min, max] = cfg.range
  STATE[id] = (min + max) / 2
  PREV[id] = STATE[id]
}

export function tick(id) {
  if (STATE[id] === undefined) initSensor(id)
  const cfg = SENSOR_CONFIG[id]
  const [min, max] = cfg.range
  const sigma = (max - min) * 0.03
  PREV[id] = STATE[id]
  STATE[id] = clamp(STATE[id] + gauss(sigma), min, max)
  return { value: Number(STATE[id].toFixed(2)), prev: Number(PREV[id].toFixed(2)) }
}

export function currentReading() {
  const sensors = Object.entries(SENSOR_CONFIG).map(([id, cfg]) => {
    const { value, prev } = tick(Number(id))
    return {
      sensor_id: Number(id),
      key: cfg.key,
      label: cfg.label,
      unit: cfg.unit,
      value,
      prev_value: prev,
    }
  })
  return {
    device_id: 'SCK-BQ-001',
    device_name: 'Barranquilla Norte',
    last_reading_at: new Date().toISOString(),
    sensors,
  }
}

export function historical(sensorId, fromIso, toIso, rollup) {
  const cfg = SENSOR_CONFIG[sensorId]
  if (!cfg) return []
  const stepMs = parseRollupMs(rollup)
  const from = new Date(fromIso).getTime()
  const to = new Date(toIso).getTime()
  const points = []
  const [min, max] = cfg.range
  const mid = (min + max) / 2
  const amp = (max - min) / 4
  for (let t = from; t <= to; t += stepMs) {
    const dayPhase = ((t / 86_400_000) % 1) * 2 * Math.PI
    const seasonal = Math.sin(dayPhase) * amp
    const noise = (seededRandom(t + sensorId) - 0.5) * amp * 0.4
    points.push({
      timestamp: new Date(t).toISOString(),
      value: Number(clamp(mid + seasonal + noise, min, max).toFixed(2)),
    })
  }
  return points
}

function parseRollupMs(rollup) {
  const m = /^(\d+)([mh])$/.exec(rollup ?? '1h')
  if (!m) return 60 * 60_000
  const n = Number(m[1])
  return m[2] === 'h' ? n * 60 * 60_000 : n * 60_000
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function predictionFromCurrent() {
  const reading = currentReading()
  const pm25 = reading.sensors.find(s => s.key === 'pm25').value
  const aqi = calculateAQIFromPM25(pm25)
  const level = getAQILevel(aqi)
  return {
    prediction: aqi,
    category: level.label,
    aqi_color: level.color,
    timestamp: reading.last_reading_at,
    input_features: Object.fromEntries(reading.sensors.map(s => [s.key, s.value])),
  }
}

export function predictionFromBody(body) {
  const pm25 = Number(body?.pm25 ?? 0)
  const aqi = calculateAQIFromPM25(pm25) ?? 0
  const level = getAQILevel(aqi)
  return {
    prediction: aqi,
    category: level.label,
    aqi_color: level.color,
    timestamp: new Date().toISOString(),
    input_features: body,
  }
}

export const MODEL_INFO = {
  model_type: 'XGBoostRegressor',
  features: ['pm25', 'pm10', 'pm1', 'temperature', 'humidity'],
  training_date: '2026-03-15',
  feature_importances: {
    pm25: 0.52,
    pm10: 0.21,
    pm1: 0.11,
    humidity: 0.10,
    temperature: 0.06,
  },
}
