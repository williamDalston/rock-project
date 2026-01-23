import { ROCK_TYPES } from '@/constants'
import type { Rock, RockType } from '@/types'

interface CollectionProgressProps {
  rocks: Rock[]
  compact?: boolean
}

interface TypeProgress {
  type: RockType
  count: number
  target: number
  percentage: number
}

// Target counts for "completion" - these are aspirational goals
const TYPE_TARGETS: Record<RockType, number> = {
  'Igneous': 5,
  'Sedimentary': 5,
  'Metamorphic': 5,
  'Mineral': 7,
  'Fossil': 3
}

function calculateProgress(rocks: Rock[]): TypeProgress[] {
  const typeCounts = new Map<RockType, number>()

  // Count rocks by type
  rocks.forEach(rock => {
    const current = typeCounts.get(rock.type) || 0
    typeCounts.set(rock.type, current + 1)
  })

  // Create progress for each type
  return ROCK_TYPES.map(type => {
    const count = typeCounts.get(type) || 0
    const target = TYPE_TARGETS[type]
    return {
      type,
      count,
      target,
      percentage: Math.min(100, Math.round((count / target) * 100))
    }
  }).filter(p => p.count > 0) // Only show types that have at least 1
    .sort((a, b) => b.percentage - a.percentage) // Sort by progress
}

export function CollectionProgress({ rocks, compact = false }: CollectionProgressProps) {
  const progress = calculateProgress(rocks)

  if (progress.length === 0) return null

  if (compact) {
    // Single line compact view
    return (
      <div className="flex items-center gap-3 text-[10px] text-stone-500">
        {progress.slice(0, 3).map(p => (
          <span key={p.type} className="flex items-center gap-1">
            <span className="text-stone-400">{p.type}</span>
            <span className={p.percentage >= 100 ? 'text-emerald-400' : ''}>
              {p.count}/{p.target}
            </span>
          </span>
        ))}
        {progress.length > 3 && (
          <span className="text-stone-600">+{progress.length - 3} more</span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">
        Collection Progress
      </p>
      <div className="grid grid-cols-2 gap-2">
        {progress.map(p => (
          <div key={p.type} className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] text-stone-400">{p.type}</span>
                <span className={`text-[10px] font-medium ${
                  p.percentage >= 100 ? 'text-emerald-400' : 'text-stone-500'
                }`}>
                  {p.count}/{p.target}
                </span>
              </div>
              <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    p.percentage >= 100
                      ? 'bg-emerald-500'
                      : p.percentage >= 60
                      ? 'bg-emerald-600'
                      : 'bg-stone-600'
                  }`}
                  style={{ width: `${p.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
