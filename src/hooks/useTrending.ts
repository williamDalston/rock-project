import { useMemo } from 'react'
import { getTopTrending, calculateTrendingScore } from '@/services/trending'
import { TRENDING_CONFIG } from '@/constants'
import type { Rock } from '@/types'

interface UseTrendingReturn {
  trendingRocks: Rock[]
  getTrendingScore: (rock: Rock) => number
  isTrending: (rock: Rock) => boolean
}

/**
 * Hook to calculate and return trending rocks from market data
 */
export function useTrending(marketRocks: Rock[]): UseTrendingReturn {
  // Calculate trending rocks
  const trendingRocks = useMemo(() => {
    return getTopTrending(marketRocks, TRENDING_CONFIG.TRENDING_SECTION_SIZE)
  }, [marketRocks])

  // Get trending score for a specific rock
  const getTrendingScore = useMemo(() => {
    return (rock: Rock) => calculateTrendingScore(rock, Date.now())
  }, [])

  // Check if a rock is in the trending list
  const isTrending = useMemo(() => {
    const trendingIds = new Set(trendingRocks.map(r => r.id))
    return (rock: Rock) => trendingIds.has(rock.id)
  }, [trendingRocks])

  return {
    trendingRocks,
    getTrendingScore,
    isTrending
  }
}
