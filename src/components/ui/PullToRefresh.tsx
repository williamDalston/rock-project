import { useState, useRef, useCallback } from 'react'
import { Hexagon } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  disabled?: boolean
}

const PULL_THRESHOLD = 80
const MAX_PULL = 120

export function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showCrystals, setShowCrystals] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const isPulling = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    const container = containerRef.current
    if (!container || container.scrollTop > 0) return

    startY.current = e.touches[0].clientY
    isPulling.current = true
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || disabled || isRefreshing) return

    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current

    if (diff > 0) {
      // Apply resistance
      const resistance = 0.4
      const distance = Math.min(diff * resistance, MAX_PULL)
      setPullDistance(distance)

      if (distance > PULL_THRESHOLD * 0.5) {
        setShowCrystals(true)
      }
    }
  }, [disabled, isRefreshing])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return
    isPulling.current = false

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true)
      setPullDistance(60) // Hold at refresh position

      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        setShowCrystals(false)
      }
    } else {
      setPullDistance(0)
      setShowCrystals(false)
    }
  }, [pullDistance, isRefreshing, onRefresh])

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1)

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex flex-col items-center justify-end overflow-hidden transition-all duration-200"
        style={{
          height: pullDistance,
          opacity: progress
        }}
      >
        <div className="relative pb-4">
          {/* Central crystal */}
          <Hexagon
            className={`w-8 h-8 text-emerald-500 transition-transform ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${progress * 180}deg) scale(${0.5 + progress * 0.5})`,
            }}
            strokeWidth={1.5}
          />

          {/* Growing crystal formations */}
          {showCrystals && (
            <>
              <div
                className="absolute -left-3 top-1/2 -translate-y-1/2"
                style={{
                  opacity: Math.max(0, (progress - 0.5) * 2),
                  transform: `scale(${Math.max(0, (progress - 0.5) * 2)})`
                }}
              >
                <Hexagon className="w-4 h-4 text-emerald-400" strokeWidth={1} />
              </div>
              <div
                className="absolute -right-3 top-1/2 -translate-y-1/2"
                style={{
                  opacity: Math.max(0, (progress - 0.5) * 2),
                  transform: `scale(${Math.max(0, (progress - 0.5) * 2)})`
                }}
              >
                <Hexagon className="w-4 h-4 text-emerald-400" strokeWidth={1} />
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-2"
                style={{
                  opacity: Math.max(0, (progress - 0.7) * 3.33),
                  transform: `scale(${Math.max(0, (progress - 0.7) * 3.33)})`
                }}
              >
                <Hexagon className="w-3 h-3 text-emerald-300" strokeWidth={1} />
              </div>
            </>
          )}
        </div>

        <p className="text-[10px] text-emerald-500/80 uppercase tracking-widest mt-1">
          {isRefreshing ? 'Crystallizing...' : progress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
        </p>
      </div>

      {children}
    </div>
  )
}
