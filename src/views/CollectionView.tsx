import { useState, useEffect } from 'react'
import {
  Share2, Eye, MapPin, Hexagon, Repeat, Heart, Plus, Check, X,
  ArrowRightLeft, MessageSquare, PackageCheck
} from 'lucide-react'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { XPBar } from '@/components/ui/XPBar'
import { SelfCollectedBadge } from '@/components/ui/SelfCollectedBadge'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ReputationBadge } from '@/components/ui/ReputationBadge'
import { WishlistModal } from '@/components/modals/WishlistModal'
import { ReviewModal } from '@/components/modals/ReviewModal'
import { RockDetailModal } from '@/components/modals/RockDetailModal'
import { useWishlists } from '@/hooks/useWishlists'
import { useTradeProposals } from '@/hooks/useTradeProposals'
import { useReputation } from '@/hooks/useReputation'
import { useUserProfile } from '@/hooks/useUserProfile'
import { getTradeStatusLabel, getTradeStatusColor, formatTradeDate } from '@/services/trading'
import { formatWishlistCriteria } from '@/services/wishlist'
import type { Rock, UserProfile, User, TradeProposal } from '@/types'

type TabType = 'collection' | 'trades' | 'wishlists'

interface CollectionViewProps {
  personalRocks: Rock[]
  profile: UserProfile | null
  user: User | null
  marketRocks?: Rock[]
  initialTab?: TabType
  onTabChange?: (tab: TabType) => void
}

