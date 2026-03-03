import type {
  RockFormData,
  RockType,
  FilterConfig,
  AestheticFilter,
  Badge,
  GeologistTitle,
  TrustLevel,
  VerificationLevel
} from '@/types'

// ============================================
// Rock Types
// ============================================

export const ROCK_TYPES: RockType[] = [
  'Igneous',
  'Sedimentary',
  'Metamorphic',
  'Mineral',
  'Fossil'
]

// ============================================
// Form Defaults
// ============================================

export const DEFAULT_FORM_DATA: RockFormData = {
  name: '',
  marketTitle: '',
  type: 'Igneous',
  location: '',
  description: '',
  visuals: { luster: 'Vitreous', texture: '' },
  rarityScore: 1,
  imageUrl: '',
  isPublic: true,
  isSelfCollected: false
}

// ============================================
// Image URLs (runtime-resolved so deploy path is always correct)
// ============================================

const SPECIMEN_PATH = 'images/specimens/'

/** Runtime base path: works on GitHub Pages (/rock-project/) and Vercel (/) so images always load. */
export function getBase(): string {
  if (typeof window === 'undefined') return import.meta.env.BASE_URL || '/'
  const p = window.location.pathname
  return p.startsWith('/rock-project') ? '/rock-project/' : '/'
}

/** Full URL for the fallback specimen image. Use this instead of a constant. */
export function getFallbackImageUrl(): string {
  return getBase() + SPECIMEN_PATH + 'fallback.jpg'
}

/** Hosts we never use (old/broken URLs in DB). Show fallback instead. */
const BLOCKED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'plus.unsplash.com',
  'unsplash.com'
]

/** True if imageUrl is from a blocked host (e.g. Unsplash). Use to sanitize DB or in-memory rocks. */
export function isBlockedImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string' || !url.trim()) return false
  if (!url.startsWith('http')) return false
  return url.toLowerCase().includes('unsplash.com')
}

/** True if URL is same-origin or Firebase Storage (trusted). */
function isTrustedImageUrl(url: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const u = new URL(url, window.location.origin)
    const host = u.hostname.toLowerCase()
    if (BLOCKED_IMAGE_HOSTS.some(h => host === h || host.endsWith('.' + h))) return false
    if (host === 'firebasestorage.googleapis.com') return true
    return u.origin === window.location.origin
  } catch {
    return false
  }
}

/** Map rock name keywords to specimen file name (so empty/blocked imageUrl still shows the right mineral). */
const NAME_TO_SPECIMEN: [string, string][] = [
  // Tiger's eye variants (specific first)
  ['tiger\'s eye', 'tigers-eye'], ['tigers eye', 'tigers-eye'], ['tiger eye', 'tigers-eye'],
  ['golden tiger\'s eye', 'tigers-eye'], ['golden tiger eye', 'tigers-eye'],
  // Quartz variants (specific first so "quartz" alone is last)
  ['rose quartz', 'rose-quartz'], ['clear quartz', 'clear-quartz'], ['smoky quartz', 'smoky-quartz'],
  ['lemurian', 'clear-quartz'], ['seed quartz', 'clear-quartz'], ['herkimer', 'clear-quartz'],
  ['super seven', 'clear-quartz'], ['iceland spar', 'clear-quartz'], ['optical calcite', 'clear-quartz'],
  ['quartz', 'clear-quartz'],
  // Agates, jaspers, feldspars
  ['lapis lazuli', 'lapis-lazuli'], ['grape agate', 'grape-agate'], ['moss agate', 'moss-agate'],
  ['ocean jasper', 'ocean-jasper'], ['petrified wood', 'petrified-wood'], ['orange calcite', 'orange-calcite'],
  ['bumblebee jasper', 'carnelian'],
  // Opal variants
  ['welo opal', 'opal'], ['welo', 'opal'], ['boulder opal', 'opal'],
  // Tourmaline / schorl
  ['schorl', 'tourmaline'], ['black tourmaline', 'tourmaline'],
  // Single-word minerals we have images for
  ['pyrite', 'pyrite'], ['amethyst', 'amethyst'], ['malachite', 'malachite'], ['fluorite', 'fluorite'],
  ['celestite', 'celestite'], ['citrine', 'citrine'], ['opal', 'opal'], ['emerald', 'emerald'],
  ['sapphire', 'sapphire'], ['tourmaline', 'tourmaline'], ['vanadinite', 'vanadinite'], ['galena', 'galena'],
  ['aquamarine', 'aquamarine'], ['kunzite', 'kunzite'], ['rhodochrosite', 'rhodochrosite'],
  ['gold', 'gold'], ['charoite', 'charoite'], ['moonstone', 'moonstone'],
  ['carnelian', 'carnelian'], ['morganite', 'morganite'], ['chalcanthite', 'chalcanthite'],
  ['autunite', 'autunite'], ['moldavite', 'moldavite'], ['sodalite', 'sodalite'],
  ['bismuth', 'bismuth'], ['labradorite', 'labradorite'], ['obsidian', 'obsidian'],
  // Fun-fact / lithos minerals → closest specimen (no dedicated image yet)
  ['diamond', 'diamond'], ['garnet', 'garnet'], ['almandine', 'garnet'],
  ['turquoise', 'turquoise'], ['selenite', 'selenite'],
  ['hematite', 'pyrite'], ['peacock ore', 'malachite'], ['bornite', 'malachite'],
  ['kyanite', 'lapis-lazuli'], ['angelite', 'sodalite'],
  ['stibnite', 'tourmaline'], ['nuummite', 'obsidian'], ['shungite', 'obsidian'],
  ['lepidolite', 'fluorite'], ['realgar', 'carnelian'],
]

