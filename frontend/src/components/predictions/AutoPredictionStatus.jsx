import { CloudOff, AlertTriangle, RefreshCw, Sliders } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'
import PredictionResult from './PredictionResult'

export default function AutoPredictionStatus({ query, onUseManual }) {
  if (query.isLoading) {
    return (
      <div className="flex justify-center py-12" role="status" aria-label="Calculando predicción automática">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (query.isError) {
    const status = query.error?.response?.status
    if (status === 502) return <SensorOfflineCard onRetry={query.refetch} onUseManual={onUseManual} />
    if (status === 503) return <ModelOfflineCard onRetry={query.refetch} />
    return <GenericErrorCard onRetry={query.refetch} message={query.error?.response?.data?.message} />
  }

  if (query.data) return <PredictionResult {...query.data} isAutomatic />
  return null
}

function SensorOfflineCard({ onRetry, onUseManual }) {
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <CloudOff className="h-5 w-5 text-amber-300 mt-0.5 shrink-0" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-amber-100">
            El sensor físico no está publicando lecturas recientes.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            La predicción automática usa la lectura más reciente del sensor SCK. Mientras no
            publique, no se puede inferir AQI en vivo. <span className="text-slate-300">El modelo y la API
            están operativos</span> — pruebe la predicción manual ingresando valores.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onUseManual}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-3.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
        >
          <Sliders className="h-4 w-4" aria-hidden="true" /> Usar predicción manual
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 hover:bg-white/5 text-slate-300 text-sm px-3.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reintentar
        </button>
      </div>
    </div>
  )
}

function ModelOfflineCard({ onRetry }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 space-y-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-red-100">Modelo XGBoost no disponible.</p>
          <p className="text-xs text-slate-400 mt-1">
            El backend no pudo cargar el modelo. Intente de nuevo en unos segundos.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 hover:bg-white/5 text-slate-300 text-sm px-3.5 py-1.5 transition-colors"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reintentar
      </button>
    </div>
  )
}

function GenericErrorCard({ onRetry, message }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 space-y-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-sm text-red-100">
          {message ?? 'No pudimos obtener la predicción automática.'}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 hover:bg-white/5 text-slate-300 text-sm px-3.5 py-1.5 transition-colors"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reintentar
      </button>
    </div>
  )
}
