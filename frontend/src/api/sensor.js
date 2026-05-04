import client from './client'

export const sensorApi = {
  getCurrent: async () => (await client.get('/api/v1/sensor/current')).data,
  getSensors: async () => (await client.get('/api/v1/sensor/sensors')).data,
  getHistorical: async ({ sensorId, rollup = '1h', fromDate, toDate }) =>
    (await client.get(`/api/v1/sensor/historical/${sensorId}`, {
      params: {
        rollup,
        from_date: fromDate.toISOString(),
        to_date: toDate.toISOString(),
      },
    })).data,
  getStatus: async () => (await client.get('/api/v1/status')).data,
}
