import type { Rock } from '@/types'

interface SimilarityScore {
  rock: Rock
  score: number
  reasons: string[]
}

/**
 * Find rocks similar to the given rock based on type, properties, and characteristics
 */
export function findSimilarRocks(
  targetRock: Rock,
  allRocks: Rock[],
  limit: number = 6
): SimilarityScore[] {
  const results: SimilarityScore[] = []

  for (const rock of allRocks) {
    // Skip the same rock and rocks from the same owner
    if (rock.id === targetRock.id) continue

    let score = 0
    const reasons: string[] = []

    // Same type is a strong match
    if (rock.type === targetRock.type) {
      score += 30
      reasons.push(`Same type: ${rock.type}`)
    }

    // Similar rarity
    const rarityDiff = Math.abs((rock.rarityScore || 3) - (targetRock.rarityScore || 3))
    if (rarityDiff === 0) {
      score += 15
      reasons.push('Same rarity')
    } else if (rarityDiff === 1) {
      score += 8
    }

    // Matching hardness range
    if (rock.hardness && targetRock.hardness) {
      if (Math.abs(targetRock.hardness - rock.hardness) <= 1) {
        score += 10
        reasons.push('Similar hardness')
      }
    }

    // Matching visual properties
    if (rock.visuals && targetRock.visuals) {
      if (rock.visuals.luster === targetRock.visuals.luster) {
        score += 8
        reasons.push(`Same luster: ${rock.visuals.luster}`)
      }
      if (rock.visuals.texture === targetRock.visuals.texture) {
        score += 8
        reasons.push(`Same texture: ${rock.visuals.texture}`)
      }
    }

    // Name contains similar keywords
    const targetWords = extractKeywords(targetRock.name)
    const rockWords = extractKeywords(rock.name)
    const commonWords = targetWords.filter(w => rockWords.includes(w))
    if (commonWords.length > 0) {
      score += commonWords.length * 5
      reasons.push(`Related: ${commonWords.join(', ')}`)
    }

    // Same cleavage
    if (rock.cleavage && targetRock.cleavage && rock.cleavage === targetRock.cleavage) {
      score += 5
      reasons.push('Same cleavage')
    }

    // Same fracture
    if (rock.fracture && targetRock.fracture && rock.fracture === targetRock.fracture) {
      score += 5
      reasons.push('Same fracture')
    }

    // Only include if there's some similarity
    if (score > 0) {
      results.push({ rock, score, reasons })
    }
  }

  // Sort by score descending and limit
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Extract meaningful keywords from rock name
 */
function extractKeywords(name: string): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'of', 'with', 'in']
  return name
    .toLowerCase()
    .split(/[\s\-_,]+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
}

/**
 * Get similarity reason text for display
 */
export function getSimilarityReason(similarRock: SimilarityScore): string {
  if (similarRock.reasons.length === 0) return 'Similar specimen'
  return similarRock.reasons[0] // Return the primary reason
}
