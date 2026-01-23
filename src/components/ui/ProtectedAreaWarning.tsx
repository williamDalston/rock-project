import { AlertTriangle, X, MapPin, Eye } from 'lucide-react'
import type { ProtectedAreaResult } from '@/types'

interface ProtectedAreaWarningProps {
  area: ProtectedAreaResult
  onClose: () => void
  onSaveAsObservation: () => void
}

export function ProtectedAreaWarning({
  area,
  onClose,
  onSaveAsObservation
}: ProtectedAreaWarningProps) {
  const typeLabel = area.areaType === 'national_park'
    ? 'National Park'
    : area.areaType === 'national_monument'
    ? 'National Monument'
    : 'Protected Wilderness'

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 w-full max-w-sm rounded-2xl border border-rose-800/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-rose-900/30 p-4 flex items-start justify-between border-b border-rose-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-rose-400">Protected Area</h3>
              <p className="text-xs text-rose-300/70">{typeLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start space-x-3 mb-4">
            <MapPin className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white font-medium">{area.areaName}</p>
          </div>

          <div className="bg-rose-950/50 rounded-lg p-3 mb-4 border border-rose-900/50">
            <p className="text-xs text-rose-200/80 leading-relaxed">
              <strong>Collection of rocks, minerals, fossils, and other natural objects is prohibited</strong> in {typeLabel}s under federal law (36 CFR 2.1).
            </p>
            <p className="text-xs text-stone-400 mt-2">
              Violations can result in fines up to $5,000 and/or imprisonment.
            </p>
          </div>

          <p className="text-xs text-stone-400 mb-4">
            You can still save this as an <strong>observation only</strong> - documenting what you saw without claiming ownership.
          </p>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={onSaveAsObservation}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Save as Observation Only</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-stone-500 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline warning banner for the scan view
interface ProtectedAreaBannerProps {
  area: ProtectedAreaResult
}

export function ProtectedAreaBanner({ area }: ProtectedAreaBannerProps) {
  return (
    <div className="bg-rose-900/30 border border-rose-800/50 rounded-lg p-3 flex items-center space-x-3">
      <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-xs font-bold text-rose-400">Protected Area Detected</p>
        <p className="text-[10px] text-rose-300/70">{area.areaName}</p>
      </div>
    </div>
  )
}
