import { useState, useCallback, useEffect } from 'react'
import { User, Repeat, Bell, Flame, LogIn, LogOut, ChevronDown, Search, X } from 'lucide-react'
import { RockFeed } from '@/components/feed'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { HeartGeode } from '@/components/ui/HeartGeode'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { SelfCollectedBadge } from '@/components/ui/SelfCollectedBadge'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { SellerBadge } from '@/components/ui/ReputationBadge'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { RarityBorderGlow, LegendarySparkles } from '@/components/ui/RarityGlow'
import { SEO, SEO_CONFIGS } from '@/components/ui/SEO'
import { ShareButton, generateRockShareData } from '@/components/ui/ShareButton'
import { FreshnessBadge, isNewListing } from '@/components/ui/FreshnessBadge'
import { AestheticFilters, filterRocksByAesthetic } from '@/components/filters/AestheticFilters'
import { TrendingSection } from '@/components/market/TrendingSection'
import { TradeModal } from '@/components/modals/TradeModal'
import { RockDetailModal } from '@/components/modals/RockDetailModal'
import { UserProfileModal } from '@/components/modals/UserProfileModal'
import type { Rock, AestheticFilter, UserProfile, User as UserType, UserReputation } from '@/types'
import { useLikes } from '@/hooks/useLikes'
import { useTrending } from '@/hooks/useTrending'
import { useTradeProposals } from '@/hooks/useTradeProposals'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useReputation } from '@/hooks/useReputation'

interface MarketViewProps {
  marketRocks: Rock[]
  personalRocks: Rock[]
  user: UserType | null
  profile: UserProfile | null
  onNavigateToTrades?: () => void
  onOpenAuth?: () => void
  isAnonymous?: boolean
  onSignOut?: () => void
}

