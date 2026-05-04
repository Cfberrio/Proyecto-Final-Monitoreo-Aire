import { useEffect, useRef, useState } from 'react'

export default function AnimatedNumber({ value, decimals = 1, durationMs = 320 }) {
  const [display, setDisplay] = useState(value ?? 0)
  const startRef = useRef(value ?? 0)
  const fromRef = useRef(value ?? 0)
  const tsRef = useRef(0)

  useEffect(() => {
    if (value == null) return
    fromRef.current = display
    startRef.current = value
    tsRef.current = performance.now()
    const prefersReduce = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReduce) {
      setDisplay(value)
      return
    }
    let raf = 0
    const step = (now) => {
      const t = Math.min(1, (now - tsRef.current) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(fromRef.current + (startRef.current - fromRef.current) * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs])

  if (value == null) return <span className="tabular-nums">—</span>
  return <span className="tabular-nums">{Number(display).toFixed(decimals)}</span>
}