function specimenKeyFromName(name: string | null | undefined): string | null {
  if (!name || typeof name !== 'string') return null
  const lower = name.toLowerCase()
  for (const [phrase, key] of NAME_TO_SPECIMEN) {
    if (lower.includes(phrase)) return key
  }
  return null
}

/**
 * Returns the relative specimen image path for a rock from its name/marketTitle, or null.
 * Use when saving or sanitizing so Firestore stores the correct image path from the start.
 */
export function getSpecimenPathForRock(rock: { name?: string | null; marketTitle?: string | null }): string | null {
  const key = specimenKeyFromName(rock?.name) ?? specimenKeyFromName(rock?.marketTitle)
  return key ? SPECIMEN_PATH + key + '.jpg' : null
}

/**
 * Returns the full image URL for a rock. Use this everywhere a rock image is displayed.
 * When imageUrl is missing or blocked, uses specimen path from name/marketTitle so
 * the correct image is shown (no generic fallback when we know the mineral).
 */
export function getRockImageUrl(rock: { imageUrl?: string | null; name?: string | null; marketTitle?: string | null }): string {
  const raw = rock?.imageUrl?.trim()
  const useSpecimenOrFallback = () => {
    const rel = getSpecimenPathForRock(rock)
    return rel ? getBase() + rel : getFallbackImageUrl()
  }
  if (!raw) return useSpecimenOrFallback()
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    if (!isTrustedImageUrl(raw)) return useSpecimenOrFallback()
    return raw
  }
  if (raw.startsWith('/')) return raw
  return getBase() + raw.replace(/^\.\//, '')
}

/** Relative path only — for demo data. Resolved at render via getRockImageUrl(rock). */
export function specimenImage(name: string): string {
  return SPECIMEN_PATH + name + '.jpg'
}

// All image URLs must go through getRockImageUrl(rock) or getFallbackImageUrl() at render time.

// ============================================
// Rarity System
// ============================================

export const RARITY_LEVELS = {
  COMMON: { min: 1, max: 3, label: 'Common', color: 'bg-stone-700 text-stone-300' },
  UNCOMMON: { min: 4, max: 6, label: 'Uncommon', color: 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' },
  RARE: { min: 7, max: 8, label: 'Rare', color: 'bg-purple-900/50 text-purple-300 border border-purple-800' },
  LEGENDARY: { min: 9, max: 10, label: 'Legendary', color: 'bg-amber-900/50 text-amber-300 border border-amber-800' }
} as const

// ============================================
// Image Processing
// ============================================

export const IMAGE_CONFIG = {
  MAX_WIDTH: 1000,
  QUALITY: 0.7,
  MIME_TYPE: 'image/jpeg'
} as const

// ============================================
// App Config
// ============================================

export const APP_CONFIG = {
  APP_ID: import.meta.env.VITE_APP_ID || 'default-app-id',
  APP_NAME: 'Lithos',
  TAGLINE: 'AI-Powered Rock Identification'
} as const

// ============================================
// Aesthetic Filters (Bazaar)
// ============================================

export const AESTHETIC_FILTERS: Record<AestheticFilter, FilterConfig> = {
  all: {
    label: 'All',
    icon: '🌍'
  },
  shiny: {
    label: 'Shiny',
    icon: '✨',
    lusters: ['Vitreous', 'Adamantine', 'Metallic']
  },
  rough: {
    label: 'Rough',
    icon: '🪨',
    textures: ['Unpolished', 'Raw', 'Natural', 'Rough']
  },
  alien: {
    label: 'Alien',
    icon: '👽',
    habits: ['Botryoidal', 'Stalactitic', 'Dendritic']
  },
  geometric: {
    label: 'Geometric',
    icon: '💎',
    habits: ['Cubic', 'Octahedral', 'Dodecahedral', 'Rhombohedral', 'Prismatic']
  }
}

// ============================================
// Gamification: XP System
// ============================================

export const XP_REWARDS = {
  // Original rewards
  SPECIMEN_ADDED: 10,
  SELF_COLLECTED: 25,
  TRADE_COMPLETED: 15,
  IDENTIFICATION_HELP: 20,
  FIRST_SPECIMEN: 50,
  LIKED_RECEIVED: 2,
  // Phase 3 rewards
  VERIFICATION_VOTE: 3,
  VERIFICATION_ACCEPTED: 5,
  WISHLIST_FULFILLED: 10,
  POSITIVE_REVIEW_RECEIVED: 5,
  TRADE_PROPOSED: 2
} as const

// Level thresholds (XP required to reach each level)
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1350,   // Level 7
  1750,   // Level 8
  2200,   // Level 9
  2700,   // Level 10
  3250,   // Level 11
  3850,   // Level 12
  4500,   // Level 13
  5200,   // Level 14
  6000,   // Level 15
] as const

