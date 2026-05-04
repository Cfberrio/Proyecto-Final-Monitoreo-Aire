import clsx from 'clsx'

const RANGES = [
  { key: '6h',  label: '6h' },
  { key: '24h', label: '24h' },
  { key: '7d',  label: '7d' },
]

export default function RangeSelector({ value, onChange }) {
  return (
    <div role="tablist" className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
      {RANGES.map(r => (
        <button
          key={r.key}
          role="tab"
          aria-selected={value === r.key}
          onClick={() => onChange(r.key)}
          className={clsx(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            value === r.key ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