export function MarketView({
  marketRocks,
  personalRocks,
  user,
  profile,
  onNavigateToTrades,
  onOpenAuth,
  isAnonymous = true,
  onSignOut
}: MarketViewProps) {
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [tradeTarget, setTradeTarget] = useState<Rock | null>(null)
  const [detailRock, setDetailRock] = useState<Rock | null>(null)
  const [activeFilter, setActiveFilter] = useState<AestheticFilter>('all')
  const [tradeSending, setTradeSending] = useState(false)
  const [showRockFeed, setShowRockFeed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [sellerReputations, setSellerReputations] = useState<Map<string, UserReputation>>(new Map())
  const [viewProfileUserId, setViewProfileUserId] = useState<string | null>(null)

  const { toggleLike, isLikedByUser, isLiking } = useLikes(user)
  const { trendingRocks, isTrending } = useTrending(marketRocks)
  const {
    createProposal,
    pendingReceivedCount,
    loading: tradesLoading
  } = useTradeProposals(user)
  const { addXP } = useUserProfile(user)
  const { getUserReputation } = useReputation(user)

  // Fetch seller reputations for market rocks
  useEffect(() => {
    const fetchReputations = async () => {
      const uniqueOwnerIds = [...new Set(marketRocks.map(r => r.ownerId).filter(Boolean))]
      const reputationMap = new Map<string, UserReputation>()

      // Fetch in parallel, limit to 20 to avoid overwhelming
      const idsToFetch = uniqueOwnerIds.slice(0, 20)
      const results = await Promise.allSettled(
        idsToFetch.map(async (ownerId) => {
          const rep = await getUserReputation(ownerId)
          return { ownerId, rep }
        })
      )

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.rep) {
          reputationMap.set(result.value.ownerId, result.value.rep)
        }
      })

      setSellerReputations(reputationMap)
    }

    if (marketRocks.length > 0) {
      fetchReputations()
    }
  }, [marketRocks, getUserReputation])

  const handleTradeProposal = (rock: Rock) => {
    if (!user) return
    setTradeTarget(rock)
    setShowTradeModal(true)
  }

  const handleTrade = useCallback(async (offeredRock: Rock, message?: string) => {
    if (!user || !tradeTarget) return

    setTradeSending(true)
    try {
      await createProposal(tradeTarget, offeredRock, message)
      // Award XP for proposing a trade
      await addXP('TRADE_PROPOSED')
      setShowTradeModal(false)
      setTradeTarget(null)
    } catch (err) {
      console.error('Failed to send trade proposal:', err)
    } finally {
      setTradeSending(false)
    }
  }, [user, tradeTarget, createProposal, addXP])

  const handleCloseTradeModal = useCallback(() => {
    setShowTradeModal(false)
    setTradeTarget(null)
  }, [])

  const handleRockClick = (rock: Rock) => {
    setDetailRock(rock)
  }

  const handleVoteSubmitted = useCallback(async () => {
    // Award XP for verification vote
    await addXP('VERIFICATION_VOTE')
  }, [addXP])

  // Apply aesthetic filter and search
  const filteredRocks = filterRocksByAesthetic(marketRocks, activeFilter).filter(rock => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      rock.name?.toLowerCase().includes(query) ||
      rock.marketTitle?.toLowerCase().includes(query) ||
      rock.type?.toLowerCase().includes(query) ||
      rock.location?.toLowerCase().includes(query) ||
      rock.description?.toLowerCase().includes(query)
    )
  })

  // Navigation helpers for rock detail modal
  const currentRockIndex = detailRock
    ? filteredRocks.findIndex(r => r.id === detailRock.id)
    : -1

  const handleNextRock = useCallback(() => {
    if (currentRockIndex >= 0 && currentRockIndex < filteredRocks.length - 1) {
      setDetailRock(filteredRocks[currentRockIndex + 1])
    }
  }, [currentRockIndex, filteredRocks])

  const handlePrevRock = useCallback(() => {
    if (currentRockIndex > 0) {
      setDetailRock(filteredRocks[currentRockIndex - 1])
    }
  }, [currentRockIndex, filteredRocks])

  const hasNextRock = currentRockIndex >= 0 && currentRockIndex < filteredRocks.length - 1
  const hasPrevRock = currentRockIndex > 0

  // Get seller reputation for trade target
  const targetSellerReputation = tradeTarget?.ownerId
    ? sellerReputations.get(tradeTarget.ownerId)
    : undefined

  return (
    <>
      <SEO title={SEO_CONFIGS.market.title} description={SEO_CONFIGS.market.description} />
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md px-4 py-4 border-b border-stone-800">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              Lithos<span className="text-emerald-500">.</span>
            </h1>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest">
              Global Stratum Feed
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${
                showSearch ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
              title="Search rocks"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Gallery Feed Button */}
            <button
              onClick={() => setShowRockFeed(true)}
              className="relative p-2 bg-gradient-to-br from-orange-500 to-rose-600 rounded-lg
                         hover:from-orange-400 hover:to-rose-500 transition-all shadow-lg
                         shadow-orange-500/20 group"
              title="Full-screen gallery"
            >
              <Flame className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Trade Notifications */}
            {pendingReceivedCount > 0 && (
              <button
                onClick={onNavigateToTrades}
                className="relative p-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors"
                title="View pending trade proposals"
              >
                <Bell className="w-5 h-5 text-amber-400" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingReceivedCount > 9 ? '9+' : pendingReceivedCount}
                </span>
              </button>
            )}
            {profile && (
              <LevelBadge
                level={profile.level}
                title={profile.title}
                size="sm"
                showTitle={false}
              />
            )}

            {/* User Menu / Sign In Button */}
            {isAnonymous ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500
                           text-white text-xs font-medium rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-7 h-7 rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-48 py-1 bg-stone-800 rounded-lg shadow-xl
                                border border-stone-700 opacity-0 invisible group-hover:opacity-100
                                group-hover:visible transition-all z-50">
                  <div className="px-3 py-2 border-b border-stone-700">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-stone-400 truncate">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="w-full px-3 py-2 text-left text-sm text-stone-300 hover:bg-stone-700
                               flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Aesthetic Filters */}
        <AestheticFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Search Bar - Expandable */}
        {showSearch && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, type, location..."
                className="w-full bg-stone-800 border border-stone-700 rounded-lg pl-10 pr-10 py-2.5
                           text-white text-sm placeholder-stone-500
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Responsive container - single column on mobile, multi-column on desktop */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6 py-4">
        {/* Hot Magma Trending Section */}
        {trendingRocks.length > 0 && activeFilter === 'all' && (
          <TrendingSection
            trendingRocks={trendingRocks}
            user={user}
            onRockClick={handleRockClick}
            onLike={toggleLike}
            isLikedByUser={isLikedByUser}
            isLiking={isLiking}
          />
        )}

        {filteredRocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <p className="text-lg font-serif">
              {searchQuery.trim()
                ? `No results for "${searchQuery}"`
                : activeFilter === 'all'
                ? 'No specimens in the market yet'
                : `No ${activeFilter} specimens found`
              }
            </p>
            <p className="text-sm mt-2">
              {searchQuery.trim()
                ? 'Try a different search term or clear the filter'
                : activeFilter === 'all'
                ? 'Be the first to share a discovery!'
                : 'Try a different filter'
              }
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-sm transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredRocks.map((rock) => (
              <RarityBorderGlow key={rock.id} score={rock.rarityScore}>
                <article
                  className={`relative group rounded-2xl overflow-hidden shadow-xl bg-stone-900 border transition-all duration-500 ${
                    isNewListing(rock.createdAt)
                      ? 'border-emerald-800/50 ring-1 ring-emerald-500/20'
                      : 'border-stone-800'
                  }`}
                >
                {/* Legendary sparkles for score 9+ */}
                {rock.rarityScore >= 9 && <LegendarySparkles />}

                {/* Compact Header - Above image like Instagram */}
                <div className="p-3 flex justify-between items-center border-b border-stone-800/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (rock.ownerId) setViewProfileUserId(rock.ownerId)
                    }}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-stone-400" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-1.5">
                        <p className="text-xs font-bold text-white">
                          Geologist {rock.ownerId?.slice(0, 4)}
                        </p>
                        {rock.ownerId && sellerReputations.get(rock.ownerId) && (
                          <SellerBadge
                            reputation={sellerReputations.get(rock.ownerId)!}
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 flex items-center gap-1.5">
                        <span className="truncate max-w-[100px]">{rock.location || 'Unknown'}</span>
                        <FreshnessBadge createdAt={rock.createdAt} />
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center space-x-1.5">
                    <RarityBadge score={rock.rarityScore} size="sm" />
                    {rock.verificationLevel && rock.verificationLevel !== 'unverified' && (
                      <VerificationBadge level={rock.verificationLevel} size="sm" />
                    )}
                    {rock.isSelfCollected && <SelfCollectedBadge size="sm" />}
                    {isTrending(rock) && (
                      <span className="bg-orange-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        🔥
                      </span>
                    )}
                  </div>
                </div>

                {/* Image - Square aspect ratio like Instagram */}
                <button
                  onClick={() => handleRockClick(rock)}
                  className="w-full relative block cursor-pointer"
                >
                  <OptimizedImage
                    src={rock.imageUrl}
                    alt={rock.name}
                    aspectRatio="square"
                  />

                  {/* Visual Stats Overlay - On hover */}
                  {(rock.visuals?.luster || rock.visuals?.texture) && (
                    <div className="absolute bottom-3 right-3 flex flex-col items-end space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {rock.visuals.luster && (
                        <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono text-emerald-300">
                          {rock.visuals.luster}
                        </span>
                      )}
                      {rock.visuals.texture && (
                        <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono text-emerald-300">
                          {rock.visuals.texture}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Action Bar - Compact like Instagram */}
                <div className="p-3 bg-stone-900">
                  {/* Action buttons row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <HeartGeode
                        isLiked={user ? isLikedByUser(rock, user.uid) : false}
                        count={rock.likes || 0}
                        onToggle={() => toggleLike(rock)}
                        disabled={!user || isLiking}
                      />
                      <ShareButton
                        {...generateRockShareData({
                          name: rock.name,
                          type: rock.type,
                          rarityScore: rock.rarityScore,
                          id: rock.id
                        })}
                      />
                      {/* Only show trade button for other users' rocks */}
                      {user && rock.ownerId !== user.uid && (
                        <button
                          onClick={() => handleTradeProposal(rock)}
                          disabled={tradesLoading}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700
                                     text-white rounded-lg text-[10px] font-bold uppercase tracking-wide
                                     flex items-center space-x-1 transition-colors"
                        >
                          <Repeat className="w-3 h-3" />
                          <span>Trade</span>
                        </button>
                      )}
                    </div>
                    {/* Properties badges */}
                    {(rock.hardness || rock.cleavage) && (
                      <div className="flex items-center gap-1">
                        {rock.hardness && (
                          <span className="text-[9px] text-stone-500 bg-stone-800 px-1.5 py-0.5 rounded">
                            H:{rock.hardness}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title and description */}
                  <h2 className="text-sm font-serif font-bold text-white mb-1">
                    {rock.marketTitle || rock.name}
                  </h2>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {rock.description}
                  </p>
                </div>
              </article>
              </RarityBorderGlow>
            ))}
          </div>
        )}
      </div>

      {showTradeModal && tradeTarget && (
        <TradeModal
          targetRock={tradeTarget}
          personalRocks={personalRocks.filter(r => r.id !== tradeTarget.id)}
          onClose={handleCloseTradeModal}
          onTrade={handleTrade}
          sellerReputation={targetSellerReputation}
          loading={tradeSending}
        />
      )}

      {detailRock && (
        <RockDetailModal
          rock={detailRock}
          user={user}
          profile={profile}
          onClose={() => setDetailRock(null)}
          onVoteSubmitted={handleVoteSubmitted}
          allRocks={marketRocks}
          onSelectSimilar={(rock) => setDetailRock(rock)}
          // Navigation
          onNext={handleNextRock}
          onPrev={handlePrevRock}
          hasNext={hasNextRock}
          hasPrev={hasPrevRock}
          // Engagement
          onLike={toggleLike}
          isLiked={user ? isLikedByUser(detailRock, user.uid) : false}
          isLiking={isLiking}
          onTrade={handleTradeProposal}
          onViewOwnerProfile={(ownerId) => {
            setDetailRock(null)
            setViewProfileUserId(ownerId)
          }}
        />
      )}

      {/* User Profile Modal */}
      {viewProfileUserId && (
        <UserProfileModal
          userId={viewProfileUserId}
          currentUser={user}
          onClose={() => setViewProfileUserId(null)}
          onRockClick={(rock) => setDetailRock(rock)}
          onTrade={handleTradeProposal}
        />
      )}

      {/* Full-screen Rock Porn Feed */}
      {showRockFeed && (
        <RockFeed onClose={() => setShowRockFeed(false)} />
      )}
    </>
  )
}
