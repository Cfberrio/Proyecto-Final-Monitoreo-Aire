import { useState, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { ShieldAlert } from 'lucide-react'
import { useSensorCurrent } from '../hooks/useSensorCurrent'
import { calculateAQIFromPM25, getAQILevel } from '../utils/aqi'
import { getDeviceStatus } from '../utils/deviceStatus'
import { SENSOR_CONFIG, getSensorDisplay } from '../constants/sensors'
import { HEALTH_RECOMMENDATIONS } from '../constants/healthRecommendations'
import SensorGrid from '../components/dashboard/SensorGrid'
import AQIGauge from '../components/dashboard/AQIGauge'
import SensorChart from '../components/dashboard/SensorChart'
import RangeSelector from '../components/dashboard/RangeSelector'
import StaleSensorNotice from '../components/dashboard/StaleSensorNotice'
import StatusDot from '../components/ui/StatusDot'
import ErrorBanner from '../components/ui/ErrorBanner'

const PM25_SENSOR_ID = 87

export default function Dashboard() {
  const [selectedSensorId, setSelectedSensorId] = useState(PM25_SENSOR_ID)
  const [timeRange, setTimeRange] = useState('24h')

  const { data, isLoading, isError, refetch } = useSensorCurrent()

  const pm25 = data?.sensors?.find(s => s.sensor_id === PM25_SENSOR_ID)?.value
  const aqi = useMemo(() => (pm25 != null ? calculateAQIFromPM25(pm25) : null), [pm25])
  const level = aqi != null ? getAQILevel(aqi) : null
  const deviceStatus = getDeviceStatus(data?.last_reading_at)

  const effectiveSensorId = useMemo(() => {
    if (!data?.sensors?.length) return selectedSensorId
    const present = data.sensors.some(s => s.sensor_id === selectedSensorId)
    return present ? selectedSensorId : data.sensors[0].sensor_id
  }, [data, selectedSensorId])

  const selectedSensor = data?.sensors?.find(s => s.sensor_id === effectiveSensorId)
  const selectedCfg = SENSOR_CONFIG[effectiveSensorId] ?? (selectedSensor ? getSensorDisplay(selectedSensor) : null)
  const timeAgo = data?.last_reading_at
    ? formatDistanceToNow(new Date(data.last_reading_at), { addSuffix: true, locale: es })
    : 'sin datos'
  const primaryAction = level ? HEALTH_RECOMMENDATIONS[level.label]?.[0] : null
  const deviceName = data?.name ?? data?.device_name

  if (isError) return <ErrorBanner message="No se pudo conectar con el sensor." onRetry={refetch} />

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{deviceName ?? 'Cargando…'}</h1>
          <p className="text-sm text-slate-400">Última lectura <span className="text-slate-200">{timeAgo}</span></p>
        </div>
        <StatusDot status={deviceStatus} />
      </header>

      {deviceStatus !== 'online' && data?.last_reading_at && (
        <StaleSensorNotice lastReadingAt={data.last_reading_at} severity={deviceStatus} />
      )}

      <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <AQIGauge aqi={aqi} category={level?.label} color={level?.color} isStale={deviceStatus !== 'online'}>
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
          selectedSensorId={effectiveSensorId}
          onSelectSensor={setSelectedSensorId}
        />
      </section>

      {selectedCfg && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              Histórico <span className="text-slate-400 font-normal">· {selectedCfg.label}</span>
            </h2>
            <RangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
          <SensorChart
            sensorId={effectiveSensorId}
            sensorName={selectedCfg.label}
            unit={selectedCfg.unit}
            color={selectedCfg.color}
            timeRange={timeRange}
          />
        </section>
      )}
    </div>
  )
}
