import { RARITY_LEVELS } from '@/constants'

interface RarityBadgeProps {
  score: number
}

function getRarityLevel(score: number) {
  if (score >= RARITY_LEVELS.LEGENDARY.min) return RARITY_LEVELS.LEGENDARY
  if (score >= RARITY_LEVELS.RARE.min) return RARITY_LEVELS.RARE
  if (score >= RARITY_LEVELS.UNCOMMON.min) return RARITY_LEVELS.UNCOMMON
  return RARITY_LEVELS.COMMON
}

export function RarityBadge({ score }: RarityBadgeProps) {
  const level = getRarityLevel(score)

  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${level.color}`}
    >
      {level.label} &bull; {score}/10
    </span>
  )
}