export const TITLE_THRESHOLDS: Record<GeologistTitle, { minLevel: number; maxLevel: number }> = {
  'Pebble Pup': { minLevel: 1, maxLevel: 9 },
  'Rockhound': { minLevel: 10, maxLevel: 24 },
  'Field Collector': { minLevel: 25, maxLevel: 49 },
  'Master Geologist': { minLevel: 50, maxLevel: 100 }
}

export const TITLE_STYLES: Record<GeologistTitle, { bg: string; text: string; border: string }> = {
  'Pebble Pup': {
    bg: 'bg-stone-800',
    text: 'text-stone-300',
    border: 'border-stone-700'
  },
  'Rockhound': {
    bg: 'bg-emerald-900/50',
    text: 'text-emerald-400',
    border: 'border-emerald-800'
  },
  'Field Collector': {
    bg: 'bg-purple-900/50',
    text: 'text-purple-300',
    border: 'border-purple-800'
  },
  'Master Geologist': {
    bg: 'bg-amber-900/50',
    text: 'text-amber-300',
    border: 'border-amber-800'
  }
}

// ============================================
// Badges
// ============================================

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first_find',
    name: 'First Find',
    description: 'Added your first specimen to the vault',
    icon: '🎉'
  },
  {
    id: 'field_warrior',
    name: 'Field Warrior',
    description: 'Self-collected 10 specimens',
    icon: '⛏️'
  },
  {
    id: 'trader',
    name: 'Trader',
    description: 'Completed your first trade',
    icon: '🤝'
  },
  {
    id: 'popular',
    name: 'Popular',
    description: 'Received 50 likes on your specimens',
    icon: '❤️'
  },
  {
    id: 'rare_hunter',
    name: 'Rare Hunter',
    description: 'Found a specimen with rarity 8+',
    icon: '💎'
  },
  {
    id: 'geologist',
    name: 'True Geologist',
    description: 'Reached Master Geologist rank',
    icon: '🏆'
  },
  {
    id: 'curator',
    name: 'Curator',
    description: 'Collected 100 specimens',
    icon: '🏛️'
  },
  {
    id: 'diverse',
    name: 'Diverse Collection',
    description: 'Collected all 5 rock types',
    icon: '🌈'
  }
]

// ============================================
// AI Confidence Thresholds
// ============================================

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.9,
  MEDIUM: 0.7,
  LOW: 0.5
} as const

export const CONFIDENCE_COLORS = {
  HIGH: 'text-emerald-400',
  MEDIUM: 'text-amber-400',
  LOW: 'text-rose-400'
} as const

// ============================================
// Phase 3: Trending Configuration
// ============================================

export const TRENDING_CONFIG = {
  // Score weights (must sum to 1.0)
  WEIGHT_LIKES: 0.6,
  WEIGHT_RARITY: 0.3,
  WEIGHT_RECENCY: 0.1,

  // Time decay settings
  HALF_LIFE_HOURS: 48,
  MAX_AGE_DAYS: 14,

  // Display settings
  TRENDING_SECTION_SIZE: 10,
  UPDATE_INTERVAL_MINUTES: 30,

  // Minimum thresholds
  MIN_LIKES_FOR_TRENDING: 3
} as const

// ============================================
// Phase 3: Verification Configuration
// ============================================

export const VERIFICATION_CONFIG = {
  // Vote weighting by level
  LEVEL_WEIGHT_MULTIPLIER: 0.1,
  BASE_VOTE_WEIGHT: 1.0,

  // Thresholds for verification levels
  COMMUNITY_VERIFIED_THRESHOLD: 5,
  COMMUNITY_VERIFIED_MIN_VOTES: 3,

  // Expert requirements
  EXPERT_MIN_LEVEL: 25,
  EXPERT_MIN_SPECIMENS: 50,
  EXPERT_MIN_ACCURACY: 0.9,

  // Cooldowns
  VOTE_COOLDOWN_HOURS: 24
} as const

