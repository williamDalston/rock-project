import { Timestamp } from 'firebase/firestore'

interface FreshnessBadgeProps {
  createdAt: Timestamp | { seconds: number } | null
  className?: string
}

/**
 * Calculate how fresh a listing is and return appropriate display
 */
function getTimeAgo(timestamp: Timestamp | { seconds: number } | null): {
  text: string
  isNew: boolean
  hoursAgo: number
} {
  if (!timestamp) return { text: '', isNew: false, hoursAgo: Infinity }

  const seconds = 'seconds' in timestamp ? timestamp.seconds : 0
  const date = new Date(seconds * 1000)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  // Within 1 hour
  if (diffHours < 1) {
    const mins = Math.floor(diffMs / (1000 * 60))
    return { text: mins <= 1 ? 'Just now' : `${mins}m ago`, isNew: true, hoursAgo: diffHours }
  }

  // Within 24 hours - show as "new"
  if (diffHours < 24) {
    const hours = Math.floor(diffHours)
    return { text: `${hours}h ago`, isNew: true, hoursAgo: diffHours }
  }

  // Within 7 days
  if (diffDays < 7) {
    const days = Math.floor(diffDays)
    return { text: `${days}d ago`, isNew: false, hoursAgo: diffHours }
  }

  // Older
  return { text: '', isNew: false, hoursAgo: diffHours }
}

export function FreshnessBadge({ createdAt, className = '' }: FreshnessBadgeProps) {
  const { text, isNew } = getTimeAgo(createdAt)

  if (!text) return null

  return (
    <span
      className={`inline-flex items-center text-[9px] font-medium tracking-wide
        ${isNew
          ? 'text-emerald-400'
          : 'text-stone-500'
        } ${className}`}
    >
      {isNew && <span className="mr-1">●</span>}
      {text}
    </span>
  )
}

/**
 * Hook to check if a rock is "new" (< 24h old)
 */
export function isNewListing(createdAt: Timestamp | { seconds: number } | null): boolean {
  const { isNew } = getTimeAgo(createdAt)
  return isNew
}

/**
 * Get hours since listing (for subtle glow intensity)
 */
export function getHoursSinceListing(createdAt: Timestamp | { seconds: number } | null): number {
  const { hoursAgo } = getTimeAgo(createdAt)
  return hoursAgo
}
