import { useState, useCallback, useRef } from 'react'
import { Heart, Share2, Bookmark, Sparkles, ZoomIn } from 'lucide-react'
import type { Specimen } from '@/types'

interface FeedCardProps {
  specimen: Specimen & { imageUrl: string; likes: number; username: string }
  isActive: boolean
}

const TYPE_COLORS: Record<string, string> = {
  crystal: 'bg-violet-500/80',
  mineral: 'bg-emerald-500/80',
  rock: 'bg-stone-500/80',
  gem: 'bg-rose-500/80',
  metal: 'bg-amber-500/80',
  fossil: 'bg-orange-500/80',
  texture: 'bg-cyan-500/80',
  tektite: 'bg-lime-500/80',
  feldspar: 'bg-indigo-500/80',
  chalcedony: 'bg-teal-500/80'
}

export function FeedCard({ specimen, isActive }: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(specimen.likes)
  const [showHeart, setShowHeart] = useState(false)

  // Hold-to-zoom state
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const holdTimer = useRef<NodeJS.Timeout | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleDoubleTap = useCallback(() => {
    if (!isLiked) {
      setIsLiked(true)
      setLikeCount((prev) => prev + 1)
    }
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 800)
  }, [isLiked])

  const handleLike = useCallback(() => {
    setIsLiked((prev) => {
      // Use the functional update to get the current value and update count accordingly
      setLikeCount((count) => prev ? count - 1 : count + 1)
      return !prev
    })
  }, [])

  const handleSave = useCallback(() => {
    setIsSaved((prev) => !prev)
  }, [])

  const formatCount = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toString()
  }

  // Hold-to-zoom handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    holdTimer.current = setTimeout(() => {
      setIsZoomed(true)
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomPosition({ x, y })
      }
    }, 300)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isZoomed || !imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
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

  return (
    <div
      className="relative w-full h-full flex-shrink-0 snap-start snap-always"
      onDoubleClick={handleDoubleTap}
    >
      {/* Background Image with Hold-to-Zoom */}
      <div
        ref={imageRef}
        className="absolute inset-0 bg-stone-950 overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <img
          src={specimen.imageUrl}
          alt={specimen.title}
          className={`
            w-full h-full object-cover
            transition-all duration-300
            ${isActive ? 'scale-100' : 'scale-105 blur-sm'}
          `}
          style={isZoomed ? {
            transform: 'scale(2.5)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          } : undefined}
          loading="lazy"
          draggable={false}
        />

        {/* Gradient Overlays - hide when zoomed */}
        {!isZoomed && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </>
        )}

        {/* Zoom indicator */}
        {isZoomed && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full z-40 flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-medium">2.5x zoom</span>
          </div>
        )}
      </div>

      {/* Double-tap Heart Animation */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <Heart
            className="w-32 h-32 text-rose-500 fill-rose-500 animate-ping"
            style={{ animationDuration: '0.6s' }}
          />
        </div>
      )}

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
              Discover
            </span>
          </div>
          <span
            className={`
              px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white
              ${TYPE_COLORS[specimen.type] || 'bg-stone-500/80'}
            `}
          >
            {specimen.type}
          </span>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center space-y-5">
        {/* Profile */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5">
            <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-white font-bold text-sm">
              {specimen.username.charAt(0)}
            </div>
          </div>
        </div>

        {/* Like */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center group"
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <div
            className={`
              p-3 rounded-full transition-all duration-200
              ${isLiked ? 'bg-rose-500/20' : 'bg-black/40 group-hover:bg-black/60'}
            `}
          >
            <Heart
              className={`
                w-7 h-7 transition-all duration-200
                ${isLiked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-white'}
              `}
            />
          </div>
          <span className="text-white text-xs font-bold mt-1 tabular-nums">
            {formatCount(likeCount)}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex flex-col items-center group"
          aria-label={isSaved ? 'Unsave' : 'Save'}
        >
          <div
            className={`
              p-3 rounded-full transition-all duration-200
              ${isSaved ? 'bg-amber-500/20' : 'bg-black/40 group-hover:bg-black/60'}
            `}
          >
            <Bookmark
              className={`
                w-7 h-7 transition-all duration-200
                ${isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'}
              `}
            />
          </div>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center group" aria-label="Share">
          <div className="p-3 rounded-full bg-black/40 group-hover:bg-black/60 transition-colors">
            <Share2 className="w-7 h-7 text-white" />
          </div>
        </button>
      </div>

      {/* Bottom Info Panel */}
      <div className="absolute bottom-0 left-0 right-20 p-4 z-20">
        {/* Username */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-white font-bold text-sm">@{specimen.username}</span>
          <span className="text-emerald-400 text-xs">Verified Collector</span>
        </div>

        {/* Title */}
        <h2 className="text-white font-serif text-2xl font-bold mb-2 leading-tight">
          {specimen.title}
        </h2>

        {/* Description */}
        <p className="text-white/80 text-sm leading-relaxed line-clamp-2 mb-3">
          {specimen.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {specimen.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll Hint (only on first card) */}
      {isActive && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-60">
          <div className="flex flex-col items-center text-white/60">
            <div className="w-0.5 h-8 bg-white/40 rounded-full" />
            <span className="text-[11px] mt-1 uppercase tracking-widest">Scroll</span>
          </div>
        </div>
      )}
    </div>
  )
}
