import { useEffect, useState } from 'react'
import { Trophy, Star, Gem, Mountain, Flame, Sparkles, Award, Target } from 'lucide-react'

export type AchievementType =
  | 'first_specimen'
  | 'collector_10'
  | 'collector_50'
  | 'first_trade'
  | 'trader_10'
  | 'first_like'
  | 'popular_100'
  | 'self_collected'
  | 'rare_find'
  | 'legendary_find'
  | 'streak_7'
  | 'expert_verified'

interface AchievementConfig {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  bgColor: string
  xp: number
}

const ACHIEVEMENTS: Record<AchievementType, AchievementConfig> = {
  first_specimen: {
    icon: <Mountain className="w-6 h-6" />,
    title: 'First Discovery',
    description: 'Added your first specimen to the vault',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    xp: 50
  },
  collector_10: {
    icon: <Gem className="w-6 h-6" />,
    title: 'Budding Collector',
    description: 'Collected 10 specimens',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20',
    xp: 100
  },
  collector_50: {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Master Curator',
    description: 'Collected 50 specimens',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    xp: 500
  },
  first_trade: {
    icon: <Target className="w-6 h-6" />,
    title: 'First Exchange',
    description: 'Completed your first trade',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    xp: 75
  },
  trader_10: {
    icon: <Award className="w-6 h-6" />,
    title: 'Seasoned Trader',
    description: 'Completed 10 trades',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    xp: 200
  },
  first_like: {
    icon: <Star className="w-6 h-6" />,
    title: 'Appreciated',
    description: 'Received your first like',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    xp: 25
  },
  popular_100: {
    icon: <Flame className="w-6 h-6" />,
    title: 'Crowd Favorite',
    description: 'Received 100 likes on a specimen',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    xp: 250
  },
  self_collected: {
    icon: <Mountain className="w-6 h-6" />,
    title: 'Field Collector',
    description: 'Added a self-collected specimen',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    xp: 30
  },
  rare_find: {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Rare Discovery',
    description: 'Found a rare specimen',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20',
    xp: 100
  },
  legendary_find: {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Legendary Find',
    description: 'Discovered a legendary specimen',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    xp: 300
  },
  streak_7: {
    icon: <Flame className="w-6 h-6" />,
    title: 'On Fire',
    description: '7-day collection streak',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    xp: 150
  },
  expert_verified: {
    icon: <Award className="w-6 h-6" />,
    title: 'Expert Approved',
    description: 'Your specimen was verified by an expert',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    xp: 75
  }
}

interface AchievementToastProps {
  type: AchievementType
  onClose: () => void
  duration?: number
}

export function AchievementToast({ type, onClose, duration = 4000 }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const achievement = ACHIEVEMENTS[type]

  useEffect(() => {
    // Enter animation
    requestAnimationFrame(() => setIsVisible(true))

    // Auto dismiss
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, duration - 300)

    const closeTimer = setTimeout(onClose, duration)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(closeTimer)
    }
  }, [duration, onClose])

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        isVisible && !isExiting
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-stone-700
                    bg-stone-900/95 backdrop-blur-sm shadow-2xl min-w-[280px]`}
      >
        {/* Icon */}
        <div className={`p-2 rounded-xl ${achievement.bgColor} ${achievement.color}`}>
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-bold text-sm ${achievement.color}`}>
              {achievement.title}
            </h4>
            <span className="text-[10px] text-amber-400 font-bold">
              +{achievement.xp} XP
            </span>
          </div>
          <p className="text-xs text-stone-400 truncate">
            {achievement.description}
          </p>
        </div>

        {/* Sparkle decoration */}
        <Sparkles className={`w-4 h-4 ${achievement.color} animate-pulse`} />
      </div>
    </div>
  )
}

// Hook for managing achievement toasts
export function useAchievements() {
  const [achievements, setAchievements] = useState<Array<{ id: string; type: AchievementType }>>([])

  const showAchievement = (type: AchievementType) => {
    const id = `${type}-${Date.now()}`
    setAchievements(prev => [...prev, { id, type }])
  }

  const dismissAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id))
  }

  return {
    achievements,
    showAchievement,
    dismissAchievement
  }
}
