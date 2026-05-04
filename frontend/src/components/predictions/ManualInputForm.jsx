import { useMemo, useState } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { FIELD_RULES, validateManualPrediction } from '../../utils/validators'

const ORDER = ['pm25', 'pm10', 'pm1', 'temperature', 'humidity']
const GROUPS = [
  { id: 'particulas', label: 'Partículas', keys: ['pm25', 'pm10', 'pm1'] },
  { id: 'ambiente',   label: 'Ambiente',   keys: ['temperature', 'humidity'] },
]

export default function ManualInputForm({ onSubmit, isLoading }) {
  const [values, setValues] = useState(() => Object.fromEntries(ORDER.map(k => [k, ''])))
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => validateManualPrediction(values), [values])
  const hasErrors = Object.keys(errors).length > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hasErrors) {
      setTouched(Object.fromEntries(ORDER.map(k => [k, true])))
      return
    }
    onSubmit(Object.fromEntries(ORDER.map(k => [k, Number(values[k])])))
  }

  const fillTypical = () => {
    setValues(Object.fromEntries(ORDER.map(k => [k, String(FIELD_RULES[k].typical)])))
    setTouched({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {GROUPS.map(group => (
        <fieldset key={group.id} className="space-y-3">
          <legend className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">
            {group.label}
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.keys.map(key => {
              const rule = FIELD_RULES[key]
              const id = `field-${key}`
              const showError = touched[key] && errors[key]
              return (
                <div key={key} className="flex flex-col">
                  <label htmlFor={id} className="text-sm text-slate-300 mb-1">
                    {rule.label} <span className="text-slate-500 text-xs">({rule.unit})</span>
                  </label>
                  <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min={rule.min}
                    max={rule.max}
                    value={values[key]}
                    onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    onBlur={() => setTouched(t => ({ ...t, [key]: true }))}
                    aria-invalid={!!showError}
                    aria-describedby={`${id}-${showError ? 'error' : 'hint'}`}
                    className={`rounded-lg bg-slate-900/60 border px-3 py-2 text-white tabular-nums placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${
                      showError ? 'border-red-500/70 focus:ring-red-500/40' : 'border-white/10 focus:border-white/30'
                    }`}
                    placeholder={`p. ej. ${rule.typical}`}
                  />
                  {showError ? (
                    <p id={`${id}-error`} className="text-red-400 text-xs mt-1">{errors[key]}</p>
                  ) : (
                    <p id={`${id}-hint`} className="text-slate-500 text-xs mt-1">{rule.hint}</p>
                  )}
                </div>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={fillTypical}
          className="text-xs text-slate-400 hover:text-white underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
        >
          Usar valores típicos de Barranquilla
        </button>
        <button
          type="submit"
          disabled={hasErrors || isLoading}
          className={
            (hasErrors || isLoading)
              ? 'inline-flex items-center gap-2 rounded-lg bg-slate-800 text-slate-500 cursor-not-allowed font-semibold py-2 px-5 text-sm'
              : 'inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70'
          }
        >
          {isLoading && <LoadingSpinner size="sm" color="white" />}
          {isLoading ? 'Calculando' : 'Predecir'}
        </button>
      </div>
    </form>
  )
}
