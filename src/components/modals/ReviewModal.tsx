import { useState } from 'react'
import { X, Star, Camera } from 'lucide-react'
import type { TradeProposal } from '@/types'
import { REPUTATION_CONFIG } from '@/constants'

interface ReviewModalProps {
  trade: TradeProposal
  onClose: () => void
  onSubmit: (rating: 1 | 2 | 3 | 4 | 5, comment?: string, photoUrl?: string) => Promise<void>
}

export function ReviewModal({ trade, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      await onSubmit(rating, comment || undefined)
      onClose()
    } catch (err) {
      console.error('Failed to submit review:', err)
      setError('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const displayRating = hoverRating ?? rating

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent!'
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-stone-900 w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
          <h3 className="font-serif font-bold text-white text-lg">Rate Your Trade</h3>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Trade Info */}
          <div className="bg-stone-800/50 rounded-xl p-3 flex items-center space-x-3">
            <img
              src={trade.targetRock.imageUrl}
              alt={trade.targetRock.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-400">Trade for</p>
              <p className="text-white font-bold truncate">
                {trade.targetRock.marketTitle || trade.targetRock.name}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="text-center py-2">
            <p className="text-sm text-stone-400 mb-3">How was your experience?</p>
            <div className="flex justify-center space-x-2 mb-2">
              {([1, 2, 3, 4, 5] as const).map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= displayRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-600 hover:text-stone-500'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className={`text-sm font-medium ${
              displayRating >= 4 ? 'text-emerald-400' :
              displayRating >= 3 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {ratingLabels[displayRating]}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs text-stone-400 mb-2">
              Share your experience (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about this trade..."
              maxLength={REPUTATION_CONFIG.MAX_REVIEW_LENGTH}
              rows={3}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3
                         text-white text-sm resize-none placeholder-stone-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-[10px] text-stone-600">
                {comment.length > 0 && `${comment.length}/${REPUTATION_CONFIG.MAX_REVIEW_LENGTH}`}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-900/30 border border-rose-800 rounded-lg p-3">
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700
                       disabled:cursor-not-allowed text-white rounded-xl font-bold
                       transition-colors flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                <span>Submit Review</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-full py-2 text-stone-500 hover:text-white text-sm font-medium transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
