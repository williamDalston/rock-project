import type { GeologistTitle, XPAction, Badge, UserProfile } from '@/types'
import { XP_REWARDS, LEVEL_THRESHOLDS, TITLE_THRESHOLDS, AVAILABLE_BADGES } from '@/constants'

/**
 * Calculate XP reward for an action
 */
export function getXPForAction(action: XPAction): number {
  return XP_REWARDS[action] || 0
}

/**
 * Calculate level from total XP
 */
export function calculateLevel(xp: number): number {
  let level = 1

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
    } else {
      break
    }
  }

  // Handle levels beyond the defined thresholds
  if (level >= LEVEL_THRESHOLDS.length) {
    const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
    const xpPerLevel = 1000 // XP required per level beyond defined thresholds
    level = LEVEL_THRESHOLDS.length + Math.floor((xp - lastThreshold) / xpPerLevel)
  }

  return Math.min(level, 100) // Cap at level 100
}

/**
 * Get the title for a given level
 */
export function getTitle(level: number): GeologistTitle {
  for (const [title, { minLevel, maxLevel }] of Object.entries(TITLE_THRESHOLDS)) {
    if (level >= minLevel && level <= maxLevel) {
      return title as GeologistTitle
    }
  }
  return 'Pebble Pup'
}

/**
 * Calculate XP needed to reach the next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
    const xpPerLevel = 1000
    return lastThreshold + ((currentLevel - LEVEL_THRESHOLDS.length + 1) * xpPerLevel)
  }

  return LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
}

/**
 * Calculate XP progress within current level (0-100%)
 */
export function calculateLevelProgress(xp: number, currentLevel: number): number {
  const currentLevelXP = currentLevel > 1 ? LEVEL_THRESHOLDS[currentLevel - 1] || 0 : 0
  const nextLevelXP = getXPForNextLevel(currentLevel)

  const xpIntoLevel = xp - currentLevelXP
  const xpNeededForLevel = nextLevelXP - currentLevelXP

  if (xpNeededForLevel <= 0) return 100

  return Math.min(100, Math.round((xpIntoLevel / xpNeededForLevel) * 100))
}

/**
 * Check which badges a user has earned based on their stats
 */
export function checkEarnedBadges(profile: UserProfile, rocks: { rarityScore: number; type: string; isSelfCollected?: boolean }[]): Badge[] {
  const earnedBadges: Badge[] = []
  const existingBadgeIds = profile.badges.map(b => b.id)

  // First Find badge
  if (profile.totalSpecimens >= 1 && !existingBadgeIds.includes('first_find')) {
    const badge = AVAILABLE_BADGES.find(b => b.id === 'first_find')
    if (badge) earnedBadges.push(badge)
  }

  // Field Warrior badge (10 self-collected)
  const selfCollectedCount = rocks.filter(r => r.isSelfCollected).length
  if (selfCollectedCount >= 10 && !existingBadgeIds.includes('field_warrior')) {
    const badge = AVAILABLE_BADGES.find(b => b.id === 'field_warrior')
    if (badge) earnedBadges.push(badge)
  }

  // Trader badge
  if (profile.totalTrades >= 1 && !existingBadgeIds.includes('trader')) {
    const badge = AVAILABLE_BADGES.find(b => b.id === 'trader')
    if (badge) earnedBadges.push(badge)
  }

  // Popular badge (50 likes)
  if (profile.totalLikes >= 50 && !existingBadgeIds.includes('popular')) {
    const badge = AVAILABLE_BADGES.find(b => b.id === 'popular')
    if (badge) earnedBadges.push(badge)
  }

  // Rare Hunter badge (found rarity 8+)
  const hasRare = rocks.some(r => r.rarityScore >= 8)
  if (hasRare && !existingBadgeIds.includes('rare_hunter')) {
    const badge = AVAILABLE_BADGES.find(b => b.id === 'rare_hunter')
    if (badge) earnedBadges.push(badge)
  }

  // True Geologist badge (Master rank)
  if (profile.level >= 50 && !existingBadgeIds.includes('geologist')) {
    const badge = AVAILABLE_BADGES.find(b => b.id === 'geologist')
    if (badge) earnedBadges.push(badge)
  }

  // Curator badge (100 specimens)
  if (profile.totalSpecimens >= 100 && !existingBadgeIds.includes('curator')) {
    const badge = AVAILABLE_BADGES.find(b => b.id === 'curator')
    if (badge) earnedBadges.push(badge)
  }

  // Diverse Collection badge (all 5 rock types)
  const types = new Set(rocks.map(r => r.type))
  if (types.size >= 5 && !existingBadgeIds.includes('diverse')) {
    const badge = AVAILABLE_BADGES.find(b => b.id === 'diverse')
    if (badge) earnedBadges.push(badge)
  }

  return earnedBadges
}

/**
 * Create a new user profile with default values
 */
export function createDefaultProfile(userId: string): Omit<UserProfile, 'joinedAt'> {
  return {
    userId,
    level: 1,
    xp: 0,
    title: 'Pebble Pup',
    badges: [],
    totalSpecimens: 0,
    totalTrades: 0,
    totalLikes: 0
  }
}

/**
 * Format XP with thousands separator
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString()
}
