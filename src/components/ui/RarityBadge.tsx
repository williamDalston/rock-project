import { RARITY_LEVELS } from '@/constants'

interface RarityBadgeProps {
  score: number
  size?: 'sm' | 'md'
}

function getRarityLevel(score: number) {
  if (score >= RARITY_LEVELS.LEGENDARY.min) return RARITY_LEVELS.LEGENDARY
  if (score >= RARITY_LEVELS.RARE.min) return RARITY_LEVELS.RARE
  if (score >= RARITY_LEVELS.UNCOMMON.min) return RARITY_LEVELS.UNCOMMON
  return RARITY_LEVELS.COMMON
}

export function RarityBadge({ score, size = 'md' }: RarityBadgeProps) {
  const level = getRarityLevel(score)

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[8px]',
    md: 'px-2 py-0.5 text-[10px]'
  }

  return (
    <span
      className={`rounded font-bold uppercase tracking-wider ${sizeClasses[size]} ${level.color}`}
    >
      {level.label} &bull; {score}/10
    </span>
  )
}
