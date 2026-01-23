import { useState } from 'react'
import { Loader, ScanLine, Sparkles, Droplets, MapPin, Navigation, Hexagon } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'
import { ConfidenceMeter } from '@/components/ui/ConfidenceMeter'
import { ProtectedAreaWarning, ProtectedAreaBanner } from '@/components/ui/ProtectedAreaWarning'
import { useGeolocation } from '@/hooks/useGeolocation'
import type { RockFormData, AIAnalysisResult, AIConfidence, PhysicalTest } from '@/types'

interface ScanViewProps {
  formData: RockFormData
  analysisResult: AIAnalysisResult | null
  isAnalyzing: boolean
  onFormChange: (data: Partial<RockFormData>) => void
  onSave: () => void
  onSaveAsObservation: () => void
  onDiscard: () => void
}

export function ScanView({
  formData,
  analysisResult,
  isAnalyzing,
  onFormChange,
  onSave,
  onSaveAsObservation,
  onDiscard
}: ScanViewProps) {
  const [showProtectedWarning, setShowProtectedWarning] = useState(false)
  const {
    coords,
    loading: geoLoading,
    locationName,
    protectedArea,
    requestLocation
  } = useGeolocation()

  // Handle GPS capture
  const handleCaptureLocation = async () => {
    await requestLocation()
    if (coords) {
      onFormChange({
        coordinates: coords,
        location: locationName || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
      })
    }
  }

  // Handle save with protected area check
  const handleSave = () => {
    if (protectedArea?.isProtected) {
      setShowProtectedWarning(true)
    } else {
      onSave()
    }
  }

  const handleSaveObservation = () => {
    setShowProtectedWarning(false)
    onSaveAsObservation()
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 pb-20">
      {/* Image Preview */}
      <div className="h-[40vh] relative bg-black">
        {formData.imageUrl ? (
          <img
            src={formData.imageUrl}
            alt="Rock specimen"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="relative mb-4">
              <Hexagon className="w-16 h-16 text-emerald-400 animate-spin" strokeWidth={1} />
              <ScanLine className="w-8 h-8 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="font-mono text-emerald-400 text-xs uppercase tracking-widest">
              Analyzing Specimen...
            </p>
            <div className="flex space-x-4 mt-3">
              <span className="text-[10px] text-emerald-500/70 animate-pulse">Luster</span>
              <span className="text-[10px] text-emerald-500/70 animate-pulse delay-100">Texture</span>
              <span className="text-[10px] text-emerald-500/70 animate-pulse delay-200">Hardness</span>
            </div>
          </div>
        )}
      </div>

      {/* Form Panel */}
      <div className="p-6 -mt-6 relative z-10 bg-stone-950 rounded-t-3xl border-t border-stone-800 min-h-[60vh]">
        <div className="w-12 h-1 bg-stone-800 rounded-full mx-auto mb-6" />

        <div className="space-y-5">
          {/* Protected Area Banner */}
          {protectedArea?.isProtected && (
            <ProtectedAreaBanner area={protectedArea} />
          )}

          {/* Confidence Meter */}
          {analysisResult?.confidence && !isAnalyzing && (
            <ConfidenceMeter
              confidence={analysisResult.confidence}
              physicalTest={analysisResult.physicalTest}
            />
          )}

          {/* Name & Rarity */}
          <div className="flex justify-between items-start">
            <div className="flex-grow pr-4">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                Identification
              </label>
              <input
                value={formData.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                className="bg-transparent text-2xl font-serif font-bold text-white w-full focus:outline-none placeholder-stone-700"
                placeholder="Identifying..."
              />
              {formData.scientificName && (
                <p className="text-emerald-500 text-xs font-mono mt-1">
                  {formData.scientificName}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                Rarity
              </label>
              <input
                type="number"
                max={10}
                min={1}
                value={formData.rarityScore}
                onChange={(e) =>
                  onFormChange({ rarityScore: parseInt(e.target.value) || 1 })
                }
                className="bg-stone-900 border border-stone-800 text-center text-white w-12 h-10 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* GPS Location Capture */}
          <div className="bg-stone-900/50 p-3 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    Location
                  </p>
                  <p className="text-sm text-stone-300">
                    {formData.location || locationName || 'Not captured'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCaptureLocation}
                disabled={geoLoading}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs text-stone-300 transition-colors"
              >
                {geoLoading ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                <span>{coords ? 'Update' : 'Capture'}</span>
              </button>
            </div>
          </div>

          {/* Visual Properties Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-900/50 p-3 rounded-xl border border-stone-800">
              <div className="flex items-center space-x-2 mb-1 text-stone-400">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-widest">Luster</span>
              </div>
              <input
                value={formData.visuals.luster}
                onChange={(e) =>
                  onFormChange({
                    visuals: { ...formData.visuals, luster: e.target.value }
                  })
                }
                className="bg-transparent text-sm font-medium text-stone-200 w-full focus:outline-none"
                placeholder="..."
              />
            </div>
            <div className="bg-stone-900/50 p-3 rounded-xl border border-stone-800">
              <div className="flex items-center space-x-2 mb-1 text-stone-400">
                <Droplets className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-widest">Texture</span>
              </div>
              <input
                value={formData.visuals.texture}
                onChange={(e) =>
                  onFormChange({
                    visuals: { ...formData.visuals, texture: e.target.value }
                  })
                }
                className="bg-transparent text-sm font-medium text-stone-200 w-full focus:outline-none"
                placeholder="..."
              />
            </div>
          </div>

          {/* Extended Properties (from AI) */}
          {(formData.hardness || formData.cleavage) && (
            <div className="grid grid-cols-2 gap-3">
              {formData.hardness && (
                <div className="bg-stone-900/50 p-3 rounded-xl border border-stone-800">
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Hardness</p>
                  <p className="text-sm font-medium text-stone-200">{formData.hardness} (Mohs)</p>
                </div>
              )}
              {formData.cleavage && (
                <div className="bg-stone-900/50 p-3 rounded-xl border border-stone-800">
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Cleavage</p>
                  <p className="text-sm font-medium text-stone-200 truncate">{formData.cleavage}</p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              rows={3}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-300 mt-2 focus:border-emerald-500 focus:outline-none text-sm leading-relaxed"
            />
          </div>

          {/* Self-Collected Toggle */}
          <Toggle
            enabled={formData.isSelfCollected || false}
            onChange={(enabled) => onFormChange({ isSelfCollected: enabled })}
            label="I found this in the field"
          />

          {/* Public Toggle */}
          <Toggle
            enabled={formData.isPublic}
            onChange={(enabled) => onFormChange({ isPublic: enabled })}
            label="List on Global Market"
          />

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onDiscard}
              className="flex-1 py-4 rounded-xl font-bold text-stone-500 hover:bg-stone-900 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-colors"
            >
              {protectedArea?.isProtected ? 'Review & Save' : 'Accession to Vault'}
            </button>
          </div>
        </div>
      </div>

      {/* Protected Area Warning Modal */}
      {showProtectedWarning && protectedArea && (
        <ProtectedAreaWarning
          area={protectedArea}
          onClose={() => setShowProtectedWarning(false)}
          onSaveAsObservation={handleSaveObservation}
        />
      )}
    </div>
  )
}
