import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorBanner({ message = 'Algo salió mal.', onRetry }) {
  return (
    <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-red-200">
      <AlertCircle className="h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
      <span className="text-sm flex-1">{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-800/60 hover:bg-red-700/70 px-3 py-1.5 text-sm font-medium text-white"
        >
          <RefreshCw className="h-4 w-4" /> Reintentar
        </button>
      )}
    </div>
  )
}
