import { CheckCircle, Award } from 'lucide-react'
import type { VerificationLevel } from '@/types'
import { VERIFICATION_STYLES } from '@/constants'

interface VerificationBadgeProps {
  level: VerificationLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function VerificationBadge({
  level,
  size = 'md',
  showLabel = false
}: VerificationBadgeProps) {
  // Don't render anything for unverified
  if (level === 'unverified') return null

  const style = VERIFICATION_STYLES[level]

  const sizeClasses = {
    sm: 'text-[8px] px-1.5 py-0.5 space-x-1',
    md: 'text-[10px] px-2 py-1 space-x-1.5',
    lg: 'text-xs px-2.5 py-1.5 space-x-2'
  }

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const Icon = level === 'expert_verified' ? Award : CheckCircle

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}
      `}
      title={style.label}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{style.label}</span>}
    </span>
  )
}

// Compact version for inline use
interface VerificationIconProps {
  level: VerificationLevel
  size?: 'sm' | 'md' | 'lg'
}

export function VerificationIcon({ level, size = 'md' }: VerificationIconProps) {
  if (level === 'unverified') return null

  const style = VERIFICATION_STYLES[level]

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const Icon = level === 'expert_verified' ? Award : CheckCircle

  return (
    <span title={style.label}>
      <Icon className={`${iconSizes[size]} ${style.text}`} />
    </span>
  )
}

// Status indicator for verification voting
interface VerificationStatusProps {
  totalVotes: number
  weightedScore: number
  level: VerificationLevel
}

export function VerificationStatus({
  totalVotes,
  weightedScore,
  level
}: VerificationStatusProps) {
  const style = VERIFICATION_STYLES[level]

  return (
    <div className={`rounded-lg border p-3 ${style.bg} ${style.border}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-bold ${style.text}`}>
          {style.label}
        </span>
        <VerificationBadge level={level} size="sm" />
      </div>

      <div className="flex items-center space-x-4 text-[10px] text-stone-400">
        <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
        <span>Score: {weightedScore.toFixed(1)}</span>
      </div>
    </div>
  )
}
