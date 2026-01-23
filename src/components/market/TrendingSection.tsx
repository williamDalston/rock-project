import { useState, useRef, useEffect } from 'react'
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { HeartGeode } from '@/components/ui/HeartGeode'
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [trendingRocks])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    // Scroll by roughly 2 cards worth
    const scrollAmount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  if (trendingRocks.length === 0) return null

  return (
    <section className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-white">Hot Magma</h2>
            <p className="text-[10px] text-stone-500 uppercase tracking-wider">Trending Now</p>
          </div>
        </div>

        {/* Desktop scroll arrows */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 disabled:opacity-30
                       disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 disabled:opacity-30
                       disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Cards with edge gradients */}
      <div className="relative">
        {/* Left fade gradient */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-stone-950 to-transparent z-10 pointer-events-none" />
        )}

        {/* Right fade gradient */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-stone-950 to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 px-4 pb-3 scroll-smooth scrollbar-thin"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
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
      </div>

      {/* Mobile swipe hint */}
      <p className="md:hidden text-center text-[10px] text-stone-600 mt-1">
        Swipe to see more →
      </p>
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
      className="flex-shrink-0 w-36 md:w-44 lg:w-48 bg-stone-900 rounded-xl border border-stone-800
                 overflow-hidden hover:border-orange-500/50
                 transition-all duration-200 hover:shadow-lg hover:shadow-orange-900/30
                 relative group"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 z-10 w-6 h-6 md:w-7 md:h-7 rounded-full
                     bg-gradient-to-br from-orange-500 to-red-600
                     flex items-center justify-center shadow-lg">
        <span className="text-[10px] md:text-xs font-bold text-white">
          #{rank}
        </span>
      </div>

      {/* Image - tap to open */}
      <button
        onClick={onClick}
        className="w-full aspect-square relative block"
      >
        <img
          src={rock.imageUrl}
          alt={rock.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Rarity Badge */}
        <div className="absolute top-2 right-2">
          <RarityBadge score={rock.rarityScore} size="sm" />
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
          <span className="inline-block bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] md:text-[10px] text-white font-medium">
            {trendingReason}
          </span>
          <h3 className="text-xs md:text-sm font-serif font-bold text-white mt-1.5 truncate">
            {rock.marketTitle || rock.name}
          </h3>
        </div>
      </button>

      {/* Footer with type and like */}
      <div className="p-2 md:p-2.5 flex items-center justify-between bg-stone-900/95">
        <span className="text-[9px] md:text-[10px] text-stone-400 uppercase tracking-wide truncate max-w-[60%]">
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
    </article>
  )
}
