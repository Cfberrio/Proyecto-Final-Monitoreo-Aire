import { CloudOff, RadioTower } from 'lucide-react'
import { formatDistanceToNow, format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default function StaleSensorNotice({ lastReadingAt, severity = 'stale' }) {
  if (!lastReadingAt) return null
  const ago = formatDistanceToNow(parseISO(lastReadingAt), { addSuffix: true, locale: es })
  const exact = format(parseISO(lastReadingAt), "d 'de' MMM, HH:mm", { locale: es })
  const Icon = severity === 'offline' ? CloudOff : RadioTower
  const tone = severity === 'offline'
    ? 'border-amber-500/30 bg-amber-500/5 text-amber-200'
    : 'border-yellow-500/30 bg-yellow-500/5 text-yellow-200'

  return (
    <div className={`rounded-xl border ${tone} px-4 py-3 flex items-start gap-3`} role="status">
      <Icon className="h-5 w-5 mt-0.5 shrink-0" aria-hidden="true" />
      <div className="text-sm leading-snug space-y-1">
        <p className="font-medium">
          El sensor físico no ha publicado lecturas {ago}.
        </p>
        <p className="text-xs text-slate-400">
          Última publicación: {exact}. La API del backend y el modelo responden correctamente —
          los datos visibles son la última lectura registrada por el dispositivo.
        </p>
      </div>
    </div>
  )
}
