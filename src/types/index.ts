import type { User as FirebaseUser } from 'firebase/auth'
import type { Timestamp } from 'firebase/firestore'

// ============================================
// Core Rock Types
// ============================================

export interface RockVisuals {
  luster: LusterType
  texture: string
  color?: string
  habit?: CrystalHabit
}

export type LusterType =
  | 'Vitreous'
  | 'Adamantine'
  | 'Resinous'
  | 'Waxy'
  | 'Greasy'
  | 'Silky'
  | 'Pearly'
  | 'Metallic'
  | 'Dull'
  | 'Earthy'
  | string

export type CrystalHabit =
  | 'Cubic'
  | 'Octahedral'
  | 'Dodecahedral'
  | 'Prismatic'
  | 'Tabular'
  | 'Botryoidal'
  | 'Stalactitic'
  | 'Dendritic'
  | 'Acicular'
  | 'Massive'
  | 'Rhombohedral'
  | string

export interface Coordinates {
  lat: number
  lng: number
}

export interface Rock {
  id: string
  name: string
  scientificName?: string
  marketTitle?: string
  type: RockType
  description: string
  visuals: RockVisuals
  rarityScore: number
  imageUrl: string
  videoUrl?: string
  location?: string
  coordinates?: Coordinates
  eventDate?: string
  isPublic: boolean
  ownerId: string
  createdAt: Timestamp

  // Darwin Core extended fields
  collectionMethod?: CollectionMethod
  isSelfCollected?: boolean
  cleavage?: string
  fracture?: string
  hardness?: number
  specificGravity?: number
  ownershipHistory?: string[]

  // Social features
  likes?: number
  likedBy?: string[]

  // Personal notes/story from owner
  personalNote?: string

  // Observation mode (for protected areas)
  isObservationOnly?: boolean

  // Verification (Phase 3)
  verificationLevel?: VerificationLevel
  verifiedAt?: Timestamp
}

export type CollectionMethod = 'self-collected' | 'purchased' | 'traded' | 'gifted' | 'inherited'

export interface RockFormData {
  name: string
  scientificName?: string
  marketTitle: string
  type: RockType
  location: string
  coordinates?: Coordinates
  description: string
  visuals: RockVisuals
  rarityScore: number
  imageUrl: string
  isPublic: boolean
  collectionMethod?: CollectionMethod
  isSelfCollected?: boolean
  cleavage?: string
  fracture?: string
  hardness?: number
  isObservationOnly?: boolean
  personalNote?: string
}

export type RockType = 'Igneous' | 'Sedimentary' | 'Metamorphic' | 'Mineral' | 'Fossil'

export type ViewType = 'market' | 'collection' | 'scan' | 'detail'

// ============================================
// AI Identification Types
// ============================================

export interface AIConfidence {
  primary: { name: string; probability: number }
  alternatives: Array<{ name: string; probability: number }>
}

export interface PhysicalTest {
  testName: string
  instruction: string
  expectedResult: string
  icon?: string
}

export interface AIAnalysisResult {
  name: string
  scientificName: string
  type: RockType
  description: string
  visuals: RockVisuals
  rarityScore: number
  marketTitle: string

  // Enhanced fields
  confidence: AIConfidence
  physicalTest?: PhysicalTest
  cleavage?: string
  fracture?: string
  hardness?: number
}

// ============================================
// Gamification Types
// ============================================

export type GeologistTitle =
  | 'Pebble Pup'
  | 'Rockhound'
  | 'Field Collector'
  | 'Master Geologist'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt?: Timestamp
}

export interface UserProfile {
  userId: string
  displayName?: string
  avatarUrl?: string
  bio?: string
  level: number
  xp: number
  title: GeologistTitle
  badges: Badge[]
  totalSpecimens: number
  totalTrades: number
  totalLikes: number
  joinedAt: Timestamp

  // Phase 3 additions
  reputation?: UserReputation
  isVerifiedExpert?: boolean
  expertSince?: Timestamp
  verificationsCompleted?: number
  verificationAccuracy?: number
}

export type XPAction =
  | 'SPECIMEN_ADDED'
  | 'SELF_COLLECTED'
  | 'TRADE_COMPLETED'
  | 'IDENTIFICATION_HELP'
  | 'FIRST_SPECIMEN'
  | 'LIKED_RECEIVED'
  // Phase 3 additions
  | 'VERIFICATION_VOTE'
  | 'VERIFICATION_ACCEPTED'
  | 'WISHLIST_FULFILLED'
  | 'POSITIVE_REVIEW_RECEIVED'
  | 'TRADE_PROPOSED'

// ============================================
// Filter Types
// ============================================

export type AestheticFilter = 'all' | 'shiny' | 'rough' | 'alien' | 'geometric'

export interface FilterConfig {
  label: string
  icon: string
  lusters?: LusterType[]
  habits?: CrystalHabit[]
  textures?: string[]
}

// ============================================
// Geolocation Types
// ============================================

