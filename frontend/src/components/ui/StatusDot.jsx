import clsx from 'clsx'

const COLORS = {
  online:  { core: 'bg-green-400',  ping: 'bg-green-400',  label: 'En línea' },
  stale:   { core: 'bg-yellow-400', ping: 'bg-yellow-400', label: 'Última lectura > 5 min' },
  offline: { core: 'bg-red-500',    ping: null,            label: 'Sin señal' },
}

export default function StatusDot({ status = 'offline', showLabel = true, label }) {
  const c = COLORS[status] ?? COLORS.offline
  const text = label ?? c.label
  return (
    <span className="inline-flex items-center gap-2" aria-label={text}>
      <span className="relative inline-flex h-2.5 w-2.5">
        {c.ping && (
          <span
            className={clsx('absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping', c.ping)}
            aria-hidden="true"
          />
        )}
        <span className={clsx('relative inline-flex rounded-full h-2.5 w-2.5', c.core)} />
      </span>
      {showLabel && <span className="text-sm text-slate-300">{text}</span>}
    </span>
  )
}
