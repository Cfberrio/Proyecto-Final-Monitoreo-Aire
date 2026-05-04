import { motion } from 'framer-motion'
import MetricCard from './MetricCard'
import SkeletonCard from '../ui/SkeletonCard'
import { SENSOR_CONFIG, SENSOR_IDS } from '../../constants/sensors'

export default function SensorGrid({ sensors, isLoading, selectedSensorId, onSelectSensor }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }
  const map = new Map((sensors ?? []).map(s => [s.sensor_id, s]))
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
    >
      {SENSOR_IDS.map(id => {
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
  )
}
