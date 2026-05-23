import { useQuery } from '@tanstack/react-query'
import { sensorApi } from '../api/sensor'

export function useSensorHistorical({ sensorId, rollup, fromDate, toDate, enabled = true }) {
  return useQuery({
    queryKey: ['sensor', 'historical', sensorId, rollup, fromDate?.toISOString(), toDate?.toISOString()],
    queryFn: () => sensorApi.getHistorical({ sensorId, rollup, fromDate, toDate }),
    enabled: enabled && !!sensorId && !!fromDate && !!toDate,
    staleTime: 5 * 60_000,
  })
}
