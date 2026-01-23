import { Flame } from 'lucide-react'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { HeartGeode } from '@/components/ui/HeartGeode'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { getTrendingReason } from '@/services/trending'
import type { Rock, User } from '@/types'

interface TrendingSectionProps {
  trendingRocks: Rock[]
  user: User | null
  onRockClick: (rock: Rock) => void
  onLike: (rock: Rock) => void
  isLikedByUser: (rock: Rock, userId: string) => boolean
  isLiking?: boolean
}

export function TrendingSection({
  trendingRocks,
  user,
  onRockClick,
  onLike,
  isLikedByUser,
  isLiking = false
}: TrendingSectionProps) {
  if (trendingRocks.length === 0) return null

  return (
    <section className="mb-6">
      {/* Header */}
      <div className="flex items-center space-x-2 px-4 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-white">Hot Magma</h2>
          <p className="text-[10px] text-stone-500 uppercase tracking-wider">Trending Now</p>
        </div>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="flex overflow-x-auto space-x-3 px-4 pb-2 scrollbar-hide">
        {trendingRocks.map((rock, index) => (
          <TrendingCard
            key={rock.id}
            rock={rock}
            rank={index + 1}
            user={user}
            onClick={() => onRockClick(rock)}
            onLike={() => onLike(rock)}
            isLiked={user ? isLikedByUser(rock, user.uid) : false}
            isLiking={isLiking}
          />
        ))}
      </div>
    </section>
  )
}

interface TrendingCardProps {
  rock: Rock
  rank: number
  user: User | null
  onClick: () => void
  onLike: () => void
  isLiked: boolean
  isLiking: boolean
}

function TrendingCard({
  rock,
  rank,
  user,
  onClick,
  onLike,
  isLiked,
  isLiking
}: TrendingCardProps) {
  const trendingReason = getTrendingReason(rock)

  return (
    <article
      className="flex-shrink-0 w-44 bg-stone-900 rounded-xl border border-stone-800
                 overflow-hidden cursor-pointer hover:border-orange-800/50
                 transition-all duration-200 hover:shadow-lg hover:shadow-orange-900/20
                 relative group"
    >
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full
                     bg-gradient-to-br from-orange-500 to-red-600
                     flex items-center justify-center shadow-lg">
        <span className="text-xs font-bold text-white">
          #{rank}
        </span>
      </div>

      {/* Image */}
      <div className="aspect-square relative" onClick={onClick}>
        <img
          src={rock.imageUrl}
          alt={rock.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Right Badges */}
        <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
          <RarityBadge score={rock.rarityScore} size="sm" />
          {rock.verificationLevel && rock.verificationLevel !== 'unverified' && (
            <VerificationBadge level={rock.verificationLevel} size="sm" />
          )}
        </div>

        {/* Trending Reason Tag */}
        <div className="absolute bottom-2 left-2 right-2">
          <span className="inline-block bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-orange-300 font-medium">
            {trendingReason}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3
          className="text-sm font-bold text-white truncate cursor-pointer hover:text-orange-300 transition-colors"
          onClick={onClick}
        >
          {rock.marketTitle || rock.name}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-stone-500 uppercase tracking-wide">
            {rock.type}
          </span>
          <HeartGeode
            isLiked={isLiked}
            count={rock.likes || 0}
            onToggle={onLike}
            disabled={!user || isLiking}
            size="sm"
          />
        </div>
      </div>
    </article>
  )
}
