import type { WishlistItem, WishlistMatch, Rock, LusterType, CrystalHabit } from '@/types'
import { WISHLIST_CONFIG } from '@/constants'

/**
 * Find all matches between wishlists and available rocks
 */
export function findWishlistMatches(
  wishlists: WishlistItem[],
  rocks: Rock[]
): WishlistMatch[] {
  const matches: WishlistMatch[] = []

  for (const wishlist of wishlists) {
    for (const rock of rocks) {
      // Skip if owned by the wishlist owner
      if (rock.ownerId === wishlist.userId) continue

      // Skip if already matched
      if (wishlist.matchedRockIds?.includes(rock.id)) continue

      const matchScore = calculateMatchScore(wishlist, rock)

      if (matchScore >= WISHLIST_CONFIG.MIN_MATCH_SCORE) {
        matches.push({
          wishlistItemId: wishlist.id,
          rockId: rock.id,
          matchScore
        })
      }
    }
  }

  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Calculate how well a rock matches a wishlist item (0-100)
 */
export function calculateMatchScore(wishlist: WishlistItem, rock: Rock): number {
  let score = 0
  let maxScore = 0

  // Type matching
  if (wishlist.rockType) {
    maxScore += WISHLIST_CONFIG.MATCH_WEIGHT_TYPE
    if (rock.type === wishlist.rockType) {
      score += WISHLIST_CONFIG.MATCH_WEIGHT_TYPE
    }
  }

  // Rarity matching
  if (wishlist.minRarity !== undefined || wishlist.maxRarity !== undefined) {
    maxScore += WISHLIST_CONFIG.MATCH_WEIGHT_RARITY
    const minOk = wishlist.minRarity === undefined || rock.rarityScore >= wishlist.minRarity
    const maxOk = wishlist.maxRarity === undefined || rock.rarityScore <= wishlist.maxRarity
    if (minOk && maxOk) {
      score += WISHLIST_CONFIG.MATCH_WEIGHT_RARITY
    }
  }

  // Name matching (fuzzy)
  if (wishlist.name) {
    maxScore += WISHLIST_CONFIG.MATCH_WEIGHT_NAME
    const nameMatch = fuzzyMatch(wishlist.name, rock.name)
    score += nameMatch * WISHLIST_CONFIG.MATCH_WEIGHT_NAME
  }

  // Visual properties matching
  if (wishlist.lusters?.length || wishlist.habits?.length) {
    maxScore += WISHLIST_CONFIG.MATCH_WEIGHT_VISUALS
    let visualScore = 0
    let visualChecks = 0

    if (wishlist.lusters?.length && rock.visuals?.luster) {
      visualChecks++
      if (wishlist.lusters.includes(rock.visuals.luster as LusterType)) {
        visualScore++
      }
    }

    if (wishlist.habits?.length && rock.visuals?.habit) {
      visualChecks++
      if (wishlist.habits.includes(rock.visuals.habit as CrystalHabit)) {
        visualScore++
      }
    }

    if (visualChecks > 0) {
      score += (visualScore / visualChecks) * WISHLIST_CONFIG.MATCH_WEIGHT_VISUALS
    }
  }

  // Normalize to 0-100
  if (maxScore === 0) return 0
  return Math.round((score / maxScore) * 100)
}

/**
 * Simple fuzzy string matching (0-1)
 */
function fuzzyMatch(search: string, target: string): number {
  const searchLower = search.toLowerCase().trim()
  const targetLower = target.toLowerCase().trim()

  // Exact match
  if (targetLower === searchLower) return 1

  // Contains match
  if (targetLower.includes(searchLower)) return 0.8

  // Word match
  const searchWords = searchLower.split(/\s+/)
  const targetWords = targetLower.split(/\s+/)
  const matchedWords = searchWords.filter(sw =>
    targetWords.some(tw => tw.includes(sw) || sw.includes(tw))
  )

  if (matchedWords.length > 0) {
    return 0.5 * (matchedWords.length / searchWords.length)
  }

  return 0
}

/**
 * Get match quality label
 */
export function getMatchQualityLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Perfect Match', color: 'text-emerald-400' }
  if (score >= 75) return { label: 'Great Match', color: 'text-green-400' }
  if (score >= 60) return { label: 'Good Match', color: 'text-blue-400' }
  return { label: 'Partial Match', color: 'text-amber-400' }
}

/**
 * Find top matches for a specific wishlist item
 */
export function findTopMatchesForWishlist(
  wishlist: WishlistItem,
  rocks: Rock[],
  limit: number = 5
): { rock: Rock; score: number }[] {
  const matches: { rock: Rock; score: number }[] = []

  for (const rock of rocks) {
    // Skip if owned by the wishlist owner
    if (rock.ownerId === wishlist.userId) continue

    const score = calculateMatchScore(wishlist, rock)

    if (score >= WISHLIST_CONFIG.MIN_MATCH_SCORE) {
      matches.push({ rock, score })
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Count potential matches for a wishlist
 */
export function countPotentialMatches(wishlist: WishlistItem, rocks: Rock[]): number {
  return rocks.filter(rock => {
    if (rock.ownerId === wishlist.userId) return false
    return calculateMatchScore(wishlist, rock) >= WISHLIST_CONFIG.MIN_MATCH_SCORE
  }).length
}

/**
 * Format wishlist criteria for display
 */
export function formatWishlistCriteria(wishlist: WishlistItem): string[] {
  const criteria: string[] = []

  if (wishlist.name) {
    criteria.push(`Name: ${wishlist.name}`)
  }

  if (wishlist.rockType) {
    criteria.push(`Type: ${wishlist.rockType}`)
  }

  if (wishlist.minRarity !== undefined || wishlist.maxRarity !== undefined) {
    const min = wishlist.minRarity ?? 1
    const max = wishlist.maxRarity ?? 10
    criteria.push(`Rarity: ${min}-${max}`)
  }

  if (wishlist.lusters?.length) {
    criteria.push(`Luster: ${wishlist.lusters.join(', ')}`)
  }

  if (wishlist.habits?.length) {
    criteria.push(`Habit: ${wishlist.habits.join(', ')}`)
  }

  return criteria
}

/**
 * Create a default wishlist item
 */
export function createDefaultWishlistItem(userId: string): Omit<WishlistItem, 'id' | 'createdAt'> {
  return {
    userId,
    isPublic: false
  }
}

/**
 * Validate wishlist item has at least one criteria
 */
export function isValidWishlistItem(item: Partial<WishlistItem>): boolean {
  return !!(
    item.name ||
    item.rockType ||
    item.minRarity !== undefined ||
    item.maxRarity !== undefined ||
    (item.lusters && item.lusters.length > 0) ||
    (item.habits && item.habits.length > 0)
  )
}
