import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-red-100">
      <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" aria-hidden="true" />
      <span className="text-sm flex-1 leading-snug">{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-900/50 hover:bg-red-800/70 px-3 py-1.5 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reintentar
        </button>
      )}
    </div>
  )
}
