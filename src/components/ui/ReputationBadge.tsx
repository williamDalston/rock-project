import { Star, User } from 'lucide-react'
import type { UserReputation } from '@/types'
import { TRUST_LEVEL_STYLES } from '@/constants'
import { getRatingColor, calculateReputationScore } from '@/services/reputation'

interface ReputationBadgeProps {
  reputation: UserReputation | null
  size?: 'sm' | 'md' | 'lg'
  showRating?: boolean
  showLabel?: boolean
}

export function ReputationBadge({
  reputation,
  size = 'md',
  showRating = true,
  showLabel = false
}: ReputationBadgeProps) {
  if (!reputation) return null

  const style = TRUST_LEVEL_STYLES[reputation.trustLevel]

  const sizeClasses = {
    sm: 'text-[8px] px-1.5 py-0.5 space-x-1',
    md: 'text-[10px] px-2 py-1 space-x-1.5',
    lg: 'text-xs px-2.5 py-1.5 space-x-2'
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}
      `}
      title={style.label}
    >
      <span>{style.icon}</span>
      {showLabel && <span>{style.label}</span>}
      {showRating && reputation.totalReviews > 0 && (
        <>
          <span className={`font-bold ${getRatingColor(reputation.averageRating)}`}>
            {reputation.averageRating.toFixed(1)}
          </span>
          <span className="text-stone-500">({reputation.totalReviews})</span>
        </>
      )}
    </span>
  )
}

// Compact star rating display
interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function StarRating({ rating, size = 'md', showValue = true }: StarRatingProps) {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm'
  }

  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSizes[size]} ${
              star <= fullStars
                ? 'fill-amber-400 text-amber-400'
                : star === fullStars + 1 && hasHalf
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-stone-600'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className={`${textSizes[size]} ${getRatingColor(rating)} font-medium`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Full reputation card for profiles
interface ReputationCardProps {
  reputation: UserReputation
}

export function ReputationCard({ reputation }: ReputationCardProps) {
  const style = TRUST_LEVEL_STYLES[reputation.trustLevel]
  const score = calculateReputationScore(reputation)

  return (
    <div className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{style.icon}</span>
          <div>
            <h4 className={`font-bold ${style.text}`}>{style.label}</h4>
            <p className="text-[10px] text-stone-500">Reputation Score: {score}/100</p>
          </div>
        </div>
        {reputation.totalReviews > 0 && (
          <StarRating rating={reputation.averageRating} size="md" />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-stone-800/50 rounded-lg p-2">
          <p className="text-lg font-bold text-white">{reputation.completedTrades}</p>
          <p className="text-[10px] text-stone-500">Trades</p>
        </div>
        <div className="bg-stone-800/50 rounded-lg p-2">
          <p className="text-lg font-bold text-white">{reputation.totalReviews}</p>
          <p className="text-[10px] text-stone-500">Reviews</p>
        </div>
        <div className="bg-stone-800/50 rounded-lg p-2">
          <p className="text-lg font-bold text-white">
            {Math.round(reputation.completionRate * 100)}%
          </p>
          <p className="text-[10px] text-stone-500">Complete</p>
        </div>
      </div>
    </div>
  )
}

// Mini badge for market listings
interface SellerBadgeProps {
  reputation: UserReputation | null
  size?: 'sm' | 'md'
  showStats?: boolean
}

export function SellerBadge({ reputation, size = 'sm', showStats = false }: SellerBadgeProps) {
  const sizeClasses = {
    sm: { text: 'text-[10px]', icon: 'w-3 h-3', space: 'space-x-1' },
    md: { text: 'text-xs', icon: 'w-4 h-4', space: 'space-x-1.5' }
  }

  const sizeClass = sizeClasses[size]

  if (!reputation || reputation.trustLevel === 'new_seller') {
    return (
      <span className={`inline-flex items-center ${sizeClass.space} ${sizeClass.text} text-stone-500`}>
        <User className={sizeClass.icon} />
        <span>New Seller</span>
      </span>
    )
  }

  const style = TRUST_LEVEL_STYLES[reputation.trustLevel]

  return (
    <span className={`inline-flex items-center ${sizeClass.space} ${sizeClass.text} ${style.text}`}>
      <span>{style.icon}</span>
      {reputation.totalReviews > 0 && (
        <span className="font-medium">
          {reputation.averageRating.toFixed(1)} ({reputation.totalReviews})
        </span>
      )}
      {showStats && (
        <span className="text-stone-500">
          · {reputation.completedTrades} trades
        </span>
      )}
    </span>
  )
}
