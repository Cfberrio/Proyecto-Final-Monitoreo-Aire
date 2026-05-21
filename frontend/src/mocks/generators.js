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
  const now = new Date().toISOString()
  const sensors = Object.entries(SENSOR_CONFIG).map(([id, cfg]) => {
    const { value, prev } = tick(Number(id))
    return {
      sensor_id: Number(id),
      name: cfg.label,
      unit: cfg.unit,
      value,
      prev_value: prev,
      recorded_at: null,
    }
  })
  return {
    device_id: 19595,
    name: 'SCK 2.1 - BaqAQI (mock)',
    state: 'has_published',
    last_reading_at: now,
    location: { latitude: 10.96854, longitude: -74.78132, city: 'Barranquilla' },
    sensors,
  }
}

export function historical(sensorId, fromIso, toIso, rollup) {
  const cfg = SENSOR_CONFIG[sensorId]
  if (!cfg) {
    return {
      device_id: 19595,
      sensor_id: sensorId,
      sensor_name: `Sensor ${sensorId}`,
      unit: '',
      rollup,
      function: 'avg',
      from_date: fromIso,
      to_date: toIso,
      sample_size: 0,
      readings: [],
    }
  }
  const stepMs = parseRollupMs(rollup)
  const from = new Date(fromIso).getTime()
  const to = new Date(toIso).getTime()
  const readings = []
  const [min, max] = cfg.range
  const mid = (min + max) / 2
  const amp = (max - min) / 4
  for (let t = from; t <= to; t += stepMs) {
    const dayPhase = ((t / 86_400_000) % 1) * 2 * Math.PI
    const seasonal = Math.sin(dayPhase) * amp
    const noise = (seededRandom(t + sensorId) - 0.5) * amp * 0.4
    readings.push({
      timestamp: new Date(t).toISOString(),
      value: Number(clamp(mid + seasonal + noise, min, max).toFixed(2)),
    })
  }
  return {
    device_id: 19595,
    sensor_id: sensorId,
    sensor_name: cfg.label,
    unit: cfg.unit,
    rollup,
    function: 'avg',
    from_date: fromIso,
    to_date: toIso,
    sample_size: readings.length,
    readings,
  }
}

function parseRollupMs(rollup) {
  const m = /^(\d+)([mhd])$/.exec(rollup ?? '1h')
  if (!m) return 60 * 60_000
  const n = Number(m[1])
  if (m[2] === 'd') return n * 24 * 60 * 60_000
  if (m[2] === 'h') return n * 60 * 60_000
  return n * 60_000
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function predictionFromCurrent() {
  const reading = currentReading()
  const pm25 = reading.sensors.find(s => s.sensor_id === 87)?.value ?? 0
  const aqi = calculateAQIFromPM25(pm25) ?? 0
  const level = getAQILevel(aqi)
  return {
    prediction: aqi,
    category: level.label,
    aqi_color: level.color,
    timestamp: reading.last_reading_at,
    input_features: Object.fromEntries(
      reading.sensors
        .filter(s => SENSOR_CONFIG[s.sensor_id])
        .map(s => [SENSOR_CONFIG[s.sensor_id].key, s.value])
    ),
    model_version: '2026-05-15T20:09:12Z',
    data_source: 'smart_citizen_live',
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
    model_version: '2026-05-15T20:09:12Z',
    data_source: 'manual',
  }
}

export const MODEL_INFO = {
  model_type: 'XGBoostRegressor',
  training_date: '2026-05-15T20:09:12Z',
  features: [
    'hora_sin', 'hora_cos', 'dia_semana_sin', 'dia_semana_cos',
    'pm25_juanmina_lag_1h', 'pm25_juanmina_lag_3h', 'pm25_juanmina_lag_6h',
    'pm25_juanmina_roll3_mean', 'pm25_juanmina_roll6_mean',
    'pm10_juanmina_lag_1h', 'pm10_juanmina_roll3_mean',
    'temperatura', 'humedad', 'velocidad_viento',
  ],
  feature_importances: {
    pm25_juanmina_lag_1h: 0.141,
    pm25_juanmina_roll3_mean: 0.120,
    pm25_juanmina_lag_3h: 0.098,
    pm10_juanmina_lag_1h: 0.087,
    pm25_juanmina_roll6_mean: 0.072,
    pm10_juanmina_roll3_mean: 0.061,
    pm25_juanmina_lag_6h: 0.058,
    hora_sin: 0.046,
    hora_cos: 0.041,
    humedad: 0.035,
    temperatura: 0.028,
    velocidad_viento: 0.024,
    dia_semana_sin: 0.018,
    dia_semana_cos: 0.012,
  },
}
