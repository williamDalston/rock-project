import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Share2, Eye, MapPin, Hexagon, Heart, Plus, Check, X,
  ArrowRightLeft, MessageSquare, PackageCheck, LogIn, LogOut, ChevronDown,
  Mail, User as UserIcon, Truck, Loader, Pencil
} from 'lucide-react'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { XPBar } from '@/components/ui/XPBar'
import { SelfCollectedBadge } from '@/components/ui/SelfCollectedBadge'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ReputationBadge } from '@/components/ui/ReputationBadge'
import { CollectionProgress } from '@/components/ui/CollectionProgress'
import { SEO, SEO_CONFIGS } from '@/components/ui/SEO'
import { EmptyState } from '@/components/ui/EmptyState'
import { WishlistModal } from '@/components/modals/WishlistModal'
import { ReviewModal } from '@/components/modals/ReviewModal'
import { RockDetailModal } from '@/components/modals/RockDetailModal'
import { ProfileEditModal } from '@/components/modals/ProfileEditModal'
import { UserProfileModal } from '@/components/modals/UserProfileModal'
import { useWishlists } from '@/hooks/useWishlists'
import { useTradeProposals } from '@/hooks/useTradeProposals'
import { useReputation } from '@/hooks/useReputation'
import { useUserProfile } from '@/hooks/useUserProfile'
import { getTradeStatusLabel, getTradeStatusColor, formatTradeDate } from '@/services/trading'
import { formatWishlistCriteria } from '@/services/wishlist'
import { getDemoTradeProposals, getDemoWishlists, isDemoId } from '@/data/demoData'
import type { Rock, UserProfile, User, TradeProposal } from '@/types'

type TabType = 'collection' | 'trades' | 'wishlists'

interface CollectionViewProps {
  personalRocks: Rock[]
  profile: UserProfile | null
  user: User | null
  marketRocks?: Rock[]
  initialTab?: TabType
  onTabChange?: (tab: TabType) => void
  onOpenAuth?: () => void
  isAnonymous?: boolean
  onSignOut?: () => void
  onDeleteRock?: (rockId: string, rockName: string) => Promise<void>
}

