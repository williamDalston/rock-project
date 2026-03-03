import { useState, useRef, useEffect } from 'react'
import { getFallbackImageUrl } from '@/constants'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: 'square' | '4/5' | '3/4' | '16/9'
  priority?: boolean
  showVignette?: boolean
  hoverZoom?: boolean
}

export function OptimizedImage({
  src: srcProp,
  alt,
  className = '',
  aspectRatio = 'square',
  priority = false,
  showVignette = true,
  hoverZoom = true
}: OptimizedImageProps) {
  const src = srcProp && srcProp.trim() ? srcProp : getFallbackImageUrl()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [currentSrc, setCurrentSrc] = useState(src)
  const imgRef = useRef<HTMLDivElement>(null)

  // Reset state when src changes (e.g. after fallback)
  useEffect(() => {
    setCurrentSrc(src)
    setIsLoaded(false)
  }, [src])

  // Aspect ratio classes
  const aspectClasses = {
    square: 'aspect-square',
    '4/5': 'aspect-[4/5]',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-video'
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0
      }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [priority])

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-stone-800 group ${aspectClasses[aspectRatio]} ${className}`}
    >
      {/* Skeleton loader with shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 skeleton" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-700/30 to-transparent skeleton-shimmer" />
        </div>
      )}

      {/* Actual image - onError try fallback once so we don't stay on skeleton */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          width={400}
          height={aspectRatio === 'square' ? 400 : aspectRatio === '4/5' ? 500 : aspectRatio === '3/4' ? 533 : 225}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            const fallback = getFallbackImageUrl()
            if (currentSrc !== fallback) {
              setCurrentSrc(fallback)
            } else {
              setIsLoaded(true)
            }
          }}
          className={`
            w-full h-full object-cover
            transition-all duration-500 ease-out
            ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
            ${hoverZoom ? 'group-hover:scale-[1.03]' : ''}
          `}
        />
      )}

      {/* Subtle vignette overlay for depth */}
      {showVignette && isLoaded && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)'
          }}
        />
      )}

      {/* Subtle inner shadow for framing */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10" />
    </div>
  )
}
