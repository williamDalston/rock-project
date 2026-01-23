import type { TradeProposal, TradeStatus, Rock } from '@/types'
import { TRADING_CONFIG } from '@/constants'

/**
 * Check if a trade proposal has expired
 */
export function isProposalExpired(proposal: TradeProposal): boolean {
  if (!proposal.createdAt) return false

  const createdTime = proposal.createdAt.seconds * 1000
  const now = Date.now()
  const expiryDays = proposal.status === 'countered'
    ? TRADING_CONFIG.COUNTER_EXPIRY_DAYS
    : TRADING_CONFIG.PROPOSAL_EXPIRY_DAYS

  const expiryTime = createdTime + (expiryDays * 24 * 60 * 60 * 1000)
  return now > expiryTime
}

/**
 * Calculate days until proposal expires
 */
export function getDaysUntilExpiry(proposal: TradeProposal): number {
  if (!proposal.createdAt) return 0

  const createdTime = proposal.createdAt.seconds * 1000
  const expiryDays = proposal.status === 'countered'
    ? TRADING_CONFIG.COUNTER_EXPIRY_DAYS
    : TRADING_CONFIG.PROPOSAL_EXPIRY_DAYS

  const expiryTime = createdTime + (expiryDays * 24 * 60 * 60 * 1000)
  const remaining = expiryTime - Date.now()

  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)))
}

/**
 * Calculate fairness score between two rocks (for UI hints)
 * Returns 0-100 where 50 is "fair", higher = good for receiver
 */
export function calculateTradeFairness(offeredRock: Rock, targetRock: Rock): number {
  const offeredValue = calculateRockValue(offeredRock)
  const targetValue = calculateRockValue(targetRock)

  if (targetValue === 0) return 50

  const ratio = offeredValue / targetValue

  // Convert to 0-100 scale, clamped
  return Math.min(100, Math.max(0, ratio * 50))
}

/**
 * Get fairness label based on score
 */
export function getFairnessLabel(score: number): { label: string; color: string } {
  if (score >= 60) return { label: 'Great Deal', color: 'text-emerald-400' }
  if (score >= 45) return { label: 'Fair Trade', color: 'text-blue-400' }
  if (score >= 30) return { label: 'Below Value', color: 'text-amber-400' }
  return { label: 'Poor Value', color: 'text-rose-400' }
}

/**
 * Calculate estimated value of a rock based on rarity and likes
 */
function calculateRockValue(rock: Rock): number {
  const rarityValue = rock.rarityScore * 10
  const likesValue = (rock.likes || 0) * 2
  const selfCollectedBonus = rock.isSelfCollected ? 5 : 0
  const verificationBonus = rock.verificationLevel === 'expert_verified' ? 15
    : rock.verificationLevel === 'community_verified' ? 5 : 0

  return rarityValue + likesValue + selfCollectedBonus + verificationBonus
}

/**
 * Get human-readable status label
 */
export function getTradeStatusLabel(status: TradeStatus): string {
  const labels: Record<TradeStatus, string> = {
    proposed: 'Pending',
    countered: 'Counter Offered',
    accepted: 'Accepted',
    rejected: 'Declined',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return labels[status]
}

/**
 * Get status color class
 */
export function getTradeStatusColor(status: TradeStatus): string {
  const colors: Record<TradeStatus, string> = {
    proposed: 'text-amber-400',
    countered: 'text-blue-400',
    accepted: 'text-emerald-400',
    rejected: 'text-rose-400',
    completed: 'text-emerald-500',
    cancelled: 'text-stone-500'
  }
  return colors[status]
}

/**
 * Get status background color class
 */
export function getTradeStatusBgColor(status: TradeStatus): string {
  const colors: Record<TradeStatus, string> = {
    proposed: 'bg-amber-900/30 border-amber-800',
    countered: 'bg-blue-900/30 border-blue-800',
    accepted: 'bg-emerald-900/30 border-emerald-800',
    rejected: 'bg-rose-900/30 border-rose-800',
    completed: 'bg-emerald-900/50 border-emerald-700',
    cancelled: 'bg-stone-800/50 border-stone-700'
  }
  return colors[status]
}

/**
 * Check if a trade can be acted upon
 */
export function canActOnTrade(proposal: TradeProposal, userId: string): {
  canAccept: boolean
  canReject: boolean
  canCounter: boolean
  canCancel: boolean
  canComplete: boolean
} {
  const isExpired = isProposalExpired(proposal)
  const isRecipient = proposal.toUserId === userId
  const isSender = proposal.fromUserId === userId

  return {
    canAccept: isRecipient && proposal.status === 'proposed' && !isExpired,
    canReject: isRecipient && (proposal.status === 'proposed' || proposal.status === 'countered') && !isExpired,
    canCounter: isRecipient && proposal.status === 'proposed' && !isExpired,
    canCancel: isSender && (proposal.status === 'proposed' || proposal.status === 'countered') && !isExpired,
    canComplete: (isRecipient || isSender) && proposal.status === 'accepted'
  }
}

/**
 * Format trade date for display
 */
export function formatTradeDate(timestamp: { seconds: number }): string {
  const date = new Date(timestamp.seconds * 1000)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