export function CollectionView({
  personalRocks,
  profile,
  user,
  marketRocks = [],
  initialTab = 'collection',
  onTabChange,
  onOpenAuth,
  isAnonymous = false,
  onSignOut,
  onDeleteRock
}: CollectionViewProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  // Sync with external tab control
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }
  const [showWishlistModal, setShowWishlistModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [viewProfileUserId, setViewProfileUserId] = useState<string | null>(null)
  const [tradeToReview, setTradeToReview] = useState<TradeProposal | null>(null)
  const [detailRock, setDetailRock] = useState<Rock | null>(null)

  // Hooks
  const {
    sentProposals,
    receivedProposals,
    respondToProposal,
    completeProposal,
    loading: tradesLoading
  } = useTradeProposals(user)

  const {
    wishlists,
    matches,
    addWishlistItem,
    removeWishlistItem
  } = useWishlists(user, marketRocks)

  const { reputation, submitReview } = useReputation(user)
  const { addXP, incrementStat, updateProfile } = useUserProfile(user)

  // Seed demo trades & wishlists when real data is empty
  const demoTrades = useMemo(
    () => getDemoTradeProposals(user?.uid || 'demo_self'),
    [user?.uid]
  )
  const demoWishlistItems = useMemo(
    () => getDemoWishlists(user?.uid || 'demo_self'),
    [user?.uid]
  )
  const effectiveReceived = receivedProposals.length > 0 ? receivedProposals : demoTrades.received
  const effectiveSent = sentProposals.length > 0 ? sentProposals : demoTrades.sent
  const effectiveWishlists = wishlists.length > 0 ? wishlists : demoWishlistItems

  const formatDate = (timestamp: { seconds: number } | null) => {
    if (!timestamp?.seconds) return ''
    return new Date(timestamp.seconds * 1000).toLocaleDateString()
  }

  // Memoize stats to prevent recalculation on unrelated state changes
  const selfCollectedCount = useMemo(() => personalRocks.filter(r => r.isSelfCollected).length, [personalRocks])
  const rockTypes = useMemo(() => new Set(personalRocks.map(r => r.type)), [personalRocks])
  const pendingReceivedCount = useMemo(() => effectiveReceived.filter(t => t.status === 'proposed' || t.status === 'countered').length, [effectiveReceived])
  const totalMatches = matches.length

  const handleRespondToTrade = async (tradeId: string, accept: boolean) => {
    if (isDemoId(tradeId)) return // Demo trades are display-only
    try {
      await respondToProposal(tradeId, accept ? 'accept' : 'reject')
    } catch (err) {
      console.error('Failed to respond to trade:', err)
    }
  }

  const handleCompleteTrade = async (trade: TradeProposal) => {
    if (isDemoId(trade.id)) return // Demo trades are display-only
    try {
      await completeProposal(trade.id)
      await addXP('TRADE_COMPLETED')
      await incrementStat('totalTrades')
      setTradeToReview(trade)
    } catch (err) {
      console.error('Failed to complete trade:', err)
    }
  }

  const handleSubmitReview = async (rating: 1 | 2 | 3 | 4 | 5, comment?: string) => {
    if (!tradeToReview) return
    try {
      await submitReview(tradeToReview, rating, comment)
      setTradeToReview(null)
    } catch (err) {
      console.error('Failed to submit review:', err)
    }
  }

  const handleAddWishlistItem = async (item: Parameters<typeof addWishlistItem>[0]) => {
    await addWishlistItem(item)
  }

  const handleRockClick = (rock: Rock) => {
    setDetailRock(rock)
  }

  const handleVoteSubmitted = async () => {
    await addXP('VERIFICATION_VOTE')
  }

  return (
    <>
      <SEO {...SEO_CONFIGS.collection} />
      <h1 className="sr-only">My Rock & Mineral Collection</h1>
      {/* Profile Header - scrolls with content */}
      <div className="bg-stone-950 border-b border-stone-800">
        {profile && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 border-b border-stone-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {/* Avatar with edit button */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="relative group"
                  aria-label="Edit profile"
                >
                  <div className="w-14 h-14 rounded-full bg-stone-800 border-2 border-stone-700 overflow-hidden group-hover:border-emerald-500 transition-colors">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Hexagon className="w-7 h-7 text-emerald-500" />
                      </div>
                    )}
                  </div>
                  {/* Edit overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-white" />
                  </div>
                </button>
                <div>
                  <p className="text-white font-bold">
                    {profile.displayName || `Geologist ${profile.userId.slice(0, 6)}`}
                  </p>
                  <LevelBadge
                    level={profile.level}
                    title={profile.title}
                    size="sm"
                  />
                </div>
              </div>

              {/* Auth Button */}
              <div className="relative" ref={userMenuRef}>
                {isAnonymous ? (
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors min-h-[44px]"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg transition-colors min-h-[44px]"
                    >
                      <span className="max-w-[100px] truncate">{user?.displayName || user?.email || 'Account'}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-stone-800 border border-stone-700 rounded-lg shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            setShowProfileModal(true)
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-stone-300 hover:bg-stone-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                        <div className="border-t border-stone-700" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            onSignOut?.()
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-stone-300 hover:bg-stone-700 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* XP Progress */}
            <XPBar xp={profile.xp} level={profile.level} />

            {/* Bio - clickable to edit */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full text-left mt-3 group"
            >
              {profile.bio ? (
                <p className="text-sm text-stone-400 italic group-hover:text-stone-300 transition-colors">
                  "{profile.bio}"
                </p>
              ) : (
                <p className="text-sm text-stone-600 group-hover:text-stone-500 transition-colors flex items-center gap-1">
                  <Pencil className="w-3 h-3" />
                  Add a bio to tell others about yourself...
                </p>
              )}
            </button>

            {/* Badges */}
            {profile.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.badges.slice(0, 5).map((badge) => (
                  <span
                    key={badge.id}
                    className="text-lg"
                    title={badge.name}
                  >
                    {badge.icon}
                  </span>
                ))}
                {profile.badges.length > 5 && (
                  <span className="text-xs text-stone-500">
                    +{profile.badges.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Stats Row */}
            <div className="flex justify-between mt-4 pt-3 border-t border-stone-800">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{personalRocks.length}</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Specimens</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{selfCollectedCount}</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Self-Found</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{rockTypes.size}</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Types</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{profile.totalTrades}</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Trades</p>
              </div>
            </div>

            {/* Collection Progress */}
            {personalRocks.length > 0 && (
              <div className="mt-3 pt-3 border-t border-stone-800">
                <CollectionProgress rocks={personalRocks} />
              </div>
            )}

            {/* Reputation Display */}
            {reputation && (
              <div className="mt-3 pt-3 border-t border-stone-800">
                <ReputationBadge reputation={reputation} size="md" showLabel />
              </div>
            )}
          </div>
        )}

      </div>

      {/* Tabs Navigation - sticky */}
      <div className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex space-x-2 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Collection sections">
          <button
            role="tab"
            id="tab-collection"
            aria-selected={activeTab === 'collection'}
            aria-controls="panel-collection"
            onClick={() => handleTabChange('collection')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center space-x-2
              ${activeTab === 'collection'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            <Hexagon className="w-4 h-4" aria-hidden="true" />
            <span>Vault</span>
            <span className="bg-black/30 px-1.5 py-0.5 rounded text-[11px]">
              {personalRocks.length}
            </span>
          </button>

          <button
            role="tab"
            id="tab-trades"
            aria-selected={activeTab === 'trades'}
            aria-controls="panel-trades"
            onClick={() => handleTabChange('trades')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center space-x-2
              ${activeTab === 'trades'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            <ArrowRightLeft className="w-4 h-4" aria-hidden="true" />
            <span>Trades</span>
            {pendingReceivedCount > 0 && (
              <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[11px] font-bold">
                {pendingReceivedCount}
              </span>
            )}
          </button>

          <button
            role="tab"
            id="tab-wishlists"
            aria-selected={activeTab === 'wishlists'}
            aria-controls="panel-wishlists"
            onClick={() => handleTabChange('wishlists')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center space-x-2
              ${activeTab === 'wishlists'
                ? 'bg-rose-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span>Wishlists</span>
            {totalMatches > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[11px] font-bold">
                {totalMatches}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-6 py-4">
        {/* Collection Tab */}
        {activeTab === 'collection' && (
          <div role="tabpanel" id="panel-collection" aria-labelledby="tab-collection" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {personalRocks.length === 0 ? (
              <div className="col-span-full">
                <EmptyState type="collection" />
              </div>
            ) : (
              personalRocks.map((rock) => (
                <article
                  key={rock.id}
                  onClick={() => handleRockClick(rock)}
                  className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 group cursor-pointer
                             hover:border-stone-700 transition-colors"
                >
                  <div className="aspect-square relative">
                    <OptimizedImage
                      src={rock.imageUrl}
                      alt={rock.name}
                      aspectRatio="square"
                      hoverZoom={true}
                    />

                    {/* Badges Overlay */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between">
                      <div className="flex flex-col space-y-1">
                        {rock.isSelfCollected && <SelfCollectedBadge size="sm" />}
                        {rock.isObservationOnly && (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-stone-800/80 text-stone-400 text-[11px]">
                            <Eye className="w-2.5 h-2.5" />
                            <span>Observation</span>
                          </span>
                        )}
                        {rock.verificationLevel && rock.verificationLevel !== 'unverified' && (
                          <VerificationBadge level={rock.verificationLevel} size="sm" />
                        )}
                      </div>
                      <RarityBadge score={rock.rarityScore} />
                    </div>

                    {/* Location indicator */}
                    {rock.location && (
                      <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                        <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="text-[11px] text-stone-300 max-w-[80px] truncate">
                          {rock.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-serif font-bold text-white text-sm truncate">
                      {rock.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 uppercase tracking-wider mt-1">
                      {rock.type}
                    </p>

                    {rock.hardness && (
                      <p className="text-[11px] text-stone-600 mt-1">
                        Hardness: {rock.hardness}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-stone-800 flex justify-between items-center">
                      <span className="text-[11px] text-stone-600 font-mono">
                        {formatDate(rock.createdAt)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {rock.likes && rock.likes > 0 && (
                          <span className="text-[11px] text-rose-400">
                            ❤️ {rock.likes}
                          </span>
                        )}
                        <button className="text-stone-600 hover:text-emerald-400 transition-colors">
                          <Share2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === 'trades' && (
          <div role="tabpanel" id="panel-trades" aria-labelledby="tab-trades" className="space-y-6">
            {/* Received Proposals */}
            <section>
              <h2 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                <span>Incoming Proposals</span>
                {pendingReceivedCount > 0 && (
                  <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[11px]">
                    {pendingReceivedCount} pending
                  </span>
                )}
              </h2>

              {effectiveReceived.length === 0 ? (
                <EmptyState type="trades" title="No incoming proposals" description="When someone proposes a trade for your rocks, it will appear here." />
              ) : (
                <div className="space-y-3">
                  {effectiveReceived.map((trade) => (
                    <TradeCard
                      key={trade.id}
                      trade={trade}
                      isReceived
                      onRespond={handleRespondToTrade}
                      onComplete={handleCompleteTrade}
                      loading={tradesLoading}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Sent Proposals */}
            <section>
              <h2 className="text-sm font-bold text-white mb-3">Sent Proposals</h2>

              {effectiveSent.length === 0 ? (
                <EmptyState type="trades" title="No sent proposals" description="Browse the market and propose a trade to get started!" />
              ) : (
                <div className="space-y-3">
                  {effectiveSent.map((trade) => (
                    <TradeCard
                      key={trade.id}
                      trade={trade}
                      isReceived={false}
                      onComplete={handleCompleteTrade}
                      loading={tradesLoading}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Wishlists Tab */}
        {activeTab === 'wishlists' && (
          <div role="tabpanel" id="panel-wishlists" aria-labelledby="tab-wishlists" className="space-y-4">
            {/* Add Wishlist Button */}
            <button
              onClick={() => setShowWishlistModal(true)}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl
                         font-medium transition-colors flex items-center justify-center space-x-2
                         border border-dashed border-stone-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add Wishlist Item</span>
            </button>

            {/* Matches Alert */}
            {totalMatches > 0 && (
              <div className="bg-rose-900/30 border border-rose-800 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <p className="text-rose-400 font-bold">
                    {totalMatches} Match{totalMatches > 1 ? 'es' : ''} Found!
                  </p>
                </div>
                <p className="text-sm text-rose-300/70">
                  Rocks matching your wishlist criteria are available in the market.
                </p>
              </div>
            )}

            {/* Wishlist Items */}
            {effectiveWishlists.length === 0 ? (
              <EmptyState type="wishlist" />
            ) : (
              <div className="space-y-3">
                {effectiveWishlists.map((item) => {
                  const criteria = formatWishlistCriteria(item)
                  const itemMatches = matches.filter(m => m.wishlistItemId === item.id)

                  return (
                    <div
                      key={item.id}
                      className="bg-stone-900 rounded-xl p-4 border border-stone-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {item.name && (
                              <h3 className="text-white font-bold">{item.name}</h3>
                            )}
                            {item.rockType && !item.name && (
                              <h3 className="text-white font-bold">{item.rockType}</h3>
                            )}
                            {!item.name && !item.rockType && (
                              <h3 className="text-white font-bold">Custom Criteria</h3>
                            )}
                            {item.isPublic && (
                              <span className="text-[11px] bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded">
                                Public
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => !isDemoId(item.id) && removeWishlistItem(item.id)}
                          className="text-stone-600 hover:text-rose-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Criteria Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {criteria.map((c, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Matches with View Button */}
                      {itemMatches.length > 0 && (
                        <div className="pt-3 border-t border-stone-800">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-rose-400 font-medium">
                              🎯 {itemMatches.length} match{itemMatches.length > 1 ? 'es' : ''} found!
                            </p>
                          </div>
                          {/* Show matching rocks */}
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {itemMatches.slice(0, 5).map((match) => {
                              const rock = marketRocks.find(r => r.id === match.rockId)
                              if (!rock) return null
                              return (
                                <button
                                  key={match.rockId}
                                  onClick={() => handleRockClick(rock)}
                                  className="flex-shrink-0 w-16"
                                >
                                  <div className="w-16 h-16 rounded-lg overflow-hidden ring-2 ring-rose-500/50">
                                    <img
                                      src={rock.imageUrl}
                                      alt={rock.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-[11px] text-stone-400 mt-1 truncate text-center">
                                    {rock.name}
                                  </p>
                                </button>
                              )
                            })}
                            {itemMatches.length > 5 && (
                              <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-stone-800 flex items-center justify-center">
                                <span className="text-xs text-stone-500">+{itemMatches.length - 5}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <WishlistModal
          onClose={() => setShowWishlistModal(false)}
          onSave={handleAddWishlistItem}
          existingCount={wishlists.length}
        />
      )}

      {/* Review Modal - after completing a trade */}
      {tradeToReview && (
        <ReviewModal
          trade={tradeToReview}
          onClose={() => setTradeToReview(null)}
          onSubmit={handleSubmitReview}
        />
      )}

      {/* Rock Detail Modal with Verification Voting */}
      {detailRock && (
        <RockDetailModal
          rock={detailRock}
          user={user}
          profile={profile}
          onClose={() => setDetailRock(null)}
          onVoteSubmitted={handleVoteSubmitted}
          allRocks={[...personalRocks, ...marketRocks]}
          onSelectSimilar={(rock) => setDetailRock(rock)}
          onDelete={onDeleteRock}
          onViewOwnerProfile={(ownerId) => {
            setDetailRock(null)
            setViewProfileUserId(ownerId)
          }}
        />
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && profile && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onSave={updateProfile}
        />
      )}

      {/* User Profile Modal - view other users */}
      {viewProfileUserId && (
        <UserProfileModal
          userId={viewProfileUserId}
          currentUser={user}
          onClose={() => setViewProfileUserId(null)}
          onRockClick={(rock) => setDetailRock(rock)}
        />
      )}
    </>
  )
}

// Trade Card Component
interface TradeCardProps {
  trade: TradeProposal
  isReceived: boolean
  onRespond?: (tradeId: string, accept: boolean) => void
  onComplete?: (trade: TradeProposal) => void
  loading?: boolean
}

function TradeCard({ trade, isReceived, onRespond, onComplete, loading }: TradeCardProps) {
  const statusLabel = getTradeStatusLabel(trade.status)
  const statusColor = getTradeStatusColor(trade.status)
  const isPending = trade.status === 'proposed' || trade.status === 'countered'
  const isAccepted = trade.status === 'accepted'

  return (
    <div className="bg-stone-900 rounded-xl p-4 border border-stone-800">
      {/* Trade Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusColor}`}>
            {statusLabel}
          </span>
          <span className="text-[11px] text-stone-500">
            {formatTradeDate(trade.createdAt)}
          </span>
        </div>
      </div>

      {/* Trade Items - Clear labels for who gets what */}
      <div className="flex items-center space-x-3">
        {/* What you'll give / What they're giving */}
        <div className="flex-1">
          <p className={`text-[11px] font-medium mb-1 ${isReceived ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isReceived ? '🎁 You receive' : '📤 You give'}
          </p>
          <div className="flex items-center space-x-2">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 ${isReceived ? 'ring-2 ring-emerald-500/50' : 'ring-2 ring-amber-500/50'}`}>
              <img
                src={trade.offeredRock?.imageUrl}
                alt={trade.offeredRock?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white font-medium truncate">
                {trade.offeredRock?.name}
              </p>
              <RarityBadge score={trade.offeredRock?.rarityScore || 1} size="sm" />
            </div>
          </div>
        </div>

        <ArrowRightLeft className="w-4 h-4 text-stone-600 flex-shrink-0" />

        {/* What you'll get / What they want */}
        <div className="flex-1">
          <p className={`text-[11px] font-medium mb-1 ${isReceived ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isReceived ? '📤 You give' : '🎁 You receive'}
          </p>
          <div className="flex items-center space-x-2">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 ${isReceived ? 'ring-2 ring-amber-500/50' : 'ring-2 ring-emerald-500/50'}`}>
              <img
                src={trade.targetRock?.imageUrl}
                alt={trade.targetRock?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white font-medium truncate">
                {trade.targetRock?.name}
              </p>
              <RarityBadge score={trade.targetRock?.rarityScore || 1} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {trade.message && (
        <div className="mt-3 pt-3 border-t border-stone-800">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-3 h-3 text-stone-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-stone-400 italic">"{trade.message}"</p>
          </div>
        </div>
      )}

      {/* Actions for Received Pending Trades */}
      {isReceived && isPending && onRespond && (
        <div className="mt-3 pt-3 border-t border-stone-800 flex space-x-2">
          <button
            onClick={() => onRespond(trade.id, false)}
            disabled={loading}
            className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-400
                       rounded-lg text-sm font-medium transition-colors min-h-[44px]
                       disabled:opacity-50 flex items-center justify-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Decline</span>
          </button>
          <button
            onClick={() => onRespond(trade.id, true)}
            disabled={loading}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white
                       rounded-lg text-sm font-bold transition-colors min-h-[44px]
                       disabled:opacity-50 flex items-center justify-center space-x-1"
          >
            <Check className="w-4 h-4" />
            <span>Accept</span>
          </button>
        </div>
      )}

      {/* Contact Info & Complete Trade for Accepted Trades */}
      {isAccepted && (
        <div className="mt-3 pt-3 border-t border-stone-800 space-y-3">
          {/* Contact Exchange Section */}
          <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-lg p-3">
            <p className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Contact Your Trade Partner
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-sm text-white">
                  {isReceived
                    ? (trade.fromUserName || 'Anonymous')
                    : (trade.toUserName || 'Anonymous')
                  }
                </span>
              </div>
              {(isReceived ? trade.fromUserEmail : trade.toUserEmail) && (
                <a
                  href={`mailto:${isReceived ? trade.fromUserEmail : trade.toUserEmail}?subject=Lithos Trade: ${trade.targetRock.name}&body=Hi! I'm reaching out about our accepted trade on Lithos.%0A%0ARock: ${trade.targetRock.name}%0A%0ALet me know how you'd like to arrange the exchange!`}
                  className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {isReceived ? trade.fromUserEmail : trade.toUserEmail}
                </a>
              )}
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-800/30">
              <p className="text-[11px] text-emerald-300/60 flex items-start gap-1.5">
                <Truck className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Coordinate shipping or local meetup via email. Once you've both exchanged specimens, come back here to complete the trade.</span>
              </p>
            </div>
          </div>

          {/* Complete Button */}
          {onComplete && (
            <>
              <button
                onClick={() => onComplete(trade)}
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white
                           rounded-lg text-sm font-bold transition-colors min-h-[48px]
                           disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <PackageCheck className="w-4 h-4" />
                    <span>I've Received It - Complete Trade</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-stone-500 text-center">
                Only click after you've physically received the specimen
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
