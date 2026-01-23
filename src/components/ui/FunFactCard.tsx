import { useState, useEffect } from 'react'
import { Lightbulb, ChevronRight, BookOpen, Beaker, Globe, Sparkles } from 'lucide-react'
import { getRandomFact, type RockFunFact } from '@/data/rockFunFacts'

interface FunFactCardProps {
  rockType?: string
  className?: string
  autoRotate?: boolean
  rotateInterval?: number
}

const CATEGORY_ICONS = {
  history: BookOpen,
  science: Beaker,
  culture: Globe,
  fun: Sparkles
}

const CATEGORY_COLORS = {
  history: 'text-amber-400 bg-amber-400/10',
  science: 'text-cyan-400 bg-cyan-400/10',
  culture: 'text-violet-400 bg-violet-400/10',
  fun: 'text-rose-400 bg-rose-400/10'
}

export function FunFactCard({
  rockType,
  className = '',
  autoRotate = false,
  rotateInterval = 8000
}: FunFactCardProps) {
  const [fact, setFact] = useState<RockFunFact>(() => getRandomFact(rockType))
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      rotateFact()
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [autoRotate, rotateInterval, rockType])

  const rotateFact = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setFact(getRandomFact(rockType))
      setIsAnimating(false)
    }, 200)
  }

  const CategoryIcon = CATEGORY_ICONS[fact.category]
  const categoryColor = CATEGORY_COLORS[fact.category]

  return (
    <div
      className={`bg-stone-800/50 rounded-xl border border-stone-700 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-2 bg-stone-800/80 border-b border-stone-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Did You Know?
          </span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColor}`}>
          {fact.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div
          className={`flex items-start gap-3 transition-all duration-200 ${
            isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          }`}
        >
          <CategoryIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${categoryColor.split(' ')[0]}`} />
          <p className="text-sm text-stone-300 leading-relaxed">
            {fact.fact}
          </p>
        </div>
      </div>

      {/* Footer - Next fact button */}
      <button
        onClick={rotateFact}
        className="w-full px-4 py-2 bg-stone-800/50 border-t border-stone-700
                   flex items-center justify-center gap-1 text-xs text-stone-500
                   hover:text-stone-300 hover:bg-stone-700/50 transition-colors group"
      >
        <span>Another fact</span>
        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}

// Inline fact display (smaller, for inline use)
export function InlineFunFact({ rockType, className = '' }: { rockType?: string; className?: string }) {
  const [fact] = useState(() => getRandomFact(rockType))

  return (
    <div className={`flex items-start gap-2 p-3 bg-stone-800/30 rounded-lg ${className}`}>
      <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-stone-400 leading-relaxed">
        <span className="text-amber-400 font-medium">Fun fact: </span>
        {fact.fact}
      </p>
    </div>
  )
}

// Dismissible fact banner
export function FunFactBanner({
  rockType,
  onDismiss,
  className = ''
}: {
  rockType?: string
  onDismiss?: () => void
  className?: string
}) {
  const [fact] = useState(() => getRandomFact(rockType))
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss?.(), 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-900/30 to-amber-800/20
                  border border-amber-800/50 ${className}`}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-500/5 to-transparent" />

      <div className="relative p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 rounded-full">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-amber-300/70 font-medium uppercase tracking-wider mb-1">
            Did you know?
          </p>
          <p className="text-sm text-stone-300 leading-relaxed">
            {fact.fact}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="text-stone-500 hover:text-stone-300 transition-colors p-1"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
