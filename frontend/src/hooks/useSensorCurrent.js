import { useQuery } from '@tanstack/react-query'
import { sensorApi } from '../api/sensor'

export function useSensorCurrent() {
  return useQuery({
    queryKey: ['sensor', 'current'],
    queryFn: sensorApi.getCurrent,
    refetchInterval: Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || 60_000,
    refetchIntervalInBackground: false,
    staleTime: 30_000,
  })
}
