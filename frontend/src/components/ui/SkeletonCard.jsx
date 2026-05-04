import GlassCard from './GlassCard'

export default function SkeletonCard() {
  return (
    <GlassCard className="p-5">
      <div className="animate-pulse space-y-3">
        <div className="h-7 w-7 rounded bg-white/10" />
        <div className="h-8 w-24 rounded bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/10" />
      </div>
    </GlassCard>
  )
}
