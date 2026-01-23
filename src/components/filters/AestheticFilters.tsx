import type { AestheticFilter, Rock } from '@/types'
import { AESTHETIC_FILTERS } from '@/constants'

interface AestheticFiltersProps {
  activeFilter: AestheticFilter
  onFilterChange: (filter: AestheticFilter) => void
}

export function AestheticFilters({ activeFilter, onFilterChange }: AestheticFiltersProps) {
  const filters = Object.entries(AESTHETIC_FILTERS) as [AestheticFilter, typeof AESTHETIC_FILTERS[AestheticFilter]][]

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map(([key, config]) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`
            flex items-center space-x-1.5 px-3 py-1.5 rounded-full
            whitespace-nowrap text-sm font-medium
            transition-all duration-200
            ${activeFilter === key
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white'
            }
          `}
        >
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </button>
      ))}
    </div>
  )
}

/**
 * Filter rocks based on the selected aesthetic filter
 */
export function filterRocksByAesthetic(rocks: Rock[], filter: AestheticFilter): Rock[] {
  if (filter === 'all') return rocks

  const config = AESTHETIC_FILTERS[filter]

  return rocks.filter((rock) => {
    // Check luster match
    if (config.lusters && rock.visuals?.luster) {
      const lusterMatch = config.lusters.some(
        (l) => rock.visuals.luster.toLowerCase().includes(l.toLowerCase())
      )
      if (lusterMatch) return true
    }

    // Check habit match
    if (config.habits && rock.visuals?.habit) {
      const habitMatch = config.habits.some(
        (h) => rock.visuals.habit?.toLowerCase().includes(h.toLowerCase())
      )
      if (habitMatch) return true
    }

    // Check texture match
    if (config.textures && rock.visuals?.texture) {
      const textureMatch = config.textures.some(
        (t) => rock.visuals.texture.toLowerCase().includes(t.toLowerCase())
      )
      if (textureMatch) return true
    }

    return false
  })
}
