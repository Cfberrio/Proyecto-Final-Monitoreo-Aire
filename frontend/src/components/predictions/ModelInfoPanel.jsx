import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Cell, Tooltip } from 'recharts'
import GlassCard from '../ui/GlassCard'
import { formatFeatureName } from '../../utils/formatters'

const SHADES = ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']

export default function ModelInfoPanel({ modelInfo }) {
  if (!modelInfo) return null
  const importances = Object.entries(modelInfo.feature_importances ?? {})
    .map(([feature, importance]) => ({ feature: formatFeatureName(feature), importance }))
    .sort((a, b) => b.importance - a.importance)

  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold text-white">Información del modelo</h2>
      <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div><dt className="text-slate-500">Tipo</dt><dd className="text-slate-200">{modelInfo.model_type}</dd></div>
        <div><dt className="text-slate-500">Entrenado</dt><dd className="text-slate-200">{modelInfo.training_date}</dd></div>
        <div className="sm:col-span-2"><dt className="text-slate-500">Features</dt><dd className="text-slate-200">{modelInfo.features.map(formatFeatureName).join(' · ')}</dd></div>
      </dl>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Importancia de variables</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={importances} layout="vertical" margin={{ left: 10, right: 16 }}>
              <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 'dataMax']} />
              <YAxis dataKey="feature" type="category" stroke="#cbd5e1" fontSize={12} width={100} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                formatter={(v) => [(Number(v) * 100).toFixed(1) + '%', 'Importancia']}
              />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {importances.map((_, i) => (
                  <Cell key={i} fill={SHADES[i % SHADES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  )
}
