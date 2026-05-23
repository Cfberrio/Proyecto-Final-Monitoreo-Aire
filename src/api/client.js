import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message
    if (import.meta.env.DEV) {
      console.error(`[API] ${error.config?.url}: ${message}`)
    }
    return Promise.reject(error)
  }
)

export default client
