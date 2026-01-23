import { useRef, useState, useCallback } from 'react'

interface SwipeToDismissOptions {
  onDismiss: () => void
  threshold?: number
  direction?: 'down' | 'up' | 'both'
}

interface SwipeState {
  translateY: number
  opacity: number
  isDragging: boolean
}

export function useSwipeToDismiss({
  onDismiss,
  threshold = 150,
  direction = 'down'
}: SwipeToDismissOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)
  const [swipeState, setSwipeState] = useState<SwipeState>({
    translateY: 0,
    opacity: 1,
    isDragging: false
  })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    startY.current = touch.clientY
    currentY.current = touch.clientY
    setSwipeState(prev => ({ ...prev, isDragging: true }))
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeState.isDragging) return

    const touch = e.touches[0]
    currentY.current = touch.clientY
    const deltaY = currentY.current - startY.current

    // Only allow movement in the specified direction
    const allowedDelta =
      direction === 'down' ? Math.max(0, deltaY) :
      direction === 'up' ? Math.min(0, deltaY) :
      deltaY

    // Add resistance for smoother feel
    const resistedDelta = allowedDelta * 0.6
    const opacity = Math.max(0.3, 1 - Math.abs(resistedDelta) / (threshold * 2))

    setSwipeState({
      translateY: resistedDelta,
      opacity,
      isDragging: true
    })
  }, [swipeState.isDragging, direction, threshold])

  const handleTouchEnd = useCallback(() => {
    const deltaY = currentY.current - startY.current
    const shouldDismiss =
      (direction === 'down' && deltaY > threshold) ||
      (direction === 'up' && deltaY < -threshold) ||
      (direction === 'both' && Math.abs(deltaY) > threshold)

    if (shouldDismiss) {
      // Animate out before dismissing
      setSwipeState({
        translateY: direction === 'up' ? -window.innerHeight : window.innerHeight,
        opacity: 0,
        isDragging: false
      })
      setTimeout(onDismiss, 200)
    } else {
      // Snap back
      setSwipeState({
        translateY: 0,
        opacity: 1,
        isDragging: false
      })
    }
  }, [direction, threshold, onDismiss])

  const swipeProps = {
    ref: containerRef,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    style: {
      transform: `translateY(${swipeState.translateY}px)`,
      opacity: swipeState.opacity,
      transition: swipeState.isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
      touchAction: 'pan-x' as const
    }
  }

  return {
    swipeProps,
    swipeState,
    containerRef
  }
}
