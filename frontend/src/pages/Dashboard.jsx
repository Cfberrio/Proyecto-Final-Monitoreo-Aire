import { useState, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSensorCurrent } from '../hooks/useSensorCurrent'
import { calculateAQIFromPM25, getAQILevel } from '../utils/aqi'
import { getDeviceStatus } from '../utils/deviceStatus'
import { SENSOR_CONFIG } from '../constants/sensors'
import SensorGrid from '../components/dashboard/SensorGrid'
import AQIGauge from '../components/dashboard/AQIGauge'
import SensorChart from '../components/dashboard/SensorChart'
import RangeSelector from '../components/dashboard/RangeSelector'
import StatusDot from '../components/ui/StatusDot'
import ErrorBanner from '../components/ui/ErrorBanner'

export default function Dashboard() {
  const [selectedSensorId, setSelectedSensorId] = useState(87)
  const [timeRange, setTimeRange] = useState('24h')

  const { data, isLoading, isError, refetch, dataUpdatedAt } = useSensorCurrent()

  const pm25 = data?.sensors?.find(s => s.key === 'pm25')?.value
  const aqi = useMemo(() => (pm25 != null ? calculateAQIFromPM25(pm25) : null), [pm25])
  const level = aqi != null ? getAQILevel(aqi) : null
  const deviceStatus = getDeviceStatus(data?.last_reading_at)

  const selectedCfg = SENSOR_CONFIG[selectedSensorId]
  const timeAgo = dataUpdatedAt ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true, locale: es }) : '—'

  if (isError) return <ErrorBanner message="No se pudo conectar con el sensor." onRetry={refetch} />

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">{data?.device_name ?? 'Cargando…'}</h1>
          <p className="text-sm text-slate-400">Última actualización: <span className="text-slate-200">{timeAgo}</span></p>
        </div>
        <StatusDot status={deviceStatus} />
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <AQIGauge aqi={aqi} category={level?.label} color={level?.color} />
        <SensorGrid
          sensors={data?.sensors}
          isLoading={isLoading}
          selectedSensorId={selectedSensorId}
          onSelectSensor={setSelectedSensorId}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Histórico — {selectedCfg.label}</h2>
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
