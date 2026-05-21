import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import SolidCard from '../ui/SolidCard'
import { formatFeatureName, formatDateTime } from '../../utils/formatters'

const BAR_COLOR = '#475569'
const TOP_N = 10

export default function ModelInfoPanel({ modelInfo }) {
  if (!modelInfo) return null
  const importances = Object.entries(modelInfo.feature_importances ?? {})
    .map(([feature, importance]) => ({ feature: formatFeatureName(feature), importance }))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, TOP_N)

  return (
    <SolidCard className="p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-white">Sobre el modelo</h2>
        <p className="text-xs text-slate-500 mt-1">
          Cómo aprende a estimar el AQI a partir de las lecturas del sensor.
        </p>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">Tipo</dt>
          <dd className="text-slate-200 mt-0.5">{modelInfo.model_type}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">Entrenado</dt>
          <dd className="text-slate-200 mt-0.5 tabular-nums">{formatDateTime(modelInfo.training_date)}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">Variables</dt>
          <dd className="text-slate-200 mt-0.5">{modelInfo.features.length}</dd>
        </div>
      </dl>

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">
            Variables más influyentes
          </h3>
          <span className="text-[11px] text-slate-600">top {importances.length} · % de influencia</span>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={importances} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
              <XAxis
                type="number"
                stroke="#475569"
                fontSize={11}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                domain={[0, 'dataMax']}
              />
              <YAxis
                dataKey="feature"
                type="category"
                stroke="#cbd5e1"
                fontSize={11}
                width={150}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [(Number(v) * 100).toFixed(1) + '%', 'Influencia']}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]} fill={BAR_COLOR} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SolidCard>
  )
}
