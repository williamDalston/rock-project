/**
 * Skeleton loading card with shimmer animation
 * Used as placeholder while content loads
 */

interface SkeletonCardProps {
  variant?: 'market' | 'collection' | 'feed'
}

export function SkeletonCard({ variant = 'market' }: SkeletonCardProps) {
  if (variant === 'feed') {
    return (
      <div className="h-full w-full bg-stone-900 relative overflow-hidden">
        {/* Full screen skeleton for feed */}
        <div className="absolute inset-0 skeleton-shimmer" />

        {/* Bottom content area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          <div className="h-4 bg-stone-800 rounded w-20 skeleton-shimmer" />
          <div className="h-6 bg-stone-800 rounded w-3/4 skeleton-shimmer" />
          <div className="h-4 bg-stone-800 rounded w-full skeleton-shimmer" />
          <div className="flex space-x-2">
            <div className="h-6 w-16 bg-stone-800 rounded-full skeleton-shimmer" />
            <div className="h-6 w-16 bg-stone-800 rounded-full skeleton-shimmer" />
          </div>
        </div>

        {/* Side action bar skeleton */}
        <div className="absolute right-4 bottom-24 space-y-4">
          <div className="w-10 h-10 bg-stone-800 rounded-full skeleton-shimmer" />
          <div className="w-10 h-10 bg-stone-800 rounded-full skeleton-shimmer" />
          <div className="w-10 h-10 bg-stone-800 rounded-full skeleton-shimmer" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800">
      {/* Image placeholder */}
      <div className="aspect-square bg-stone-800 relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      {/* Content area */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <div className="h-5 bg-stone-800 rounded w-3/4 skeleton-shimmer" />

        {/* Subtitle/type */}
        <div className="h-3 bg-stone-800 rounded w-1/2 skeleton-shimmer" />

        {/* Badge row */}
        <div className="flex items-center space-x-2 pt-1">
          <div className="h-5 w-14 bg-stone-800 rounded-full skeleton-shimmer" />
          {variant === 'market' && (
            <div className="h-5 w-10 bg-stone-800 rounded-full skeleton-shimmer" />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Grid of skeleton cards for loading states
 */
interface SkeletonGridProps {
  count?: number
  variant?: 'market' | 'collection'
}

export function SkeletonGrid({ count = 6, variant = 'market' }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  )
}

/**
 * Inline skeleton for text loading
 */
interface SkeletonTextProps {
  width?: string
  height?: string
  className?: string
}

export function SkeletonText({
  width = 'w-24',
  height = 'h-4',
  className = ''
}: SkeletonTextProps) {
  return (
    <div className={`bg-stone-800 rounded skeleton-shimmer ${width} ${height} ${className}`} />
  )
}
