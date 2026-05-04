import { motion } from 'framer-motion'
import MetricCard from './MetricCard'
import SkeletonCard from '../ui/SkeletonCard'
import { SENSOR_CONFIG, SENSOR_CLUSTERS } from '../../constants/sensors'

export default function SensorGrid({ sensors, isLoading, selectedSensorId, onSelectSensor }) {
  if (isLoading) {
    return (
      <div className="space-y-5">
        {SENSOR_CLUSTERS.map(cluster => (
          <div key={cluster.id} className="space-y-2">
            <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {cluster.sensorIds.map(id => <SkeletonCard key={id} />)}
            </div>
          </div>
        ))}
      </div>
    )
  }
  const map = new Map((sensors ?? []).map(s => [s.sensor_id, s]))
  return (
    <div className="space-y-5">
      {SENSOR_CLUSTERS.map(cluster => (
        <section key={cluster.id} className="space-y-2" aria-labelledby={`cluster-${cluster.id}`}>
          <h3 id={`cluster-${cluster.id}`} className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">
            {cluster.label}
          </h3>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          >
            {cluster.sensorIds.map(id => {
              const cfg = SENSOR_CONFIG[id]
              const reading = map.get(id)
              return (
                <motion.div
                  key={id}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                >
                  <MetricCard
                    label={cfg.label}
                    value={reading?.value ?? null}
                    prevValue={reading?.prev_value}
                    unit={cfg.unit}
                    icon={cfg.icon}
                    color={cfg.color}
                    selected={selectedSensorId === id}
                    onClick={() => onSelectSensor?.(id)}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      ))}
    </div>
  )
}
