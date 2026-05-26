import { useMemo } from 'react'
import { motion } from 'framer-motion'
import MetricCard from './MetricCard'
import SkeletonCard from '../ui/SkeletonCard'
import { CLUSTER_LABELS, getSensorDisplay } from '../../constants/sensors'

// IDs de sensores permitidos: PM 1.0 (89), PM 2.5 (87), PM 10 (88), Temperatura (55), Humedad (56)
const ALLOWED_SENSOR_IDS = [89, 87, 88, 55, 56]

export default function SensorGrid({ sensors, isLoading, selectedSensorId, onSelectSensor }) {
  const filteredSensors = useMemo(
    () => (sensors ? sensors.filter(s => ALLOWED_SENSOR_IDS.includes(s.sensor_id)) : []),
    [sensors]
  )

  if (isLoading && (!filteredSensors || filteredSensors.length === 0)) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  if (!filteredSensors || filteredSensors.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6 text-sm text-slate-400">
        El sensor no ha publicado lecturas todavía.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="space-y-2" aria-labelledby="cluster-metricas">
        <h3 id="cluster-metricas" className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">
          Métricas principales
        </h3>
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-5 gap-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        >
          {filteredSensors.map(sensor => {
            const cfg = getSensorDisplay(sensor)
            return (
              <motion.div
                key={sensor.sensor_id}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <MetricCard
                  label={cfg.label}
                  value={sensor.value}
                  prevValue={sensor.prev_value}
                  unit={cfg.unit}
                  icon={cfg.icon}
                  color={cfg.color}
                  selected={selectedSensorId === sensor.sensor_id}
                  onClick={() => onSelectSensor?.(sensor.sensor_id)}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </section>
    </div>
  )
}
