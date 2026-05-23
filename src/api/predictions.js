import client from './client'

export const predictionsApi = {
  getCurrent: async () => (await client.post('/api/v1/predictions/current')).data,
  predict: async (input) => (await client.post('/api/v1/predictions/manual', input)).data,
  getModelInfo: async () => (await client.get('/api/v1/predictions/info')).data,
}
