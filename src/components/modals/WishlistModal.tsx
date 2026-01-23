import { useState } from 'react'
import { X, Plus, Heart, Sparkles } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'
import { ROCK_TYPES, WISHLIST_CONFIG } from '@/constants'
import type { RockType, LusterType, CrystalHabit } from '@/types'

interface WishlistModalProps {
  onClose: () => void
  onSave: (item: WishlistItemInput) => Promise<void>
  existingCount: number
}

interface WishlistItemInput {
  rockType?: RockType
  name?: string
  minRarity?: number
  maxRarity?: number
  lusters?: LusterType[]
  habits?: CrystalHabit[]
  isPublic: boolean
}

const LUSTER_OPTIONS: LusterType[] = [
  'Vitreous', 'Adamantine', 'Metallic', 'Resinous',
  'Waxy', 'Silky', 'Pearly', 'Dull', 'Earthy'
]

const HABIT_OPTIONS: CrystalHabit[] = [
  'Cubic', 'Octahedral', 'Prismatic', 'Tabular',
  'Botryoidal', 'Stalactitic', 'Dendritic', 'Acicular', 'Massive'
]

export function WishlistModal({ onClose, onSave, existingCount }: WishlistModalProps) {
  const [rockType, setRockType] = useState<RockType | ''>('')
  const [name, setName] = useState('')
  const [minRarity, setMinRarity] = useState<string>('')
  const [maxRarity, setMaxRarity] = useState<string>('')
  const [selectedLusters, setSelectedLusters] = useState<LusterType[]>([])
  const [selectedHabits, setSelectedHabits] = useState<CrystalHabit[]>([])
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSave = name || rockType || minRarity || maxRarity ||
    selectedLusters.length > 0 || selectedHabits.length > 0

  const atLimit = existingCount >= WISHLIST_CONFIG.MAX_WISHLIST_ITEMS

  const handleSave = async () => {
    if (!canSave || atLimit) return

    setSaving(true)
    setError(null)

    try {
      const item: WishlistItemInput = {
        isPublic
      }

      if (rockType) item.rockType = rockType as RockType
      if (name.trim()) item.name = name.trim()
      if (minRarity) item.minRarity = parseInt(minRarity)
      if (maxRarity) item.maxRarity = parseInt(maxRarity)
      if (selectedLusters.length > 0) item.lusters = selectedLusters
      if (selectedHabits.length > 0) item.habits = selectedHabits

      await onSave(item)
      onClose()
    } catch (err) {
      console.error('Failed to save wishlist item:', err)
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleLuster = (luster: LusterType) => {
    setSelectedLusters(prev =>
      prev.includes(luster)
        ? prev.filter(l => l !== luster)
        : [...prev, luster]
    )
  }

  const toggleHabit = (habit: CrystalHabit) => {
    setSelectedHabits(prev =>
      prev.includes(habit)
        ? prev.filter(h => h !== habit)
        : [...prev, habit]
    )
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-stone-900 w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-rose-900/50 flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white">Add to Wishlist</h3>
              <p className="text-[10px] text-stone-500">
                {existingCount}/{WISHLIST_CONFIG.MAX_WISHLIST_ITEMS} items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {atLimit && (
            <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-400">
                You've reached the maximum number of wishlist items.
                Remove some to add new ones.
              </p>
            </div>
          )}

          {/* Rock Name */}
          <div>
            <label className="block text-xs text-stone-400 mb-1.5">
              Rock/Mineral Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Amethyst, Quartz, Fluorite..."
              disabled={atLimit}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5
                         text-white text-sm placeholder-stone-500
                         focus:outline-none focus:ring-2 focus:ring-rose-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Rock Type */}
          <div>
            <label className="block text-xs text-stone-400 mb-1.5">
              Type
            </label>
            <select
              value={rockType}
              onChange={(e) => setRockType(e.target.value as RockType | '')}
              disabled={atLimit}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5
                         text-white text-sm appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-rose-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Any Type</option>
              {ROCK_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Rarity Range */}
          <div>
            <label className="block text-xs text-stone-400 mb-1.5">
              Rarity Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={1}
                max={10}
                value={minRarity}
                onChange={(e) => setMinRarity(e.target.value)}
                placeholder="Min (1)"
                disabled={atLimit}
                className="bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5
                           text-white text-sm placeholder-stone-500
                           focus:outline-none focus:ring-2 focus:ring-rose-500
                           disabled:opacity-50"
              />
              <input
                type="number"
                min={1}
                max={10}
                value={maxRarity}
                onChange={(e) => setMaxRarity(e.target.value)}
                placeholder="Max (10)"
                disabled={atLimit}
                className="bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5
                           text-white text-sm placeholder-stone-500
                           focus:outline-none focus:ring-2 focus:ring-rose-500
                           disabled:opacity-50"
              />
            </div>
          </div>

          {/* Luster Selection */}
          <div>
            <label className="block text-xs text-stone-400 mb-1.5">
              Luster Preference
            </label>
            <div className="flex flex-wrap gap-2">
              {LUSTER_OPTIONS.map(luster => (
                <button
                  key={luster}
                  onClick={() => toggleLuster(luster)}
                  disabled={atLimit}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${selectedLusters.includes(luster)
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {luster}
                </button>
              ))}
            </div>
          </div>

          {/* Habit Selection */}
          <div>
            <label className="block text-xs text-stone-400 mb-1.5">
              Crystal Habit
            </label>
            <div className="flex flex-wrap gap-2">
              {HABIT_OPTIONS.map(habit => (
                <button
                  key={habit}
                  onClick={() => toggleHabit(habit)}
                  disabled={atLimit}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${selectedHabits.includes(habit)
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {habit}
                </button>
              ))}
            </div>
          </div>

          {/* Public Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-white">Make Public</p>
              <p className="text-[10px] text-stone-500">
                Others can see and help fulfill your wishlist
              </p>
            </div>
            <Toggle checked={isPublic} onChange={setIsPublic} disabled={atLimit} />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-900/30 border border-rose-800 rounded-lg p-3">
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-stone-800 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving || !canSave || atLimit}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-stone-700
                       disabled:cursor-not-allowed text-white rounded-xl font-bold
                       transition-colors flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Wishlist</span>
              </>
            )}
          </button>
          {!canSave && !atLimit && (
            <p className="text-[10px] text-stone-500 text-center mt-2">
              Add at least one criteria to create a wishlist item
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
