import type { TrustLevel, UserReputation } from '@/types'
import { REPUTATION_CONFIG } from '@/constants'

/**
 * Calculate trust level based on trading history
 */
export function calculateTrustLevel(
  completedTrades: number,
  completionRate: number,
  averageRating: number
): TrustLevel {
  const { ELITE_SELLER, TRUSTED_SELLER, VERIFIED_SELLER } = REPUTATION_CONFIG

  // Check Elite first (highest tier)
  if (
    completedTrades >= ELITE_SELLER.minTrades &&
    completionRate >= ELITE_SELLER.minCompletionRate &&
    averageRating >= ELITE_SELLER.minRating
  ) {
    return 'elite_seller'
  }

  // Check Trusted
  if (
    completedTrades >= TRUSTED_SELLER.minTrades &&
    completionRate >= TRUSTED_SELLER.minCompletionRate &&
    averageRating >= TRUSTED_SELLER.minRating
  ) {
    return 'trusted_seller'
  }

  // Check Verified
  if (
    completedTrades >= VERIFIED_SELLER.minTrades &&
    completionRate >= VERIFIED_SELLER.minCompletionRate &&
    averageRating >= VERIFIED_SELLER.minRating
  ) {
    return 'verified_seller'
  }

  return 'new_seller'
}

/**
 * Format rating as stars string
 */
export function formatRatingStars(rating: number): string {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return '★'.repeat(fullStars) + (hasHalf ? '½' : '') + '☆'.repeat(emptyStars)
}

/**
 * Get color class for rating
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-emerald-400'
  if (rating >= 4.0) return 'text-green-400'
  if (rating >= 3.0) return 'text-amber-400'
  if (rating >= 2.0) return 'text-orange-400'
  return 'text-rose-400'
}

/**
 * Get rating label
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 4.0) return 'Great'
  if (rating >= 3.0) return 'Good'
  if (rating >= 2.0) return 'Fair'
  return 'Poor'
}

/**
 * Calculate reputation score summary (0-100)
 */
export function calculateReputationScore(reputation: UserReputation): number {
  const ratingComponent = (reputation.averageRating / 5) * 40  // 40% weight
  const completionComponent = reputation.completionRate * 30    // 30% weight
  const volumeComponent = Math.min(1, reputation.completedTrades / 50) * 30  // 30% weight

  return Math.round(ratingComponent + completionComponent + volumeComponent)
}

/**
 * Get reputation score label
 */
export function getReputationScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Outstanding', color: 'text-emerald-400' }
  if (score >= 75) return { label: 'Excellent', color: 'text-green-400' }
  if (score >= 60) return { label: 'Good', color: 'text-blue-400' }
  if (score >= 40) return { label: 'Fair', color: 'text-amber-400' }
  return { label: 'Needs Improvement', color: 'text-rose-400' }
}

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(
  completedTrades: number,
  cancelledTrades: number
): number {
  const total = completedTrades + cancelledTrades
  if (total === 0) return 0
  return completedTrades / total
}

/**
 * Format completion rate as percentage
 */
export function formatCompletionRate(rate: number): string {
  return `${Math.round(rate * 100)}%`
}

/**
 * Check if user can leave a review for a trade
 */
export function canReviewTrade(
  tradeCompletedAt: { seconds: number } | undefined,
  existingReview: boolean
): boolean {
  if (!tradeCompletedAt || existingReview) return false

  const completedTime = tradeCompletedAt.seconds * 1000
  const now = Date.now()
  const daysSinceCompletion = (now - completedTime) / (1000 * 60 * 60 * 24)

  return daysSinceCompletion <= REPUTATION_CONFIG.REVIEW_WINDOW_DAYS
}

/**
 * Get days remaining to leave review
 */
export function getDaysToReview(tradeCompletedAt: { seconds: number }): number {
  const completedTime = tradeCompletedAt.seconds * 1000
  const reviewDeadline = completedTime + (REPUTATION_CONFIG.REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000)
  const remaining = reviewDeadline - Date.now()

  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)))
}

/**
 * Create default reputation for new user
 */
export function createDefaultReputation(userId: string): UserReputation {
  return {
    userId,
    averageRating: 0,
    totalReviews: 0,
    completedTrades: 0,
    cancelledTrades: 0,
    completionRate: 0,
    trustLevel: 'new_seller',
    lastUpdated: { seconds: Math.floor(Date.now() / 1000) } as any
  }
}

/**
 * Update reputation with new review
 */
export function updateReputationWithReview(
  current: UserReputation,
  newRating: number
): Partial<UserReputation> {
  const newTotalReviews = current.totalReviews + 1
  const newAverageRating =
    ((current.averageRating * current.totalReviews) + newRating) / newTotalReviews

  const newTrustLevel = calculateTrustLevel(
    current.completedTrades,
    current.completionRate,
    newAverageRating
  )

  return {
    averageRating: newAverageRating,
    totalReviews: newTotalReviews,
    trustLevel: newTrustLevel
  }
}

/**
 * Update reputation with completed trade
 */
export function updateReputationWithTrade(
  current: UserReputation,
  wasCompleted: boolean
): Partial<UserReputation> {
  const newCompletedTrades = wasCompleted
    ? current.completedTrades + 1
    : current.completedTrades

  const newCancelledTrades = wasCompleted
    ? current.cancelledTrades
    : current.cancelledTrades + 1

  const newCompletionRate = calculateCompletionRate(newCompletedTrades, newCancelledTrades)

  const newTrustLevel = calculateTrustLevel(
    newCompletedTrades,
    newCompletionRate,
    current.averageRating
  )

  return {
    completedTrades: newCompletedTrades,
    cancelledTrades: newCancelledTrades,
    completionRate: newCompletionRate,
    trustLevel: newTrustLevel
  }
}
