import type { Rock, TrendingMetrics } from '@/types'
import { TRENDING_CONFIG } from '@/constants'

/**
 * Calculate trending score for a rock
 * Formula: (likes * 0.6) + (rarity * 0.3) + (recency * 0.1)
 */
export function calculateTrendingScore(rock: Rock, nowMs: number = Date.now()): number {
  const likeScore = calculateLikeScore(rock.likes || 0)
  const rarityScore = calculateRarityBonus(rock.rarityScore)
  const recencyScore = calculateRecencyScore(rock.createdAt, nowMs)

  return (likeScore * TRENDING_CONFIG.WEIGHT_LIKES) +
    (rarityScore * TRENDING_CONFIG.WEIGHT_RARITY) +
    (recencyScore * TRENDING_CONFIG.WEIGHT_RECENCY)
}

/**
 * Calculate normalized like score (0-100 scale)
 * Uses logarithmic scaling to prevent runaway scores
 */
function calculateLikeScore(likes: number): number {
  // 1 like = 10, 10 likes = 33, 100 likes = 66, 1000 likes = 100
  if (likes <= 0) return 0
  return Math.min(100, Math.log10(likes + 1) * 33)
}

/**
 * Calculate rarity bonus (0-100 scale based on rarity 1-10)
 */
function calculateRarityBonus(rarity: number): number {
  return (rarity / 10) * 100
}

/**
 * Calculate recency score with exponential decay
 * Halves every HALF_LIFE_HOURS hours
 */
function calculateRecencyScore(
  createdAt: { seconds: number } | undefined,
  nowMs: number
): number {
  if (!createdAt) return 0

  const createdMs = createdAt.seconds * 1000
  const ageMs = nowMs - createdMs
  const ageHours = ageMs / (1000 * 60 * 60)

  // Check max age
  const maxAgeHours = TRENDING_CONFIG.MAX_AGE_DAYS * 24
  if (ageHours > maxAgeHours) return 0

  // Exponential decay: score = 100 * (0.5)^(age/halfLife)
  const halfLifeHours = TRENDING_CONFIG.HALF_LIFE_HOURS
  const decayFactor = Math.pow(0.5, ageHours / halfLifeHours)

  return 100 * decayFactor
}

/**
 * Generate trending metrics for a rock
 */
export function generateTrendingMetrics(rock: Rock): TrendingMetrics {
  const now = Date.now()

  const likeScore = calculateLikeScore(rock.likes || 0)
  const rarityBonus = calculateRarityBonus(rock.rarityScore)
  const recencyScore = calculateRecencyScore(rock.createdAt, now)

  return {
    rockId: rock.id,
    likes: rock.likes || 0,
    rarityScore: rock.rarityScore,
    createdAt: rock.createdAt,
    likeScore: likeScore * TRENDING_CONFIG.WEIGHT_LIKES,
    rarityBonus: rarityBonus * TRENDING_CONFIG.WEIGHT_RARITY,
    recencyScore: recencyScore * TRENDING_CONFIG.WEIGHT_RECENCY,
    trendingScore: calculateTrendingScore(rock, now),
    lastCalculated: { seconds: Math.floor(now / 1000) } as any
  }
}

/**
 * Sort rocks by trending score
 */
export function sortByTrending(rocks: Rock[]): Rock[] {
  const now = Date.now()
  return [...rocks].sort((a, b) => {
    const scoreA = calculateTrendingScore(a, now)
    const scoreB = calculateTrendingScore(b, now)
    return scoreB - scoreA
  })
}

/**
 * Get top trending rocks
 */
export function getTopTrending(
  rocks: Rock[],
  limit: number = TRENDING_CONFIG.TRENDING_SECTION_SIZE
): Rock[] {
  const now = Date.now()

  return rocks
    .filter(rock => (rock.likes || 0) >= TRENDING_CONFIG.MIN_LIKES_FOR_TRENDING)
    .map(rock => ({
      rock,
      score: calculateTrendingScore(rock, now)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.rock)
}

/**
 * Check if a rock qualifies for trending
 */
export function qualifiesForTrending(rock: Rock): boolean {
  if ((rock.likes || 0) < TRENDING_CONFIG.MIN_LIKES_FOR_TRENDING) return false

  // Check if too old
  if (!rock.createdAt) return false
  const ageMs = Date.now() - (rock.createdAt.seconds * 1000)
  const ageHours = ageMs / (1000 * 60 * 60)
  const maxAgeHours = TRENDING_CONFIG.MAX_AGE_DAYS * 24

  return ageHours <= maxAgeHours
}

/**
 * Get trending reason label
 */
export function getTrendingReason(rock: Rock): string {
  const likes = rock.likes || 0
  const rarity = rock.rarityScore

  if (!rock.createdAt) return 'Popular'

  const ageHours = (Date.now() - rock.createdAt.seconds * 1000) / (1000 * 60 * 60)

  if (ageHours < 24 && rarity >= 8) return '🆕 New Rare Find'
  if (likes >= 50) return '🔥 High Engagement'
  if (ageHours < 48 && likes >= 10) return '📈 Rising Fast'
  return '✨ Trending'
}

/**
 * Format trending score for display
 */
export function formatTrendingScore(score: number): string {
  if (score >= 100) return '🔥🔥🔥'
  if (score >= 75) return '🔥🔥'
  if (score >= 50) return '🔥'
  return ''
}
