import { Sparkles } from 'lucide-react'
import { calculateLevelProgress, getXPForNextLevel, formatXP } from '@/services/gamification'

interface XPBarProps {
  xp: number
  level: number
  showDetails?: boolean
}

export function XPBar({ xp, level, showDetails = true }: XPBarProps) {
  const progress = calculateLevelProgress(xp, level)
  const nextLevelXP = getXPForNextLevel(level)

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">
              {formatXP(xp)} XP
            </span>
          </div>
          <span className="text-[10px] text-stone-500">
            {formatXP(nextLevelXP)} to Lvl {level + 1}
          </span>
        </div>
      )}

      <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect - respects reduced motion preference */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent motion-safe:animate-shimmer" />
        </div>
      </div>

      {showDetails && (
        <div className="flex justify-end mt-0.5">
          <span className="text-[10px] text-stone-500">{progress}%</span>
        </div>
      )}
    </div>
  )
}

interface XPBarCompactProps {
  xp: number
  level: number
}

export function XPBarCompact({ xp, level }: XPBarCompactProps) {
  const progress = calculateLevelProgress(xp, level)

  return (
    <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-amber-500 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
