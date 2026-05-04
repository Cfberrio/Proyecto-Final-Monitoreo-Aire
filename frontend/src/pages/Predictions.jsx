import { useState } from 'react'
import { Bot, Sliders } from 'lucide-react'
import clsx from 'clsx'
import { useCurrentPrediction, useManualPrediction, useModelInfo } from '../hooks/usePrediction'
import PredictionResult from '../components/predictions/PredictionResult'
import ManualInputForm from '../components/predictions/ManualInputForm'
import ModelInfoPanel from '../components/predictions/ModelInfoPanel'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorBanner from '../components/ui/ErrorBanner'
import SolidCard from '../components/ui/SolidCard'

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
    <div className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Predicción de calidad del aire</h1>
        <p className="text-sm text-slate-400 mt-1">
          Calculamos un AQI con un modelo XGBoost entrenado con el historial de Barranquilla. Use la lectura actual del sensor o introduzca valores manualmente.
        </p>
      </header>

      <div role="tablist" aria-label="Modo de predicción" className="md:hidden inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
        {TABS.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
            className={clsx(
              'px-3 py-1.5 text-sm rounded-md inline-flex items-center gap-1.5 transition-colors',
              activeTab === t.key ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
            )}
          >
            <t.Icon className="h-4 w-4" aria-hidden="true" /> {t.label}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className={clsx('space-y-3', activeTab !== 'auto' && 'hidden md:block')}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">
            <Bot className="h-3.5 w-3.5" aria-hidden="true" /> Automático
          </div>
          {current.isLoading && (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          )}
          {current.isError && (
            <ErrorBanner message="No pudimos obtener la predicción automática." onRetry={current.refetch} />
          )}
          {current.data && <PredictionResult {...current.data} isAutomatic />}
        </div>

        <div className={clsx('space-y-3', activeTab !== 'manual' && 'hidden md:block')}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">
            <Sliders className="h-3.5 w-3.5" aria-hidden="true" /> Manual
          </div>
          <SolidCard className="p-5">
            <ManualInputForm onSubmit={manual.mutate} isLoading={manual.isPending} />
          </SolidCard>
          {manual.isError && (
            <ErrorBanner message="No pudimos calcular la predicción con esos valores." onRetry={() => manual.reset()} />
          )}
          {manual.data && <PredictionResult {...manual.data} isAutomatic={false} />}
        </div>
      </section>

      <ModelInfoPanel modelInfo={modelInfo.data} />
    </div>
  )
}
