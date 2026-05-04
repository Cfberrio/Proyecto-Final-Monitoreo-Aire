import { useQuery, useMutation } from '@tanstack/react-query'
import { predictionsApi } from '../api/predictions'

export function useCurrentPrediction() {
  return useQuery({
    queryKey: ['predictions', 'current'],
    queryFn: predictionsApi.getCurrent,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}

export function useManualPrediction() {
  return useMutation({ mutationFn: predictionsApi.predict })
}

export function useModelInfo() {
  return useQuery({
    queryKey: ['predictions', 'model-info'],
    queryFn: predictionsApi.getModelInfo,
    staleTime: Infinity,
  })
}
