import { useMemo } from 'react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { format, parseISO, subHours } from 'date-fns'
import { es } from 'date-fns/locale'
import GlassCard from '../ui/GlassCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorBanner from '../ui/ErrorBanner'
import { useSensorHistorical } from '../../hooks/useSensorHistorical'

const RANGE_CONFIG = {
  '6h':  { rollup: '10m', hoursBack: 6,   tickFmt: 'HH:mm' },
  '24h': { rollup: '1h',  hoursBack: 24,  tickFmt: 'HH:mm' },
  '7d':  { rollup: '4h',  hoursBack: 168, tickFmt: 'd MMM' },
}

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/90 px-3 py-2 text-sm shadow-xl">
      <div className="text-slate-400">{format(parseISO(label), "d MMM HH:mm", { locale: es })}</div>
      <div className="text-white font-semibold tabular-nums">{Number(payload[0].value).toFixed(2)} {unit}</div>
    </div>
  )
}

export default function SensorChart({ sensorId, sensorName, unit, color, timeRange }) {
  const { rollup, hoursBack, tickFmt } = RANGE_CONFIG[timeRange]
  const { fromDate, toDate } = useMemo(() => {
    const to = new Date()
    return { fromDate: subHours(to, hoursBack), toDate: to }
  }, [hoursBack, timeRange])

  const { data, isLoading, isError, refetch } = useSensorHistorical({ sensorId, rollup, fromDate, toDate })

  if (isError) return <ErrorBanner message={`No se pudo cargar el histórico de ${sensorName}.`} onRetry={refetch} />

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-300">{sensorName} <span className="text-slate-500">({unit})</span></h3>
      </div>
      <div className="h-72">
        {isLoading ? (
          <div className="h-full flex items-center justify-center"><LoadingSpinner size="lg" /></div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data ?? []} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`g-${sensorId}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                stroke="#64748b"
                tickFormatter={(t) => format(parseISO(t), tickFmt, { locale: es })}
                fontSize={11}
              />
              <YAxis stroke="#64748b" fontSize={11} width={40} />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false} animationDuration={400} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  )
}
