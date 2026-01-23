import { useState, useMemo } from 'react'
import {
  X, MapPin, Calendar, ThumbsUp, ThumbsDown, Shield, Users,
  Award, Sparkles, MessageSquare, ChevronDown, ChevronUp, Gem
} from 'lucide-react'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { SelfCollectedBadge } from '@/components/ui/SelfCollectedBadge'
import { VerificationBadge, VerificationStatus } from '@/components/ui/VerificationBadge'
import { useVerification } from '@/hooks/useVerification'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'
import { findSimilarRocks, getSimilarityReason } from '@/services/similarity'
import type { Rock, User, UserProfile } from '@/types'

interface RockDetailModalProps {
  rock: Rock
  user: User | null
  profile: UserProfile | null
  onClose: () => void
  onVoteSubmitted?: () => void
  allRocks?: Rock[]
  onSelectSimilar?: (rock: Rock) => void
}

export function RockDetailModal({
  rock,
  user,
  profile,
  onClose,
  onVoteSubmitted,
  allRocks = [],
  onSelectSimilar
}: RockDetailModalProps) {
  const [showVoteForm, setShowVoteForm] = useState(false)
  const [voteComment, setVoteComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showProperties, setShowProperties] = useState(false)

  // Find similar rocks
  const similarRocks = useMemo(() => {
    if (allRocks.length === 0) return []
    return findSimilarRocks(rock, allRocks, 6)
  }, [rock, allRocks])

  const {
    rockVerification,
    userVote,
    loading,
    submitVote,
    canVote,
    isExpert
  } = useVerification(rock, user, profile)

  const { swipeProps } = useSwipeToDismiss({
    onDismiss: onClose,
    threshold: 100,
    direction: 'down'
  })

  const handleVote = async (isAccurate: boolean) => {
    if (!canVote) return

    setSubmitting(true)
    try {
      await submitVote(isAccurate, voteComment.trim() || undefined)
      setShowVoteForm(false)
      setVoteComment('')
      onVoteSubmitted?.()
    } catch (err) {
      console.error('Failed to submit vote:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (timestamp: { seconds: number } | null) => {
    if (!timestamp?.seconds) return 'Unknown'
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div
        {...swipeProps}
        className="bg-stone-900 w-full max-w-lg sm:rounded-2xl border-t sm:border border-stone-800 shadow-2xl overflow-hidden animate-slide-up max-h-[95vh] flex flex-col"
      >
        {/* Swipe Handle Indicator */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-stone-600 rounded-full" />
        </div>

        {/* Image Header */}
        <div className="relative aspect-square sm:aspect-video flex-shrink-0">
          <img
            src={rock.imageUrl}
            alt={rock.name}
            className="w-full h-full object-cover"
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-11 h-11 bg-black/60 backdrop-blur-sm rounded-full
                       flex items-center justify-center text-white hover:bg-black/80 transition-colors
                       active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <RarityBadge score={rock.rarityScore} />
            {rock.isSelfCollected && <SelfCollectedBadge />}
            {rock.verificationLevel && rock.verificationLevel !== 'unverified' && (
              <VerificationBadge level={rock.verificationLevel} />
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-900 to-transparent" />

          {/* Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-serif font-bold text-white mb-1">
              {rock.name}
            </h2>
            {rock.scientificName && (
              <p className="text-sm text-stone-400 italic">{rock.scientificName}</p>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-4">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-1.5 text-stone-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm">{rock.type}</span>
              </div>
              {rock.location && (
                <div className="flex items-center space-x-1.5 text-stone-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{rock.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5 text-stone-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(rock.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-stone-300 text-sm leading-relaxed">
              {rock.description}
            </p>

            {/* Properties Accordion */}
            {(rock.hardness || rock.cleavage || rock.fracture || rock.visuals) && (
              <div className="border border-stone-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowProperties(!showProperties)}
                  className="w-full px-4 py-3 bg-stone-800/50 flex items-center justify-between
                             text-white font-medium hover:bg-stone-800 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Properties & Visuals</span>
                  </span>
                  {showProperties ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>

                {showProperties && (
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {rock.hardness && (
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase">Hardness</p>
                        <p className="text-white font-medium">{rock.hardness}</p>
                      </div>
                    )}
                    {rock.cleavage && (
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase">Cleavage</p>
                        <p className="text-white font-medium">{rock.cleavage}</p>
                      </div>
                    )}
                    {rock.fracture && (
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase">Fracture</p>
                        <p className="text-white font-medium">{rock.fracture}</p>
                      </div>
                    )}
                    {rock.visuals?.luster && (
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase">Luster</p>
                        <p className="text-white font-medium">{rock.visuals.luster}</p>
                      </div>
                    )}
                    {rock.visuals?.texture && (
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase">Texture</p>
                        <p className="text-white font-medium">{rock.visuals.texture}</p>
                      </div>
                    )}
                    {rock.visuals?.habit && (
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase">Crystal Habit</p>
                        <p className="text-white font-medium">{rock.visuals.habit}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Verification Section */}
            <div className="border border-stone-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-stone-800/50 flex items-center justify-between">
                <span className="flex items-center space-x-2 text-white font-medium">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Community Verification</span>
                </span>
                {rockVerification && (
                  <VerificationStatus
                    level={rockVerification.verificationLevel}
                    totalVotes={rockVerification.totalVotes}
                    weightedScore={rockVerification.weightedScore}
                  />
                )}
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-stone-600 border-t-emerald-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Current Status */}
                    {rockVerification ? (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-stone-400">Verification Score</span>
                          <span className={`text-sm font-bold ${
                            rockVerification.weightedScore > 0
                              ? 'text-emerald-400'
                              : rockVerification.weightedScore < 0
                              ? 'text-rose-400'
                              : 'text-stone-400'
                          }`}>
                            {rockVerification.weightedScore > 0 ? '+' : ''}{rockVerification.weightedScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              rockVerification.weightedScore > 0
                                ? 'bg-emerald-500'
                                : rockVerification.weightedScore < 0
                                ? 'bg-rose-500'
                                : 'bg-stone-600'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.abs(rockVerification.weightedScore) * 10)}%`
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {rockVerification.totalVotes} vote{rockVerification.totalVotes !== 1 ? 's' : ''} from the community
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4 text-center py-2">
                        <p className="text-stone-500 text-sm">
                          No verification votes yet
                        </p>
                        <p className="text-stone-600 text-xs mt-1">
                          Be the first to verify this identification!
                        </p>
                      </div>
                    )}

                    {/* User's Vote Status */}
                    {userVote ? (
                      <div className="bg-stone-800/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          {userVote.isAccurate ? (
                            <ThumbsUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ThumbsDown className="w-4 h-4 text-rose-400" />
                          )}
                          <span className="text-sm text-white font-medium">
                            You voted: {userVote.isAccurate ? 'Accurate' : 'Inaccurate'}
                          </span>
                        </div>
                        {userVote.comment && (
                          <p className="text-xs text-stone-400 italic mt-2">
                            "{userVote.comment}"
                          </p>
                        )}
                      </div>
                    ) : canVote ? (
                      <>
                        {!showVoteForm ? (
                          <button
                            onClick={() => setShowVoteForm(true)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl
                                       font-medium transition-colors flex items-center justify-center space-x-2"
                          >
                            <Award className="w-4 h-4" />
                            <span>Verify This Identification</span>
                            {isExpert && (
                              <span className="bg-amber-500 text-xs px-1.5 py-0.5 rounded font-bold ml-2">
                                Expert
                              </span>
                            )}
                          </button>
                        ) : (
                          <div className="space-y-3">
                            {isExpert && (
                              <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-2">
                                <p className="text-xs text-amber-400 flex items-center space-x-1">
                                  <Award className="w-3 h-3" />
                                  <span>Your expert vote carries extra weight!</span>
                                </p>
                              </div>
                            )}

                            <p className="text-sm text-stone-400">
                              Is this identification correct?
                            </p>

                            {/* Comment Input */}
                            <div>
                              <label className="flex items-center space-x-1 text-xs text-stone-500 mb-1.5">
                                <MessageSquare className="w-3 h-3" />
                                <span>Add a comment (optional)</span>
                              </label>
                              <textarea
                                value={voteComment}
                                onChange={(e) => setVoteComment(e.target.value)}
                                placeholder="e.g., The crystal structure confirms this..."
                                maxLength={200}
                                rows={2}
                                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2
                                           text-white text-sm placeholder-stone-500 resize-none
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* Vote Buttons */}
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleVote(false)}
                                disabled={submitting}
                                className="flex-1 py-3 bg-rose-900/50 hover:bg-rose-800 text-rose-400
                                           rounded-xl font-medium transition-colors flex items-center
                                           justify-center space-x-2 disabled:opacity-50"
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span>Inaccurate</span>
                              </button>
                              <button
                                onClick={() => handleVote(true)}
                                disabled={submitting}
                                className="flex-1 py-3 bg-emerald-900/50 hover:bg-emerald-800 text-emerald-400
                                           rounded-xl font-medium transition-colors flex items-center
                                           justify-center space-x-2 disabled:opacity-50"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Accurate</span>
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                setShowVoteForm(false)
                                setVoteComment('')
                              }}
                              className="w-full py-2 text-stone-500 hover:text-stone-300 text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-stone-500 text-sm">
                          {!user
                            ? 'Sign in to verify identifications'
                            : rock.ownerId === user.uid
                            ? "You can't verify your own specimens"
                            : 'Verification not available'}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Expert Verification Info */}
            {rockVerification?.expertVerifiedBy && (
              <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-bold">Expert Verified</span>
                </div>
                <p className="text-sm text-amber-300/70">
                  This specimen has been verified by an expert geologist in the community.
                </p>
              </div>
            )}

            {/* Similar Rocks Section */}
            {similarRocks.length > 0 && onSelectSimilar && (
              <div className="border border-stone-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-stone-800/50 flex items-center space-x-2">
                  <Gem className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">Similar Specimens</span>
                  <span className="text-stone-500 text-sm">({similarRocks.length})</span>
                </div>

                <div className="p-3">
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar">
                    {similarRocks.map(({ rock: similarRock, reasons }) => (
                      <button
                        key={similarRock.id}
                        onClick={() => onSelectSimilar(similarRock)}
                        className="flex-shrink-0 w-28 group"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-1.5
                                        ring-2 ring-transparent group-hover:ring-purple-500 transition-all">
                          <img
                            src={similarRock.imageUrl}
                            alt={similarRock.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-1 left-1">
                            <RarityBadge score={similarRock.rarityScore} size="sm" />
                          </div>
                        </div>
                        <p className="text-xs text-white font-medium truncate group-hover:text-purple-400 transition-colors">
                          {similarRock.name}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {getSimilarityReason({ rock: similarRock, score: 0, reasons })}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
