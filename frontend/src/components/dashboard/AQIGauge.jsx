import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import Badge from '../ui/Badge'
import AnimatedNumber from '../ui/AnimatedNumber'

export function needleAngleForAQI(aqi) {
  if (aqi == null) return -180
  const clamped = Math.max(0, Math.min(500, aqi))
  return -180 + (clamped / 500) * 180
}

const ARCS = [
  { from: 0,   to: 50,  color: '#00E400' },
  { from: 50,  to: 100, color: '#FFFF00' },
  { from: 100, to: 150, color: '#FF7E00' },
  { from: 150, to: 200, color: '#FF0000' },
  { from: 200, to: 300, color: '#8F3F97' },
  { from: 300, to: 500, color: '#7E0023' },
]

function arcPath(fromAqi, toAqi, radius = 80, cx = 100, cy = 110) {
  const a1 = (-180 + (fromAqi / 500) * 180) * Math.PI / 180
  const a2 = (-180 + (toAqi   / 500) * 180) * Math.PI / 180
  const x1 = cx + radius * Math.cos(a1)
  const y1 = cy + radius * Math.sin(a1)
  const x2 = cx + radius * Math.cos(a2)
  const y2 = cy + radius * Math.sin(a2)
  return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`
}

export default function AQIGauge({ aqi, category, color, children }) {
  const angle = needleAngleForAQI(aqi)
  const critical = aqi != null && aqi > 150
  return (
    <GlassCard className="relative p-6 overflow-hidden">
      {color && (
        <div
          aria-hidden="true"
          className="absolute -inset-12 opacity-30 blur-3xl pointer-events-none motion-safe:animate-[pulse_4s_ease-in-out_infinite]"
          style={{ background: `radial-gradient(circle at 50% 60%, ${color}, transparent 70%)` }}
        />
      )}
      {critical && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `inset 0 0 80px ${color}66` }}
        />
      )}
      <div className="relative">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2 font-medium">Índice AQI</h2>
        <svg viewBox="0 0 200 130" role="img" aria-label={`AQI ${aqi ?? 'desconocido'}, categoría ${category ?? 'sin datos'}`} className="w-full">
          {ARCS.map(a => (
            <path key={a.from} d={arcPath(a.from, a.to)} stroke={a.color} strokeWidth="14" strokeLinecap="butt" fill="none" opacity="0.85" />
          ))}
          <motion.line
            x1="100" y1="110"
            x2="100" y2="40"
            stroke="#f1f5f9"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ originX: '100px', originY: '110px' }}
            animate={{ rotate: angle + 90 }}
            transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          />
          <circle cx="100" cy="110" r="6" fill="#f1f5f9" />
        </svg>
        <div className="text-center mt-1">
          <div className="text-6xl font-bold text-white tabular-nums leading-none">
            <AnimatedNumber value={aqi} decimals={0} />
          </div>
          {category && <div className="mt-3"><Badge label={category} color={color} /></div>}
        </div>
        {children}
      </div>
    </GlassCard>
  )
}
