import { useState, useEffect } from 'react'
import { X, Hexagon, Calendar, Loader } from 'lucide-react'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { APP_CONFIG } from '@/constants'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { ReputationBadge } from '@/components/ui/ReputationBadge'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'
import type { UserProfile, Rock } from '@/types'

interface UserProfileModalProps {
  userId: string
  onClose: () => void
  onRockClick?: (rock: Rock) => void
}

export function UserProfileModal({ userId, onClose, onRockClick }: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [rocks, setRocks] = useState<Rock[]>([])
  const [loading, setLoading] = useState(true)

  const { swipeProps } = useSwipeToDismiss({
    onDismiss: onClose,
    threshold: 100,
    direction: 'down'
  })

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true)
      try {
        // Fetch user profile
        const profilePath = `artifacts/${APP_CONFIG.APP_ID}/users/${userId}/profile`
        const profileRef = doc(db, profilePath, 'data')
        const profileSnap = await getDoc(profileRef)

        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as UserProfile)
        }

        // Fetch user's public rocks from market
        const marketPath = `artifacts/${APP_CONFIG.APP_ID}/public/market/rocks`
        const rocksRef = collection(db, marketPath)
        const rocksQuery = query(rocksRef, where('ownerId', '==', userId))
        const rocksSnap = await getDocs(rocksQuery)

        const userRocks = rocksSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Rock[]

        // Sort by creation date
        userRocks.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0
          const bTime = b.createdAt?.seconds || 0
          return bTime - aTime
        })

        setRocks(userRocks)
      } catch (err) {
        console.error('Failed to fetch user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const formatDate = (timestamp: { seconds: number } | null) => {
    if (!timestamp?.seconds) return ''
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div
        {...swipeProps}
        className="bg-stone-900 w-full max-w-lg sm:max-w-2xl lg:max-w-3xl sm:rounded-2xl border-t sm:border border-stone-800 shadow-2xl overflow-hidden animate-modal-enter max-h-[90vh] flex flex-col"
      >
        {/* Swipe Handle - Mobile */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-stone-600 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 bg-black/60 backdrop-blur-sm rounded-full
                     flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : profile ? (
          <>
            {/* Profile Header */}
            <div className="p-6 pb-4 bg-gradient-to-b from-stone-800/50 to-transparent">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-stone-800 border-3 border-stone-700 overflow-hidden flex-shrink-0">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Hexagon className="w-10 h-10 text-emerald-500" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pt-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white truncate">
                    {profile.displayName || `Geologist ${profile.userId.slice(0, 6)}`}
                  </h2>

                  <div className="mt-1">
                    <LevelBadge level={profile.level} title={profile.title} size="md" />
                  </div>

                  {profile.joinedAt && (
                    <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {formatDate(profile.joinedAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-4 text-sm text-stone-400 italic leading-relaxed">
                  "{profile.bio}"
                </p>
              )}

              {/* Stats Row */}
              <div className="flex gap-6 mt-4 pt-4 border-t border-stone-800">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{rocks.length}</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider">Listed</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{profile.totalTrades}</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider">Trades</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{profile.totalSpecimens}</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider">Collected</p>
                </div>
                {/* Reputation */}
                {profile.reputation && (
                  <div className="ml-auto">
                    <ReputationBadge reputation={profile.reputation} size="md" />
                  </div>
                )}
              </div>

              {/* Badges */}
              {profile.badges && profile.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-800">
                  {profile.badges.slice(0, 8).map((badge) => (
                    <span
                      key={badge.id}
                      className="text-lg"
                      title={badge.name}
                    >
                      {badge.icon}
                    </span>
                  ))}
                  {profile.badges.length > 8 && (
                    <span className="text-xs text-stone-500 self-center">
                      +{profile.badges.length - 8} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* User's Rocks */}
            <div className="flex-1 overflow-y-auto p-4 pt-2">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">
                Listed Specimens ({rocks.length})
              </h3>

              {rocks.length === 0 ? (
                <div className="text-center py-8">
                  <Hexagon className="w-10 h-10 text-stone-700 mx-auto mb-2" />
                  <p className="text-stone-500 text-sm">No rocks listed yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {rocks.map((rock) => (
                    <button
                      key={rock.id}
                      onClick={() => {
                        onClose()
                        onRockClick?.(rock)
                      }}
                      className="bg-stone-800 rounded-xl overflow-hidden group hover:ring-2 hover:ring-emerald-500/50 transition-all"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={rock.imageUrl}
                          alt={rock.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 right-2">
                          <RarityBadge score={rock.rarityScore} size="sm" />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-white truncate">
                          {rock.marketTitle || rock.name}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {rock.type}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Hexagon className="w-12 h-12 text-stone-700 mx-auto mb-3" />
            <p className="text-stone-500">Profile not found</p>
          </div>
        )}
      </div>
    </div>
  )
}
