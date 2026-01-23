import { X } from 'lucide-react'
import type { Rock } from '@/types'

interface TradeModalProps {
  targetRock: Rock
  personalRocks: Rock[]
  onClose: () => void
  onTrade: (offeredRock: Rock) => void
}

export function TradeModal({
  targetRock,
  personalRocks,
  onClose,
  onTrade
}: TradeModalProps) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-stone-900 w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
          <h3 className="font-serif font-bold text-white">Propose Trade</h3>
          <button onClick={onClose} aria-label="Close modal">
            <X className="w-6 h-6 text-stone-500 hover:text-white transition-colors" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-stone-400 mb-4">
            Select an item from your vault to offer for{' '}
            <span className="text-white font-bold">
              {targetRock.marketTitle || targetRock.name}
            </span>
            :
          </p>

          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
            {personalRocks.length === 0 ? (
              <p className="col-span-2 text-center text-stone-500 py-8">
                Your vault is empty. Scan some rocks first!
              </p>
            ) : (
              personalRocks.map((rock) => (
                <button
                  key={rock.id}
                  onClick={() => onTrade(rock)}
                  className="bg-stone-800 p-2 rounded-lg border border-stone-700 cursor-pointer hover:border-emerald-500 transition-colors text-left"
                >
                  <div className="aspect-square rounded bg-black mb-2 overflow-hidden">
                    <img
                      src={rock.imageUrl}
                      alt={rock.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  <p className="text-xs font-bold text-white truncate">
                    {rock.name}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
