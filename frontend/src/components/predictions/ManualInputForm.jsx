import { useMemo, useState } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { FIELD_RULES, validateManualPrediction } from '../../utils/validators'

const ORDER = ['pm25', 'pm10', 'pm1', 'temperature', 'humidity']

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

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ORDER.map(key => {
        const rule = FIELD_RULES[key]
        const id = `field-${key}`
        const showError = touched[key] && errors[key]
        return (
          <div key={key} className="flex flex-col">
            <label htmlFor={id} className="text-sm text-slate-300 mb-1">
              {rule.label} <span className="text-slate-500">({rule.unit})</span>
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
              aria-describedby={showError ? `${id}-error` : undefined}
              className={`rounded-lg bg-slate-800/60 border px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                showError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'
              }`}
              placeholder={`Ej: ${(rule.min + rule.max) / 4}`}
            />
            {showError && <p id={`${id}-error`} className="text-red-400 text-xs mt-1">{errors[key]}</p>}
          </div>
        )
      })}
      <div className="sm:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={hasErrors || isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-2 px-6 transition-colors"
        >
          {isLoading && <LoadingSpinner size="sm" color="white" />}
          {isLoading ? 'Calculando…' : 'Predecir'}
        </button>
      </div>
    </form>
  )
}
