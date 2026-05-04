import { useState, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { ShieldAlert } from 'lucide-react'
import { useSensorCurrent } from '../hooks/useSensorCurrent'
import { calculateAQIFromPM25, getAQILevel } from '../utils/aqi'
import { getDeviceStatus } from '../utils/deviceStatus'
import { SENSOR_CONFIG, PRIMARY_SENSOR_KEY } from '../constants/sensors'
import { HEALTH_RECOMMENDATIONS } from '../constants/healthRecommendations'
import SensorGrid from '../components/dashboard/SensorGrid'
import AQIGauge from '../components/dashboard/AQIGauge'
import SensorChart from '../components/dashboard/SensorChart'
import RangeSelector from '../components/dashboard/RangeSelector'
import StatusDot from '../components/ui/StatusDot'
import ErrorBanner from '../components/ui/ErrorBanner'

const PRIMARY_SENSOR_ID = Number(
  Object.entries(SENSOR_CONFIG).find(([, c]) => c.key === PRIMARY_SENSOR_KEY)?.[0]
)

export default function Dashboard() {
  const [selectedSensorId, setSelectedSensorId] = useState(PRIMARY_SENSOR_ID)
  const [timeRange, setTimeRange] = useState('24h')

  const { data, isLoading, isError, refetch, dataUpdatedAt } = useSensorCurrent()

  const pm25 = data?.sensors?.find(s => s.key === PRIMARY_SENSOR_KEY)?.value
  const aqi = useMemo(() => (pm25 != null ? calculateAQIFromPM25(pm25) : null), [pm25])
  const level = aqi != null ? getAQILevel(aqi) : null
  const deviceStatus = getDeviceStatus(data?.last_reading_at)

  const selectedCfg = SENSOR_CONFIG[selectedSensorId]
  const timeAgo = dataUpdatedAt ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true, locale: es }) : 'sin datos'
  const primaryAction = level ? HEALTH_RECOMMENDATIONS[level.label]?.[0] : null

  if (isError) return <ErrorBanner message="No se pudo conectar con el sensor." onRetry={refetch} />

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{data?.device_name ?? 'Cargando…'}</h1>
          <p className="text-sm text-slate-400">Última actualización <span className="text-slate-200">{timeAgo}</span></p>
        </div>
        <StatusDot status={deviceStatus} />
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <AQIGauge aqi={aqi} category={level?.label} color={level?.color}>
          {primaryAction && (
            <div
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/10 bg-slate-950/40 px-3.5 py-3 text-sm text-slate-200 leading-snug"
              role="status"
            >
              <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" style={{ color: level.color }} aria-hidden="true" />
              <span>{primaryAction}</span>
            </div>
          )}
        </AQIGauge>
        <SensorGrid
          sensors={data?.sensors}
          isLoading={isLoading}
          selectedSensorId={selectedSensorId}
          onSelectSensor={setSelectedSensorId}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">
            Histórico <span className="text-slate-400 font-normal">· {selectedCfg.label}</span>
          </h2>
          <RangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
        <SensorChart
          sensorId={selectedSensorId}
          sensorName={selectedCfg.label}
          unit={selectedCfg.unit}
          color={selectedCfg.color}
          timeRange={timeRange}
        />
      </section>
    </div>
  )
}
