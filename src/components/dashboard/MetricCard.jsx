import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Minus, Wind, Cloud, Thermometer, Droplets, Volume2, Leaf, Flame, Battery } from 'lucide-react'
import SolidCard from '../ui/SolidCard'
import AnimatedNumber from '../ui/AnimatedNumber'

const ICONS = { wind: Wind, cloud: Cloud, thermometer: Thermometer, droplets: Droplets, 'volume-2': Volume2, leaf: Leaf, flame: Flame, battery: Battery }

function trendOf(value, prev) {
  if (value == null || prev == null) return null
  const d = value - prev
  if (Math.abs(d) < 0.05 * Math.max(1, Math.abs(prev))) return 'stable'
  return d > 0 ? 'up' : 'down'
}

const TREND_META = {
  up:     { Icon: ArrowUpRight,   color: 'text-red-400',   label: 'tendencia subiendo' },
  down:   { Icon: ArrowDownRight, color: 'text-green-400', label: 'tendencia bajando' },
  stable: { Icon: Minus,          color: 'text-slate-400', label: 'tendencia estable' },
}

export default function MetricCard({ label, value, prevValue, unit, icon, color, selected, onClick }) {
  const Icon = ICONS[icon] ?? Wind
  const trend = trendOf(value, prevValue)
  const isLoading = value == null

  if (isLoading) {
    return (
      <SolidCard className="p-5">
        <div data-testid="metric-skeleton" className="animate-pulse space-y-3">
          <div className="h-7 w-7 rounded bg-white/10" />
          <div className="h-8 w-24 rounded bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
      </SolidCard>
    )
  }

  return (
    <motion.button
      type="button"
      whileHover={
        typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
          ? undefined
          : { y: -2 }
      }
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={onClick}
      aria-label={`${label}: ${value} ${unit}`}
      aria-pressed={selected}
      className="text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
    >
      <SolidCard className={`p-5 transition-colors ${selected ? 'bg-slate-800/70 ring-1 ring-white/15' : 'hover:bg-slate-900/60'}`}>
        <div className="flex items-start justify-between">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}1f`, color }} aria-hidden="true">
            <Icon className="h-5 w-5" />
          </span>
          {trend && (
            <span aria-label={TREND_META[trend].label} className={TREND_META[trend].color}>
              {(() => { const T = TREND_META[trend].Icon; return <T className="h-5 w-5" /> })()}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-white tabular-nums">
            <AnimatedNumber value={value} decimals={1} />
          </span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
        <div className="mt-0.5 text-xs uppercase tracking-wider text-slate-400">{label}</div>
      </SolidCard>
    </motion.button>
  )
}
