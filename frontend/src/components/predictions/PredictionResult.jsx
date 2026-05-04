import { Bot, Sliders, AlertTriangle } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import Badge from '../ui/Badge'
import AnimatedNumber from '../ui/AnimatedNumber'
import { HEALTH_RECOMMENDATIONS } from '../../constants/healthRecommendations'
import { formatDateTime, formatFeatureName, formatSensorValue } from '../../utils/formatters'

export default function PredictionResult({ prediction, category, aqi_color, timestamp, input_features, isAutomatic }) {
  if (prediction == null) return null
  const recs = HEALTH_RECOMMENDATIONS[category] ?? []
  const Icon = isAutomatic ? Bot : Sliders
  const sourceLabel = isAutomatic ? 'datos del sensor' : 'datos manuales'
  return (
    <GlassCard className="relative p-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -inset-12 opacity-25 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 20%, ${aqi_color}, transparent 70%)` }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-slate-300">
          <Icon className="h-5 w-5 text-blue-400" />
          <span className="text-sm">Predicción XGBoost</span>
        </div>
        <div className="mt-4 flex items-center gap-5">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-2xl text-4xl font-bold text-white"
            style={{ background: `${aqi_color}55`, border: `2px solid ${aqi_color}` }}
          >
            <AnimatedNumber value={prediction} decimals={0} />
          </div>
          <div>
            <Badge label={category} color={aqi_color} />
            <p className="mt-2 text-xs text-slate-400">Basado en {sourceLabel} · {formatDateTime(timestamp)}</p>
          </div>
        </div>

        {recs.length > 0 && (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-200 font-medium text-sm mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              Recomendaciones de salud
            </div>
            <ul className="space-y-1.5 text-sm text-slate-300 list-disc list-inside">
              {recs.map(r => <li key={r}>{r}</li>)}
            </ul>
          </div>
        )}

        {input_features && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Variables usadas</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
              {Object.entries(input_features).map(([k, v]) => (
                <span key={k}><span className="text-slate-500">{formatFeatureName(k)}:</span> {formatSensorValue(v, '', 1)}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