export function CollectionView({
  personalRocks,
  profile,
  user,
  marketRocks = [],
  initialTab = 'collection',
  onTabChange
}: CollectionViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  // Sync with external tab control
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }
  const [showWishlistModal, setShowWishlistModal] = useState(false)
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
  const { addXP, incrementStat } = useUserProfile(user)

  const formatDate = (timestamp: { seconds: number } | null) => {
    if (!timestamp?.seconds) return ''
    return new Date(timestamp.seconds * 1000).toLocaleDateString()
  }

  // Calculate stats
  const selfCollectedCount = personalRocks.filter(r => r.isSelfCollected).length
  const rockTypes = new Set(personalRocks.map(r => r.type))

  // Trade stats
  const pendingReceivedCount = receivedProposals.filter(t => t.status === 'proposed' || t.status === 'countered').length
  const totalMatches = matches.length

  const handleRespondToTrade = async (tradeId: string, accept: boolean) => {
    await respondToProposal(tradeId, accept ? 'accept' : 'reject')
  }

  const handleCompleteTrade = async (trade: TradeProposal) => {
    await completeProposal(trade.id)
    // Award XP for completed trade
    await addXP('TRADE_COMPLETED')
    await incrementStat('totalTrades')
    // Show review modal after completing
    setTradeToReview(trade)
  }

  const handleSubmitReview = async (rating: 1 | 2 | 3 | 4 | 5, comment?: string) => {
    if (!tradeToReview) return

    await submitReview(tradeToReview, rating, comment)
    setTradeToReview(null)
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
      {/* Profile Header */}
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
        {profile && (
          <div className="px-4 py-4 border-b border-stone-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center">
                  <Hexagon className="w-6 h-6 text-emerald-500" />
                </div>
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
            </div>

            {/* XP Progress */}
            <XPBar xp={profile.xp} level={profile.level} />

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
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Specimens</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{selfCollectedCount}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Self-Found</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{rockTypes.size}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Types</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{profile.totalTrades}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Trades</p>
              </div>
            </div>

            {/* Reputation Display */}
            {reputation && (
              <div className="mt-3 pt-3 border-t border-stone-800">
                <ReputationBadge reputation={reputation} size="md" showLabel />
              </div>
            )}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="px-4 py-3 flex space-x-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleTabChange('collection')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center space-x-2
              ${activeTab === 'collection'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            <Hexagon className="w-4 h-4" />
            <span>Collection</span>
            <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px]">
              {personalRocks.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('trades')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center space-x-2
              ${activeTab === 'trades'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Trades</span>
            {pendingReceivedCount > 0 && (
              <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {pendingReceivedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('wishlists')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center space-x-2
              ${activeTab === 'wishlists'
                ? 'bg-rose-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlists</span>
            {totalMatches > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {totalMatches}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-4">
        {/* Collection Tab */}
        {activeTab === 'collection' && (
          <div className="grid grid-cols-2 gap-4">
            {personalRocks.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-stone-500">
                <Hexagon className="w-12 h-12 mb-4 text-stone-700" />
                <p className="text-lg font-serif">Your vault is empty</p>
                <p className="text-sm mt-2">Scan your first specimen to begin!</p>
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
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-stone-800/80 text-stone-400 text-[8px]">
                            <Eye className="w-2 h-2" />
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
                        <MapPin className="w-2 h-2 text-emerald-400" />
                        <span className="text-[8px] text-stone-300 max-w-[80px] truncate">
                          {rock.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-serif font-bold text-white text-sm truncate">
                      {rock.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">
                      {rock.type}
                    </p>

                    {rock.hardness && (
                      <p className="text-[9px] text-stone-600 mt-1">
                        Hardness: {rock.hardness}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-stone-800 flex justify-between items-center">
                      <span className="text-[10px] text-stone-600 font-mono">
                        {formatDate(rock.createdAt)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {rock.likes && rock.likes > 0 && (
                          <span className="text-[10px] text-rose-400">
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
          <div className="space-y-6">
            {/* Received Proposals */}
            <section>
              <h2 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                <span>Incoming Proposals</span>
                {pendingReceivedCount > 0 && (
                  <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                    {pendingReceivedCount} pending
                  </span>
                )}
              </h2>

              {receivedProposals.length === 0 ? (
                <div className="bg-stone-900 rounded-xl p-6 text-center border border-stone-800">
                  <Repeat className="w-8 h-8 text-stone-700 mx-auto mb-2" />
                  <p className="text-stone-500 text-sm">No trade proposals received</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {receivedProposals.map((trade) => (
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

              {sentProposals.length === 0 ? (
                <div className="bg-stone-900 rounded-xl p-6 text-center border border-stone-800">
                  <Repeat className="w-8 h-8 text-stone-700 mx-auto mb-2" />
                  <p className="text-stone-500 text-sm">No trade proposals sent</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentProposals.map((trade) => (
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
          <div className="space-y-4">
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
            {wishlists.length === 0 ? (
              <div className="bg-stone-900 rounded-xl p-8 text-center border border-stone-800">
                <Heart className="w-12 h-12 text-stone-700 mx-auto mb-3" />
                <p className="text-stone-500 text-sm mb-2">No wishlist items yet</p>
                <p className="text-stone-600 text-xs">
                  Add items you're looking for and get notified when they appear!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlists.map((item) => {
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
                              <span className="text-[10px] bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded">
                                Public
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeWishlistItem(item.id)}
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
                            className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Matches */}
                      {itemMatches.length > 0 && (
                        <div className="pt-2 border-t border-stone-800">
                          <p className="text-[10px] text-rose-400 font-medium">
                            {itemMatches.length} match{itemMatches.length > 1 ? 'es' : ''} in market
                          </p>
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
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${statusColor}`}>
            {statusLabel}
          </span>
          <span className="text-[10px] text-stone-500">
            {formatTradeDate(trade.createdAt)}
          </span>
        </div>
      </div>

      {/* Trade Items */}
      <div className="flex items-center space-x-3">
        {/* Offered Rock */}
        <div className="flex-1">
          <p className="text-[10px] text-stone-500 mb-1">
            {isReceived ? 'They offer' : 'You offer'}
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-800">
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
              <RarityBadge score={trade.offeredRock?.rarityScore || 1} />
            </div>
          </div>
        </div>

        <ArrowRightLeft className="w-4 h-4 text-stone-600 flex-shrink-0" />

        {/* Target Rock */}
        <div className="flex-1">
          <p className="text-[10px] text-stone-500 mb-1">
            {isReceived ? 'For your' : 'For their'}
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-800">
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
              <RarityBadge score={trade.targetRock?.rarityScore || 1} />
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
            className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-stone-400
                       rounded-lg text-sm font-medium transition-colors
                       disabled:opacity-50 flex items-center justify-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Decline</span>
          </button>
          <button
            onClick={() => onRespond(trade.id, true)}
            disabled={loading}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white
                       rounded-lg text-sm font-bold transition-colors
                       disabled:opacity-50 flex items-center justify-center space-x-1"
          >
            <Check className="w-3 h-3" />
            <span>Accept</span>
          </button>
        </div>
      )}

      {/* Complete Trade Button for Accepted Trades */}
      {isAccepted && onComplete && (
        <div className="mt-3 pt-3 border-t border-stone-800">
          <button
            onClick={() => onComplete(trade)}
            disabled={loading}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white
                       rounded-lg text-sm font-bold transition-colors
                       disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Complete Trade & Review</span>
          </button>
          <p className="text-[10px] text-stone-500 text-center mt-2">
            Confirm you've received the specimen to complete the trade
          </p>
        </div>
      )}
    </div>
  )
}
