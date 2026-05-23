export default function Badge({ label, color }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
      style={{ backgroundColor: `${color}33`, color, border: `1px solid ${color}55` }}
    >
      {label}
    </span>
  )
}
