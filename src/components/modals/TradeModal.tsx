import { useState } from 'react'
import { X, Repeat, ArrowRight, MessageSquare } from 'lucide-react'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { SellerBadge } from '@/components/ui/ReputationBadge'
import type { Rock, UserReputation } from '@/types'

interface TradeModalProps {
  targetRock: Rock
  personalRocks: Rock[]
  onClose: () => void
  onTrade: (offeredRock: Rock, message?: string) => void
  sellerReputation?: UserReputation | null
  loading?: boolean
}

export function TradeModal({
  targetRock,
  personalRocks,
  onClose,
  onTrade,
  sellerReputation,
  loading = false
}: TradeModalProps) {
  const [selectedRock, setSelectedRock] = useState<Rock | null>(null)
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'select' | 'confirm'>('select')

  const handleSelectRock = (rock: Rock) => {
    setSelectedRock(rock)
    setStep('confirm')
  }

  const handleConfirmTrade = () => {
    if (selectedRock) {
      onTrade(selectedRock, message.trim() || undefined)
    }
  }

  const handleBack = () => {
    setStep('select')
    setSelectedRock(null)
    setMessage('')
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-stone-900 w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center">
              <Repeat className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white">
                {step === 'select' ? 'Propose Trade' : 'Confirm Trade'}
              </h3>
              <p className="text-[10px] text-stone-500">
                {step === 'select' ? 'Select an item to offer' : 'Review and send proposal'}
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

        {step === 'select' ? (
          <div className="p-4">
            {/* Target Rock Preview */}
            <div className="bg-stone-800/50 rounded-xl p-3 mb-4 flex items-center space-x-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={targetRock.imageUrl}
                  alt={targetRock.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {targetRock.marketTitle || targetRock.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <RarityBadge score={targetRock.rarityScore} size="sm" />
                  {sellerReputation && (
                    <SellerBadge reputation={sellerReputation} size="sm" />
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-stone-400 mb-3">
              Choose a specimen from your vault to offer:
            </p>

            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {personalRocks.length === 0 ? (
                <p className="col-span-2 text-center text-stone-500 py-8">
                  Your vault is empty. Scan some rocks first!
                </p>
              ) : (
                personalRocks.map((rock) => (
                  <button
                    key={rock.id}
                    onClick={() => handleSelectRock(rock)}
                    className="bg-stone-800 p-2 rounded-lg border border-stone-700 cursor-pointer
                               hover:border-emerald-500 hover:bg-stone-800/80 transition-all text-left group"
                  >
                    <div className="aspect-square rounded bg-black mb-2 overflow-hidden relative">
                      <img
                        src={rock.imageUrl}
                        alt={rock.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-1 right-1">
                        <RarityBadge score={rock.rarityScore} size="sm" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-white truncate">
                      {rock.name}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Trade Preview */}
            <div className="flex items-center justify-between mb-4">
              {/* Your Offer */}
              <div className="flex-1 text-center">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-2">
                  You Offer
                </p>
                <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto border-2 border-emerald-600">
                  <img
                    src={selectedRock?.imageUrl}
                    alt={selectedRock?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-bold text-white mt-2 truncate px-2">
                  {selectedRock?.name}
                </p>
                <RarityBadge score={selectedRock?.rarityScore || 1} size="sm" />
              </div>

              {/* Arrow */}
              <div className="px-3">
                <ArrowRight className="w-6 h-6 text-emerald-500" />
              </div>

              {/* They Offer */}
              <div className="flex-1 text-center">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-2">
                  For Their
                </p>
                <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto border-2 border-amber-600">
                  <img
                    src={targetRock.imageUrl}
                    alt={targetRock.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-bold text-white mt-2 truncate px-2">
                  {targetRock.marketTitle || targetRock.name}
                </p>
                <RarityBadge score={targetRock.rarityScore} size="sm" />
              </div>
            </div>

            {/* Seller Info */}
            {sellerReputation && (
              <div className="bg-stone-800/50 rounded-lg p-3 mb-4">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">
                  Seller Reputation
                </p>
                <SellerBadge reputation={sellerReputation} size="md" showStats />
              </div>
            )}

            {/* Message Input */}
            <div className="mb-4">
              <label className="flex items-center space-x-1 text-xs text-stone-400 mb-2">
                <MessageSquare className="w-3 h-3" />
                <span>Add a message (optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., I found this in Colorado last summer..."
                maxLength={200}
                rows={2}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2
                           text-white text-sm placeholder-stone-500 resize-none
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-stone-600 text-right mt-1">
                {message.length}/200
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl
                           font-medium transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirmTrade}
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl
                           font-bold transition-colors flex items-center justify-center space-x-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Repeat className="w-4 h-4" />
                    <span>Send Proposal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
