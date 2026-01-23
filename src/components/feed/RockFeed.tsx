import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { FeedCard } from './FeedCard'
import { demoSpecimens, CATEGORY_INFO } from '@/data/demoSpecimens'
import { ChevronLeft } from 'lucide-react'
import type { SpecimenCategory } from '@/types'

interface RockFeedProps {
  onClose?: () => void
}

type FilterCategory = SpecimenCategory | 'all'

export function RockFeed({ onClose }: RockFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all')
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  // Filter specimens based on selected category
  const filteredSpecimens = useMemo(() => {
    if (selectedCategory === 'all') return demoSpecimens
    return demoSpecimens.filter(s => s.category === selectedCategory)
  }, [selectedCategory])

  // Reset to first card when filter changes
  useEffect(() => {
    setActiveIndex(0)
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedCategory])

  // Handle scroll snap detection
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling) return

    const container = containerRef.current
    const scrollTop = container.scrollTop
    const cardHeight = container.clientHeight
    const newIndex = Math.round(scrollTop / cardHeight)

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < filteredSpecimens.length) {
      setActiveIndex(newIndex)
    }
  }, [activeIndex, isScrolling, filteredSpecimens.length])

  // Debounced scroll handler
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout

    const onScroll = () => {
      setIsScrolling(true)
      handleScroll()

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        handleScroll()
      }, 100)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', onScroll)
      clearTimeout(scrollTimeout)
    }
  }, [handleScroll])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return

      const container = containerRef.current
      const cardHeight = container.clientHeight

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        const nextIndex = Math.min(activeIndex + 1, filteredSpecimens.length - 1)
        container.scrollTo({ top: nextIndex * cardHeight, behavior: 'smooth' })
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        const prevIndex = Math.max(activeIndex - 1, 0)
        container.scrollTo({ top: prevIndex * cardHeight, behavior: 'smooth' })
      } else if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, filteredSpecimens.length, onClose])

  // Get all category keys with counts
  const categories = useMemo(() => {
    const counts = new Map<SpecimenCategory, number>()
    demoSpecimens.forEach(s => {
      counts.set(s.category, (counts.get(s.category) || 0) + 1)
    })
    return Object.entries(CATEGORY_INFO).map(([key, info]) => ({
      key: key as SpecimenCategory,
      ...info,
      count: counts.get(key as SpecimenCategory) || 0
    })).filter(c => c.count > 0)
  }, [])

  const getCategoryColor = (cat: FilterCategory, isSelected: boolean) => {
    if (!isSelected) return 'bg-black/40 text-white/70 border-white/10'

    const colorMap: Record<string, string> = {
      all: 'bg-emerald-600 text-white border-emerald-500',
      classic: 'bg-emerald-600 text-white border-emerald-500',
      neon: 'bg-lime-600 text-white border-lime-500',
      ethereal: 'bg-sky-600 text-white border-sky-500',
      abyssal: 'bg-slate-600 text-white border-slate-500',
      mystic: 'bg-violet-600 text-white border-violet-500',
      common: 'bg-stone-600 text-white border-stone-500',
      metal: 'bg-zinc-600 text-white border-zinc-500',
      organic: 'bg-amber-600 text-white border-amber-500',
      candy: 'bg-pink-600 text-white border-pink-500',
      precious: 'bg-yellow-600 text-black border-yellow-500',
    }
    return colorMap[cat] || 'bg-emerald-600 text-white border-emerald-500'
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Back Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-50 w-11 h-11 bg-black/40 backdrop-blur-sm rounded-full
                     hover:bg-black/60 transition-colors group flex items-center justify-center
                     active:scale-95"
          aria-label="Close feed"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Category Filter Bar */}
      <div className="absolute top-4 left-16 right-14 z-50">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1">
            {/* All button */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                border backdrop-blur-sm transition-all duration-200
                ${getCategoryColor('all', selectedCategory === 'all')}
              `}
            >
              All ({demoSpecimens.length})
            </button>

            {/* Category buttons */}
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                  border backdrop-blur-sm transition-all duration-200
                  ${getCategoryColor(cat.key, selectedCategory === cat.key)}
                `}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
                <span className="ml-1 opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Dots - with larger touch targets */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col">
        {filteredSpecimens.slice(0, 20).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  top: index * containerRef.current.clientHeight,
                  behavior: 'smooth'
                })
              }
            }}
            className="w-8 h-8 flex items-center justify-center"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <span className={`
              w-1.5 rounded-full transition-all duration-300
              ${index === activeIndex ? 'h-6 bg-emerald-400' : 'h-1.5 bg-white/30'}
            `} />
          </button>
        ))}
        {filteredSpecimens.length > 20 && (
          <span className="text-[10px] text-white/40 text-center">+{filteredSpecimens.length - 20}</span>
        )}
      </div>

      {/* Scrollable Feed Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {filteredSpecimens.map((specimen, index) => (
          <div
            key={`${specimen.filename}-${selectedCategory}`}
            className="h-full w-full"
            style={{ scrollSnapAlign: 'start' }}
          >
            <FeedCard specimen={specimen} isActive={index === activeIndex} />
          </div>
        ))}
      </div>

      {/* Slide Counter with Category indicator */}
      <div className="absolute bottom-4 left-4 z-50">
        <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2">
          {selectedCategory !== 'all' && (
            <span className="text-xs">{CATEGORY_INFO[selectedCategory as SpecimenCategory].emoji}</span>
          )}
          <span className="text-white/80 text-xs font-mono">
            {activeIndex + 1} / {filteredSpecimens.length}
          </span>
        </div>
      </div>
    </div>
  )
}