export const VERIFICATION_STYLES: Record<VerificationLevel, {
  bg: string
  text: string
  border: string
  label: string
  icon: string
}> = {
  unverified: {
    bg: 'bg-stone-800/50',
    text: 'text-stone-500',
    border: 'border-stone-700',
    label: 'Unverified',
    icon: '?'
  },
  community_verified: {
    bg: 'bg-blue-900/50',
    text: 'text-blue-400',
    border: 'border-blue-800',
    label: 'Community Verified',
    icon: '✓'
  },
  expert_verified: {
    bg: 'bg-amber-900/50',
    text: 'text-amber-400',
    border: 'border-amber-800',
    label: 'Expert Verified',
    icon: '🔬'
  }
}

// ============================================
// Phase 3: Trading Configuration
// ============================================

export const TRADING_CONFIG = {
  // Trade timeouts
  PROPOSAL_EXPIRY_DAYS: 7,
  COUNTER_EXPIRY_DAYS: 3,

  // Limits
  MAX_ACTIVE_PROPOSALS_SENT: 10,
  MAX_ACTIVE_PROPOSALS_RECEIVED: 20
} as const

// ============================================
// Phase 3: Wishlist Configuration
// ============================================

export const WISHLIST_CONFIG = {
  MAX_WISHLIST_ITEMS: 20,
  MATCH_NOTIFICATION_COOLDOWN_HOURS: 12,

  // Match scoring weights
  MATCH_WEIGHT_TYPE: 30,
  MATCH_WEIGHT_RARITY: 25,
  MATCH_WEIGHT_NAME: 25,
  MATCH_WEIGHT_VISUALS: 20,

  MIN_MATCH_SCORE: 50
} as const

// ============================================
// Phase 3: Reputation Configuration
// ============================================

export const REPUTATION_CONFIG = {
  // Trust level thresholds
  VERIFIED_SELLER: {
    minTrades: 3,
    minCompletionRate: 0.8,
    minRating: 4.0
  },
  TRUSTED_SELLER: {
    minTrades: 10,
    minCompletionRate: 0.9,
    minRating: 4.5
  },
  ELITE_SELLER: {
    minTrades: 25,
    minCompletionRate: 0.95,
    minRating: 4.8
  },

  // Review constraints
  MIN_REVIEW_LENGTH: 10,
  MAX_REVIEW_LENGTH: 500,
  REVIEW_WINDOW_DAYS: 14
} as const

export const TRUST_LEVEL_STYLES: Record<TrustLevel, {
  bg: string
  text: string
  border: string
  icon: string
  label: string
}> = {
  new_seller: {
    bg: 'bg-stone-800',
    text: 'text-stone-400',
    border: 'border-stone-700',
    icon: '🆕',
    label: 'New Seller'
  },
  verified_seller: {
    bg: 'bg-blue-900/50',
    text: 'text-blue-400',
    border: 'border-blue-800',
    icon: '✓',
    label: 'Verified Seller'
  },
  trusted_seller: {
    bg: 'bg-emerald-900/50',
    text: 'text-emerald-400',
    border: 'border-emerald-800',
    icon: '⭐',
    label: 'Trusted Seller'
  },
  elite_seller: {
    bg: 'bg-amber-900/50',
    text: 'text-amber-400',
    border: 'border-amber-800',
    icon: '👑',
    label: 'Elite Seller'
  }
}

// ============================================
// Phase 3: Additional XP Rewards
// ============================================

export const PHASE3_XP_REWARDS = {
  VERIFICATION_VOTE: 3,
  VERIFICATION_ACCEPTED: 5,
  WISHLIST_FULFILLED: 10,
  POSITIVE_REVIEW_RECEIVED: 5,
  TRADE_PROPOSED: 2
} as const

// ============================================
// Phase 3: Additional Badges
// ============================================

export const PHASE3_BADGES: Badge[] = [
  {
    id: 'trusted_trader',
    name: 'Trusted Trader',
    description: 'Achieved Trusted Seller status',
    icon: '🤝'
  },
  {
    id: 'expert_verifier',
    name: 'Expert Verifier',
    description: 'Became a verified expert',
    icon: '🔬'
  },
  {
    id: 'wishlist_hero',
    name: 'Wishlist Hero',
    description: 'Fulfilled 10 wishlist requests',
    icon: '🎁'
  },
  {
    id: 'five_star',
    name: 'Five Star',
    description: 'Maintained a 5.0 rating with 10+ reviews',
    icon: '⭐'
  },
  {
    id: 'community_pillar',
    name: 'Community Pillar',
    description: 'Verified 50 specimens accurately',
    icon: '🏛️'
  },
  {
    id: 'hot_magma',
    name: 'Hot Magma',
    description: 'Had a specimen reach #1 trending',
    icon: '🔥'
  }
]
