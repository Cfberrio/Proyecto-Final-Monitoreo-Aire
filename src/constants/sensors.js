export const SENSOR_CONFIG = {
  87: { key: 'pm25',        label: 'PM 2.5',      unit: 'µg/m³', icon: 'wind',        color: '#f97316', range: [0, 200],   cluster: 'particulas' },
  88: { key: 'pm10',        label: 'PM 10',       unit: 'µg/m³', icon: 'cloud',       color: '#a78bfa', range: [0, 300],   cluster: 'particulas' },
  89: { key: 'pm1',         label: 'PM 1.0',      unit: 'µg/m³', icon: 'wind',        color: '#facc15', range: [0, 150],   cluster: 'particulas' },
  90: { key: 'no2',         label: 'NO₂',         unit: 'ppb',   icon: 'flame',       color: '#fb7185', range: [0, 80],    cluster: 'gases' },
  91: { key: 'co2',         label: 'CO₂',         unit: 'ppm',   icon: 'leaf',        color: '#22c55e', range: [380, 900], cluster: 'gases' },
  55: { key: 'temperature', label: 'Temperatura', unit: '°C',    icon: 'thermometer', color: '#ef4444', range: [22, 36],   cluster: 'ambiente' },
  56: { key: 'humidity',    label: 'Humedad',     unit: '%',     icon: 'droplets',    color: '#38bdf8', range: [40, 95],   cluster: 'ambiente' },
  53: { key: 'noise',       label: 'Ruido',       unit: 'dBA',   icon: 'volume-2',    color: '#fcd34d', range: [35, 80],   cluster: 'ambiente' },
  10: { key: 'battery',     label: 'Batería',     unit: '%',     icon: 'battery',     color: '#10b981', range: [0, 100],   cluster: 'dispositivo' },
}

export const SENSOR_IDS = Object.keys(SENSOR_CONFIG).map(Number)

export const CLUSTER_LABELS = {
  particulas:  'Partículas',
  gases:       'Gases',
  ambiente:    'Ambiente',
  dispositivo: 'Dispositivo',
  otros:       'Otros',
}

export const CLUSTER_ORDER = ['particulas', 'gases', 'ambiente', 'dispositivo', 'otros']

export const PRIMARY_SENSOR_KEY = 'pm25'

export function getSensorDisplay(sensor) {
  const cfg = SENSOR_CONFIG[sensor.sensor_id]
  if (cfg) return cfg
  const unit = sensor.unit ?? ''
  return {
    key:     `sensor-${sensor.sensor_id}`,
    label:   sensor.name ?? `Sensor ${sensor.sensor_id}`,
    unit,
    icon:    'wind',
    color:   '#64748b',
    range:   [0, 100],
    cluster: 'otros',
  }
}
