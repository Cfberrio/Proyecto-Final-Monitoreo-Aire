export const FIELD_RULES = {
  pm25:        { label: 'PM 2.5',      unit: 'µg/m³', min: 0,   max: 500, typical: 18,  required: true,  hint: 'Promedio típico en BQ: 15–25' },
  pm10:        { label: 'PM 10',       unit: 'µg/m³', min: 0,   max: 600, typical: 45,  required: true,  hint: 'Promedio típico en BQ: 30–60' },
  pm1:         { label: 'PM 1.0',      unit: 'µg/m³', min: 0,   max: 400, typical: 10,  required: false, hint: 'Opcional · típico 5–15' },
  temperature: { label: 'Temperatura', unit: '°C',    min: -10, max: 50,  typical: 30,  required: false, hint: 'Opcional · BQ rara vez baja de 24 °C' },
  humidity:    { label: 'Humedad',     unit: '%',     min: 0,   max: 100, typical: 75,  required: false, hint: 'Opcional · BQ entre 60–90 %' },
}

export function validateManualPrediction(values) {
  const errors = {}
  for (const [key, rule] of Object.entries(FIELD_RULES)) {
    const raw = values[key]
    const empty = raw === '' || raw == null
    if (empty) {
      if (rule.required) errors[key] = `${rule.label} es requerido.`
      continue
    }
    const num = Number(raw)
    if (Number.isNaN(num)) {
      errors[key] = `${rule.label} debe ser un número.`
      continue
    }
    if (num < rule.min || num > rule.max) {
      errors[key] = `${rule.label} debe estar entre ${rule.min} y ${rule.max}.`
    }
  }
  return errors
}

export function buildManualPayload(values) {
  const payload = {}
  for (const key of Object.keys(FIELD_RULES)) {
    const raw = values[key]
    payload[key] = raw === '' || raw == null ? null : Number(raw)
  }
  return payload
}
