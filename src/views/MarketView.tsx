import { useState, useCallback } from 'react'
import { User, Repeat, Bell } from 'lucide-react'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { HeartGeode } from '@/components/ui/HeartGeode'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { SelfCollectedBadge } from '@/components/ui/SelfCollectedBadge'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { SellerBadge } from '@/components/ui/ReputationBadge'
import { AestheticFilters, filterRocksByAesthetic } from '@/components/filters/AestheticFilters'
import { TrendingSection } from '@/components/market/TrendingSection'
import { TradeModal } from '@/components/modals/TradeModal'
import type { Rock, AestheticFilter, UserProfile, User as UserType, UserReputation } from '@/types'
import { useLikes } from '@/hooks/useLikes'
import { useTrending } from '@/hooks/useTrending'
import { useTradeProposals } from '@/hooks/useTradeProposals'

interface MarketViewProps {
  marketRocks: Rock[]
  personalRocks: Rock[]
  user: UserType | null
  profile: UserProfile | null
  sellerReputations?: Map<string, UserReputation>
}

export function MarketView({
  marketRocks,
  personalRocks,
  user,
  profile,
  sellerReputations = new Map()
}: MarketViewProps) {
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [tradeTarget, setTradeTarget] = useState<Rock | null>(null)
  const [activeFilter, setActiveFilter] = useState<AestheticFilter>('all')
  const [tradeSending, setTradeSending] = useState(false)

  const { toggleLike, isLikedByUser, isLiking } = useLikes(user)
  const { trendingRocks, isTrending, getTrendingScore } = useTrending(marketRocks)
  const {
    createProposal,
    pendingReceivedCount,
    loading: tradesLoading
  } = useTradeProposals(user)

  const handleTradeProposal = (rock: Rock) => {
    if (!user) return
    setTradeTarget(rock)
    setShowTradeModal(true)
  }

  const handleTrade = useCallback(async (offeredRock: Rock, message?: string) => {
    if (!user || !tradeTarget) return

    setTradeSending(true)
    try {
      await createProposal(
        tradeTarget.id,
        tradeTarget,
        offeredRock.id,
        offeredRock,
        tradeTarget.ownerId,
        message
      )
      setShowTradeModal(false)
      setTradeTarget(null)
    } catch (err) {
      console.error('Failed to send trade proposal:', err)
    } finally {
      setTradeSending(false)
    }
  }, [user, tradeTarget, createProposal])

  const handleCloseTradeModal = useCallback(() => {
    setShowTradeModal(false)
    setTradeTarget(null)
  }, [])

  // Apply aesthetic filter
  const filteredRocks = filterRocksByAesthetic(marketRocks, activeFilter)

  // Get seller reputation for trade target
  const targetSellerReputation = tradeTarget?.ownerId
    ? sellerReputations.get(tradeTarget.ownerId)
    : undefined

  return (
    <>
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
          <div className="flex items-center space-x-3">
            {/* Trade Notifications */}
            {pendingReceivedCount > 0 && (
              <button className="relative p-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors">
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
          </div>
        </div>

        {/* Aesthetic Filters */}
        <AestheticFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </header>

      <div className="p-2 space-y-8">
        {/* Hot Magma Trending Section */}
        {trendingRocks.length > 0 && activeFilter === 'all' && (
          <TrendingSection
            trendingRocks={trendingRocks}
            onRockSelect={handleTradeProposal}
            getTrendingScore={getTrendingScore}
          />
        )}

        {filteredRocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <p className="text-lg font-serif">
              {activeFilter === 'all'
                ? 'No specimens in the market yet'
                : `No ${activeFilter} specimens found`
              }
            </p>
            <p className="text-sm mt-2">
              {activeFilter === 'all'
                ? 'Be the first to share a discovery!'
                : 'Try a different filter'
              }
            </p>
          </div>
        ) : (
          filteredRocks.map((rock) => (
            <article
              key={rock.id}
              className="relative group rounded-3xl overflow-hidden shadow-2xl bg-stone-900 border border-stone-800"
            >
              {/* Header Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-stone-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-white shadow-sm">
                        Geologist {rock.ownerId?.slice(0, 4)}
                      </p>
                      {/* Seller Reputation Badge */}
                      {rock.ownerId && sellerReputations.get(rock.ownerId) && (
                        <SellerBadge
                          reputation={sellerReputations.get(rock.ownerId)!}
                          size="sm"
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-stone-300">
                      {rock.location || 'Unknown Location'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <RarityBadge score={rock.rarityScore} />
                  {rock.verificationLevel && rock.verificationLevel !== 'unverified' && (
                    <VerificationBadge level={rock.verificationLevel} size="sm" />
                  )}
                  {rock.isSelfCollected && <SelfCollectedBadge size="sm" />}
                  {isTrending(rock) && (
                    <span className="bg-orange-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Trending
                    </span>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="aspect-[4/5] w-full relative">
                <img
                  src={rock.imageUrl}
                  alt={rock.name}
                  className="w-full h-full object-cover"
                />

                {/* Visual Stats Overlay */}
                {(rock.visuals?.luster || rock.visuals?.texture) && (
                  <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {rock.visuals.luster && (
                      <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-emerald-300 border border-emerald-900/50">
                        Luster: {rock.visuals.luster}
                      </span>
                    )}
                    {rock.visuals.texture && (
                      <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-emerald-300 border border-emerald-900/50">
                        Texture: {rock.visuals.texture}
                      </span>
                    )}
                    {rock.visuals.habit && (
                      <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-emerald-300 border border-emerald-900/50">
                        Habit: {rock.visuals.habit}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-stone-900 relative">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-serif font-bold text-white">
                    {rock.marketTitle || rock.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <HeartGeode
                      isLiked={user ? isLikedByUser(rock, user.uid) : false}
                      count={rock.likes || 0}
                      onToggle={() => toggleLike(rock)}
                      disabled={!user || isLiking}
                    />
                    {/* Only show trade button for other users' rocks */}
                    {user && rock.ownerId !== user.uid && (
                      <button
                        onClick={() => handleTradeProposal(rock)}
                        disabled={tradesLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700
                                   text-white rounded-lg text-xs font-bold uppercase tracking-wide
                                   flex items-center space-x-2 transition-colors"
                      >
                        <Repeat className="w-3 h-3" />
                        <span>Trade</span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-stone-400 line-clamp-2 leading-relaxed">
                  {rock.description}
                </p>

                {/* Extended Properties */}
                {(rock.hardness || rock.cleavage) && (
                  <div className="mt-3 pt-3 border-t border-stone-800 flex flex-wrap gap-2">
                    {rock.hardness && (
                      <span className="text-[10px] text-stone-500 bg-stone-800 px-2 py-0.5 rounded">
                        Hardness: {rock.hardness}
                      </span>
                    )}
                    {rock.cleavage && (
                      <span className="text-[10px] text-stone-500 bg-stone-800 px-2 py-0.5 rounded">
                        {rock.cleavage}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {showTradeModal && tradeTarget && (
        <TradeModal
          targetRock={tradeTarget}
          personalRocks={personalRocks}
          onClose={() => {
            setShowTradeModal(false)
            setTradeTarget(null)
          }}
          onTrade={handleTrade}
        />
      )}
    </>
  )
}
