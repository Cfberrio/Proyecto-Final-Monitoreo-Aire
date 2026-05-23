import { useMemo } from 'react'
import { motion } from 'framer-motion'
import MetricCard from './MetricCard'
import SkeletonCard from '../ui/SkeletonCard'
import { CLUSTER_LABELS, CLUSTER_ORDER, getSensorDisplay } from '../../constants/sensors'

export default function SensorGrid({ sensors, isLoading, selectedSensorId, onSelectSensor }) {
  const groups = useMemo(() => groupByCluster(sensors), [sensors])

  if (isLoading && (!sensors || sensors.length === 0)) {
    return (
      <div className="space-y-5">
        {['particulas', 'ambiente'].map(id => (
          <div key={id} className="space-y-2">
            <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!sensors || sensors.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6 text-sm text-slate-400">
        El sensor no ha publicado lecturas todavía.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {groups.map(group => (
        <section key={group.id} className="space-y-2" aria-labelledby={`cluster-${group.id}`}>
          <h3 id={`cluster-${group.id}`} className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">
            {CLUSTER_LABELS[group.id] ?? group.id}
          </h3>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          >
            {group.items.map(({ sensor, cfg }) => (
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
            ))}
          </motion.div>
        </section>
      ))}
    </div>
  )
}

function groupByCluster(sensors) {
  if (!sensors) return []
  const bucket = new Map()
  for (const sensor of sensors) {
    const cfg = getSensorDisplay(sensor)
    const list = bucket.get(cfg.cluster) ?? []
    list.push({ sensor, cfg })
    bucket.set(cfg.cluster, list)
  }
  return CLUSTER_ORDER
    .filter(id => bucket.has(id))
    .map(id => ({ id, items: bucket.get(id) }))
}
