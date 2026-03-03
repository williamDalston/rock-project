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

/** Base path from Vite — respects the `base` config for GitHub Pages. */
const BASE = import.meta.env.BASE_URL

/** Fallback when rock/specimen imageUrl is missing or fails to load. */
export const FALLBACK_IMAGE_URL = `${BASE}images/specimens/fallback.jpg`

/** Helper to get a specimen image path by mineral name. */
export const specimenImage = (name: string) => `${BASE}images/specimens/${name}.jpg`

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
