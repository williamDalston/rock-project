import { useState, useRef, useCallback } from 'react'

interface HoldToZoomProps {
  src: string
  alt: string
  className?: string
  zoomScale?: number
  holdDuration?: number
}

export function HoldToZoom({
  src,
  alt,
  className = '',
  zoomScale = 2,
  holdDuration = 300
}: HoldToZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const holdTimer = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Start hold timer
    holdTimer.current = setTimeout(() => {
      setIsZoomed(true)
      // Set initial zoom position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomPosition({ x, y })
      }
    }, holdDuration)
  }, [holdDuration])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isZoomed || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomPosition({ x, y })
  }, [isZoomed])

  const handlePointerUp = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    setIsZoomed(false)
  }, [])

  const handlePointerLeave = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    setIsZoomed(false)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: 'none' }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-200 ${
          isZoomed ? 'scale-' + zoomScale : ''
        }`}
        style={isZoomed ? {
          transform: `scale(${zoomScale})`,
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
        } : undefined}
        draggable={false}
      />

      {/* Zoom indicator */}
      {isZoomed && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-white text-xs font-medium">
            {zoomScale}x zoom
          </span>
        </div>
      )}

      {/* Crosshair on zoom */}
      {isZoomed && (
        <div
          className="absolute w-8 h-8 pointer-events-none"
          style={{
            left: `${zoomPosition.x}%`,
            top: `${zoomPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/50" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/50" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 border border-white/70 rounded-full" />
        </div>
      )}
    </div>
  )
}

// Simpler version - just zooms on hold without position tracking
export function SimpleHoldToZoom({
  children,
  className = '',
  zoomScale = 1.5,
  holdDuration = 200
}: {
  children: React.ReactNode
  className?: string
  zoomScale?: number
  holdDuration?: number
}) {
  const [isZoomed, setIsZoomed] = useState(false)
  const holdTimer = useRef<NodeJS.Timeout | null>(null)

  const handlePointerDown = useCallback(() => {
    holdTimer.current = setTimeout(() => {
      setIsZoomed(true)
    }, holdDuration)
  }, [holdDuration])

  const handlePointerUp = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    setIsZoomed(false)
  }, [])

  return (
    <div
      className={`transition-transform duration-200 ${className}`}
      style={isZoomed ? { transform: `scale(${zoomScale})`, zIndex: 10 } : undefined}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {children}
    </div>
  )
}
