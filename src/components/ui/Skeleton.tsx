/**
 * Rock-themed skeleton loaders for loading states
 */

interface SkeletonProps {
  className?: string
}

// Basic shimmer skeleton
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-stone-800/50 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-stone-700/30 to-transparent" />
    </div>
  )
}

// Rock card skeleton for market feed
export function RockCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-stone-900 border border-stone-800">
      {/* Image placeholder */}
      <Skeleton className="aspect-[4/5] w-full" />

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 rounded-lg" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Trending card skeleton
export function TrendingCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-44 rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
      {/* Image */}
      <Skeleton className="aspect-square w-full" />

      {/* Content */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Collection grid item skeleton
export function CollectionItemSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
      <Skeleton className="aspect-square w-full" />
      <div className="p-2 space-y-1.5">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  )
}

// Feed card skeleton (full screen)
export function FeedCardSkeleton() {
  return (
    <div className="h-full w-full bg-stone-950 relative">
      <Skeleton className="absolute inset-0" />

      {/* Bottom content overlay */}
      <div className="absolute bottom-0 left-0 right-20 p-4 space-y-3">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-7 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Right action bar */}
      <div className="absolute right-4 bottom-32 space-y-5">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
  )
}

// Profile header skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>
      {/* XP Bar */}
      <Skeleton className="h-3 w-full rounded-full" />
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  )
}

// Market feed skeleton (multiple cards)
export function MarketFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-8 p-2">
      {/* Trending section */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32 rounded-lg ml-4" />
        <div className="flex space-x-3 px-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <TrendingCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Main feed */}
      {[...Array(count)].map((_, i) => (
        <RockCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Collection grid skeleton
export function CollectionGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {[...Array(count)].map((_, i) => (
        <CollectionItemSkeleton key={i} />
      ))}
    </div>
  )
}
