import { useState } from 'react'
import { Bot, Sliders } from 'lucide-react'
import clsx from 'clsx'
import { useCurrentPrediction, useManualPrediction, useModelInfo } from '../hooks/usePrediction'
import PredictionResult from '../components/predictions/PredictionResult'
import ManualInputForm from '../components/predictions/ManualInputForm'
import ModelInfoPanel from '../components/predictions/ModelInfoPanel'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorBanner from '../components/ui/ErrorBanner'

const TABS = [
  { key: 'auto',   label: 'Automático', Icon: Bot },
  { key: 'manual', label: 'Manual',     Icon: Sliders },
]

export default function Predictions() {
  const [activeTab, setActiveTab] = useState('auto')
  const current = useCurrentPrediction()
  const manual  = useManualPrediction()
  const modelInfo = useModelInfo()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Predicción de Calidad del Aire</h1>
        <p className="text-sm text-slate-400">Modelo XGBoost entrenado con datos históricos de Barranquilla.</p>
      </header>

      {/* mobile tabs */}
      <div role="tablist" className="md:hidden inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
        {TABS.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
            className={clsx(
              'px-3 py-1.5 text-sm rounded-md inline-flex items-center gap-1.5',
              activeTab === t.key ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
            )}
          >
            <t.Icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={clsx('space-y-3', activeTab !== 'auto' && 'hidden md:block')}>
          <h2 className="text-sm uppercase tracking-widest text-slate-400">Predicción automática</h2>
          {current.isLoading && <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>}
          {current.isError && <ErrorBanner message="No se pudo obtener la predicción automática." onRetry={current.refetch} />}
          {current.data && <PredictionResult {...current.data} isAutomatic />}
        </div>

        <div className={clsx('space-y-3', activeTab !== 'manual' && 'hidden md:block')}>
          <h2 className="text-sm uppercase tracking-widest text-slate-400">Predicción manual</h2>
          <ManualInputForm onSubmit={manual.mutate} isLoading={manual.isPending} />
          {manual.isError && <ErrorBanner message="No se pudo calcular la predicción manual." onRetry={() => manual.reset()} />}
          {manual.data && <PredictionResult {...manual.data} isAutomatic={false} />}
        </div>
      </section>

      <ModelInfoPanel modelInfo={modelInfo.data} />
    </div>
  )
}
