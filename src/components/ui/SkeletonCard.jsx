import SolidCard from './SolidCard'

export default function SkeletonCard() {
  return (
    <SolidCard className="p-5">
      <div className="animate-pulse space-y-3">
        <div className="h-9 w-9 rounded-xl bg-white/5" />
        <div className="h-7 w-20 rounded bg-white/5" />
        <div className="h-3 w-16 rounded bg-white/5" />
      </div>
    </SolidCard>
  )
}