export interface ProtectedAreaResult {
  isProtected: boolean
  areaName?: string
  areaType?: 'national_park' | 'national_monument' | 'wilderness'
}

export interface GeolocationState {
  coords: Coordinates | null
  loading: boolean
  error: string | null
  protectedArea: ProtectedAreaResult | null
  locationName: string | null
}

// ============================================
// Trading Types (Enhanced for Phase 3)
// ============================================

export type TradeStatus =
  | 'proposed'
  | 'countered'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'cancelled'

export interface TradeProposal {
  id: string
  targetRockId: string
  targetRock: Rock
  offeredRockId: string
  offeredRock: Rock
  fromUserId: string
  toUserId: string
  status: TradeStatus
  message?: string
  createdAt: Timestamp
  updatedAt: Timestamp

  // Counter-proposal support
  counterOfferedRockId?: string
  counterOfferedRock?: Rock
  counterMessage?: string

  // Contact info (revealed when accepted)
  fromUserEmail?: string
  fromUserName?: string
  toUserEmail?: string
  toUserName?: string

  // Completion tracking
  completedAt?: Timestamp
}

export interface TradeHistory {
  tradeId: string
  fromUserId: string
  toUserId: string
  fromRockId: string
  toRockId: string
  completedAt: Timestamp
}

// ============================================
// Verification Types (Phase 3)
// ============================================

export type VerificationLevel = 'unverified' | 'community_verified' | 'expert_verified'

export interface VerificationVote {
  id: string
  rockId: string
  voterId: string
  voterLevel: number
  isAccurate: boolean
  suggestedChanges?: {
    name?: string
    type?: RockType
    rarityScore?: number
  }
  comment?: string
  createdAt: Timestamp
}

export interface RockVerification {
  rockId: string
  totalVotes: number
  weightedScore: number
  verificationLevel: VerificationLevel
  lastUpdated: Timestamp

  // Expert verification
  expertVerifiedBy?: string
  expertVerifiedAt?: Timestamp
}

// ============================================
// Wishlist Types (Phase 3)
// ============================================

export interface WishlistItem {
  id: string
  userId: string
  rockType?: RockType
  name?: string
  minRarity?: number
  maxRarity?: number
  lusters?: LusterType[]
  habits?: CrystalHabit[]
  maxDistance?: number
  isPublic: boolean
  createdAt: Timestamp

  // Notification tracking
  lastNotified?: Timestamp
  matchedRockIds?: string[]
}

export interface WishlistMatch {
  wishlistItemId: string
  rockId: string
  matchScore: number
  notifiedAt?: Timestamp
  rock?: Rock  // Populated when matches are resolved
}

// ============================================
// Reputation & Review Types (Phase 3)
// ============================================

export type TrustLevel =
  | 'new_seller'
  | 'verified_seller'
  | 'trusted_seller'
  | 'elite_seller'

export interface Review {
  id: string
  tradeId: string
  reviewerId: string
  revieweeId: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
  photoUrl?: string
  tradedRockName?: string
  createdAt: Timestamp
  updatedAt?: Timestamp

  // Helpful votes
  helpfulCount?: number
}

export interface ReviewResponse {
  id: string
  reviewId: string
  responderId: string
  response: string
  createdAt: Timestamp
}

export interface UserReputation {
  userId: string
  averageRating: number
  totalReviews: number
  completedTrades: number
  cancelledTrades: number
  completionRate: number
  trustLevel: TrustLevel
  lastUpdated: Timestamp
}

// ============================================
// Trending Types (Phase 3)
// ============================================

export interface TrendingMetrics {
  rockId: string
  likes: number
  rarityScore: number
  createdAt: Timestamp

  // Calculated scores
  likeScore: number
  rarityBonus: number
  recencyScore: number
  trendingScore: number

  lastCalculated: Timestamp
}

export interface HotItem {
  rockId: string
  rank: number
  trendingScore: number
  reason: 'hot_in_category' | 'rising_views' | 'high_engagement' | 'new_rare_find'
  calculatedAt: Timestamp
  expiresAt: Timestamp
}

// ============================================
// Auth Types
// ============================================

export type User = FirebaseUser

// ============================================
// Demo Specimen Types (for static feed)
// ============================================

export type SpecimenType =
  | 'crystal'
  | 'mineral'
  | 'rock'
  | 'gem'
  | 'metal'
  | 'fossil'
  | 'texture'
  | 'tektite'
  | 'feldspar'
  | 'chalcedony'

export type SpecimenCategory =
  | 'classic'
  | 'neon'
  | 'ethereal'
  | 'abyssal'
  | 'mystic'
  | 'common'
  | 'metal'      // Heavy Metal / Industrial
  | 'organic'    // Organic & Earthy
  | 'candy'      // Candy & Pop / Vivid colors
  | 'precious'   // Royal & Precious / High value gems

export interface Specimen {
  filename: string
  title: string
  type: SpecimenType
  description: string
  tags: string[]
  source: string
  license: string
  url: string
  category?: SpecimenCategory
}
