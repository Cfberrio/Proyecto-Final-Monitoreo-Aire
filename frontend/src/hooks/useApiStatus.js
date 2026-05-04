import { useQuery } from '@tanstack/react-query'
import { sensorApi } from '../api/sensor'

export function useApiStatus() {
  return useQuery({
    queryKey: ['api-status'],
    queryFn: sensorApi.getStatus,
    refetchInterval: 30_000,
    retry: 1,
  })
}
