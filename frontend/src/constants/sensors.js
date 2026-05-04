export const SENSOR_CONFIG = {
  87: { key: 'pm25',        label: 'PM 2.5',      unit: 'µg/m³', icon: 'wind',        color: '#f97316', range: [0, 200] },
  88: { key: 'pm10',        label: 'PM 10',       unit: 'µg/m³', icon: 'cloud',       color: '#a78bfa', range: [0, 300] },
  55: { key: 'temperature', label: 'Temperatura', unit: '°C',    icon: 'thermometer', color: '#ef4444', range: [22, 36] },
  56: { key: 'humidity',    label: 'Humedad',     unit: '%',     icon: 'droplets',    color: '#38bdf8', range: [40, 95] },
  53: { key: 'noise',       label: 'Ruido',       unit: 'dBA',   icon: 'volume-2',    color: '#facc15', range: [35, 80] },
  89: { key: 'co2',         label: 'CO₂',         unit: 'ppm',   icon: 'leaf',        color: '#22c55e', range: [380, 900] },
  90: { key: 'no2',         label: 'NO₂',         unit: 'ppb',   icon: 'flame',       color: '#fb7185', range: [0, 80] },
  10: { key: 'battery',     label: 'Batería',     unit: '%',     icon: 'battery',     color: '#10b981', range: [60, 100] },
}

export const SENSOR_IDS = Object.keys(SENSOR_CONFIG).map(Number)
