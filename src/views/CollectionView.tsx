import { Share2, Eye, MapPin, Hexagon } from 'lucide-react'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { XPBar } from '@/components/ui/XPBar'
import { SelfCollectedBadge } from '@/components/ui/SelfCollectedBadge'
import type { Rock, UserProfile } from '@/types'

interface CollectionViewProps {
  personalRocks: Rock[]
  profile: UserProfile | null
}

export function CollectionView({ personalRocks, profile }: CollectionViewProps) {
  const formatDate = (timestamp: { seconds: number } | null) => {
    if (!timestamp?.seconds) return ''
    return new Date(timestamp.seconds * 1000).toLocaleDateString()
  }

  // Calculate stats
  const selfCollectedCount = personalRocks.filter(r => r.isSelfCollected).length
  const observationCount = personalRocks.filter(r => r.isObservationOnly).length
  const rockTypes = new Set(personalRocks.map(r => r.type))

  return (
    <>
      {/* Profile Header */}
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
        {profile && (
          <div className="px-4 py-4 border-b border-stone-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center">
                  <Hexagon className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-bold">
                    {profile.displayName || `Geologist ${profile.userId.slice(0, 6)}`}
                  </p>
                  <LevelBadge
                    level={profile.level}
                    title={profile.title}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <XPBar xp={profile.xp} level={profile.level} />

            {/* Badges */}
            {profile.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.badges.slice(0, 5).map((badge) => (
                  <span
                    key={badge.id}
                    className="text-lg"
                    title={badge.name}
                  >
                    {badge.icon}
                  </span>
                ))}
                {profile.badges.length > 5 && (
                  <span className="text-xs text-stone-500">
                    +{profile.badges.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Stats Row */}
            <div className="flex justify-between mt-4 pt-3 border-t border-stone-800">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{personalRocks.length}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Specimens</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{selfCollectedCount}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Self-Found</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{rockTypes.size}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Types</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{profile.totalTrades}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Trades</p>
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="px-6 py-4">
          <h1 className="font-serif text-2xl font-bold text-white">The Vault</h1>
          <div className="flex justify-between items-end mt-1">
            <p className="text-[10px] text-stone-500 uppercase tracking-widest">
              Personal Accessions
            </p>
            <div className="flex space-x-2">
              <div className="h-1 w-1 bg-emerald-500 rounded-full" />
              <div className="h-1 w-1 bg-stone-700 rounded-full" />
              <div className="h-1 w-1 bg-stone-700 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 grid grid-cols-2 gap-4">
        {personalRocks.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-20 text-stone-500">
            <Hexagon className="w-12 h-12 mb-4 text-stone-700" />
            <p className="text-lg font-serif">Your vault is empty</p>
            <p className="text-sm mt-2">Scan your first specimen to begin!</p>
          </div>
        ) : (
          personalRocks.map((rock) => (
            <article
              key={rock.id}
              className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 group"
            >
              <div className="aspect-square relative">
                <img
                  src={rock.imageUrl}
                  alt={rock.name}
                  className="w-full h-full object-cover"
                />

                {/* Badges Overlay */}
                <div className="absolute top-2 left-2 right-2 flex justify-between">
                  <div className="flex flex-col space-y-1">
                    {rock.isSelfCollected && <SelfCollectedBadge size="sm" />}
                    {rock.isObservationOnly && (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-stone-800/80 text-stone-400 text-[8px]">
                        <Eye className="w-2 h-2" />
                        <span>Observation</span>
                      </span>
                    )}
                  </div>
                  <RarityBadge score={rock.rarityScore} />
                </div>

                {/* Location indicator */}
                {rock.location && (
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    <MapPin className="w-2 h-2 text-emerald-400" />
                    <span className="text-[8px] text-stone-300 max-w-[80px] truncate">
                      {rock.location}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="font-bold text-white text-sm truncate">
                  {rock.name}
                </h3>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">
                  {rock.type}
                </p>

                {/* Extended info */}
                {rock.hardness && (
                  <p className="text-[9px] text-stone-600 mt-1">
                    Hardness: {rock.hardness}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-stone-800 flex justify-between items-center">
                  <span className="text-[10px] text-stone-600 font-mono">
                    {formatDate(rock.createdAt)}
                  </span>
                  <div className="flex items-center space-x-2">
                    {rock.likes && rock.likes > 0 && (
                      <span className="text-[10px] text-rose-400">
                        ❤️ {rock.likes}
                      </span>
                    )}
                    <button className="text-stone-600 hover:text-emerald-400 transition-colors">
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  )
}
