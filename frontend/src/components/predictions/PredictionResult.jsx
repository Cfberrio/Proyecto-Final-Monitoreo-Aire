import { Bot, Sliders, ShieldAlert } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import Badge from '../ui/Badge'
import AnimatedNumber from '../ui/AnimatedNumber'
import { HEALTH_RECOMMENDATIONS } from '../../constants/healthRecommendations'
import { formatDateTime, formatFeatureName, formatSensorValue } from '../../utils/formatters'

export default function PredictionResult({ prediction, category, aqi_color, timestamp, input_features, isAutomatic }) {
  if (prediction == null) return null
  const recs = HEALTH_RECOMMENDATIONS[category] ?? []
  const Icon = isAutomatic ? Bot : Sliders
  const sourceLabel = isAutomatic ? 'lectura del sensor' : 'datos manuales'

  return (
    <GlassCard className="relative p-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -inset-12 opacity-20 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 20%, ${aqi_color}, transparent 70%)` }}
      />
      <div className="relative space-y-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400 font-medium">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Predicción XGBoost</span>
        </div>

        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-6xl font-bold text-white tabular-nums leading-none">
            <AnimatedNumber value={prediction} decimals={0} />
          </span>
          <span className="text-sm text-slate-500 uppercase tracking-wider">AQI</span>
          <Badge label={category} color={aqi_color} />
        </div>
        <p className="text-xs text-slate-500">
          A partir de {sourceLabel}, {formatDateTime(timestamp)}
        </p>

        {recs.length > 0 && (
          <div className="border-t border-white/5 pt-4 space-y-2">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400 font-medium">
              <ShieldAlert className="h-3.5 w-3.5" style={{ color: aqi_color }} aria-hidden="true" />
              Qué hacer
            </div>
            <ul className="space-y-1.5 text-sm text-slate-200 leading-snug">
              {recs.map(r => (
                <li key={r} className="flex gap-2">
                  <span className="text-slate-600 select-none" aria-hidden="true">·</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {input_features && (
          <div className="border-t border-white/5 pt-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium mb-2">
              Variables consideradas
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
              {Object.entries(input_features).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <dt className="text-slate-500">{formatFeatureName(k)}</dt>
                  <dd className="text-slate-200 tabular-nums">{formatSensorValue(v, '', 1)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
