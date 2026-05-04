import { http, HttpResponse } from 'msw'
import {
  currentReading,
  historical,
  predictionFromCurrent,
  predictionFromBody,
  MODEL_INFO,
} from './generators'
import { SENSOR_CONFIG } from '../constants/sensors'

const FAIL_RATE = Number(import.meta.env?.VITE_MSW_FAIL_RATE ?? 0)

function maybeFail() {
  if (FAIL_RATE > 0 && Math.random() < FAIL_RATE) {
    return HttpResponse.json({ message: 'Simulated upstream failure' }, { status: 500 })
  }
  return null
}

export const handlers = [
  http.get('*/api/v1/status', () => HttpResponse.json({ status: 'ok', version: '0.1.0' })),

  http.get('*/api/v1/sensor/current', () => maybeFail() ?? HttpResponse.json(currentReading())),

  http.get('*/api/v1/sensor/sensors', () =>
    HttpResponse.json(
      Object.entries(SENSOR_CONFIG).map(([id, cfg]) => ({ sensor_id: Number(id), ...cfg }))
    )
  ),

  http.get('*/api/v1/sensor/historical/:sensorId', ({ request, params }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from_date') ?? new Date(Date.now() - 86_400_000).toISOString()
    const to = url.searchParams.get('to_date') ?? new Date().toISOString()
    const rollup = url.searchParams.get('rollup') ?? '1h'
    return HttpResponse.json(historical(Number(params.sensorId), from, to, rollup))
  }),

  http.get('*/api/v1/predictions/current', () => maybeFail() ?? HttpResponse.json(predictionFromCurrent())),

  http.post('*/api/v1/predictions/predict', async ({ request }) => {
    const body = await request.json()
    return maybeFail() ?? HttpResponse.json(predictionFromBody(body))
  }),

  http.get('*/api/v1/predictions/model-info', () => HttpResponse.json(MODEL_INFO)),
]
