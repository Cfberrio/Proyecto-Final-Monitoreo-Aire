import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { format, parseISO, subHours } from 'date-fns'
import { es } from 'date-fns/locale'
import SolidCard from '../ui/SolidCard'
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
    <div className="rounded-lg border border-white/10 bg-slate-950/95 px-3 py-2 text-sm shadow-xl">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">
        {format(parseISO(label), "d 'de' MMM, HH:mm", { locale: es })}
      </div>
      <div className="text-white font-semibold tabular-nums mt-0.5">
        {Number(payload[0].value).toFixed(2)} <span className="text-xs text-slate-400 font-normal">{unit}</span>
      </div>
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

  if (isError) return <ErrorBanner message={`No pudimos cargar el histórico de ${sensorName}.`} onRetry={refetch} />

  const gradientId = `chart-fill-${sensorId}`

  return (
    <SolidCard className="p-5">
      <div className="h-72">
        {isLoading ? (
          <div className="h-full flex items-center justify-center"><LoadingSpinner size="lg" /></div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data ?? []} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="timestamp"
                stroke="#475569"
                tickFormatter={(t) => format(parseISO(t), tickFmt, { locale: es })}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#475569"
                fontSize={11}
                width={36}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeDasharray: '2 2' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                animationDuration={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </SolidCard>
  )
}
