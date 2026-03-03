import { useState, useEffect } from 'react'
import { Loader, ScanLine, Sparkles, Droplets, MapPin, Navigation, Hexagon, ArrowLeft, Bot } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'
import { ConfidenceMeter } from '@/components/ui/ConfidenceMeter'
import { ProtectedAreaWarning, ProtectedAreaBanner } from '@/components/ui/ProtectedAreaWarning'
import { InlineFunFact } from '@/components/ui/FunFactCard'
import { SEO, SEO_CONFIGS } from '@/components/ui/SEO'
import { useGeolocation } from '@/hooks/useGeolocation'
import type { RockFormData, AIAnalysisResult } from '@/types'

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
  const [imageError, setImageError] = useState(false)
  const {
    coords,
    loading: geoLoading,
    locationName,
    protectedArea,
    requestLocation
  } = useGeolocation()

  // Sync location to form when coords change
  useEffect(() => {
    if (coords && locationName) {
      onFormChange({
        coordinates: coords,
        location: locationName
      })
    }
  }, [coords, locationName, onFormChange])

  // Handle GPS capture - just triggers the request, useEffect handles the update
  const handleCaptureLocation = async () => {
    await requestLocation()
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
      <SEO {...SEO_CONFIGS.scan} />
      {/* Image Preview */}
      <div className="h-[40vh] md:h-[50vh] relative bg-black max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onDiscard}
          className="absolute top-4 left-4 z-20 flex items-center space-x-2 px-3 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors"
          aria-label="Go back to previous screen"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        {formData.imageUrl && !imageError ? (
          <img
            src={formData.imageUrl}
            alt={formData.name ? `Rock specimen: ${formData.name}` : 'Rock specimen being analyzed'}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-500">
            <Hexagon className="w-12 h-12 mb-2" />
            <p className="text-sm">Failed to load image</p>
          </div>
        ) : isAnalyzing ? (
          <div className="w-full h-full flex items-center justify-center" role="status" aria-label="Loading image">
            <Loader className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-500">
            <ScanLine className="w-12 h-12 mb-2" />
            <p className="text-sm">No image selected</p>
            <button
              onClick={onDiscard}
              className="mt-3 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-sm transition-colors"
            >
              Go back
            </button>
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
      <div className="p-6 -mt-6 relative z-10 bg-stone-950 rounded-t-3xl border-t border-stone-800 min-h-[60vh] max-w-2xl mx-auto">
        <div className="w-12 h-1 bg-stone-800 rounded-full mx-auto mb-6" />
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
          Identify Rocks &amp; Minerals from Photo
        </h1>
        <p className="text-stone-500 text-sm mb-5">
          Free rock identifier: take or upload a photo for instant name, rarity, hardness, and geological details. No app download.
        </p>

        <div className="space-y-5">
          {/* Identified by AI badge - visible after analysis */}
          {analysisResult && !isAnalyzing && formData.name && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-800/50 text-emerald-400 text-sm">
              <Bot className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>Identified by AI</span>
            </div>
          )}

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

          {/* Fun Fact - show after analysis */}
          {analysisResult && !isAnalyzing && formData.name && (
            <InlineFunFact rockType={formData.name.toLowerCase()} />
          )}

          {/* Name & Rarity */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-grow">
              <label className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">
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
            <div className="flex flex-col sm:items-end">
              <label className="text-[10px] font-medium text-stone-500 uppercase tracking-wider mb-1">
                Rarity
              </label>
              <input
                type="number"
                max={10}
                min={1}
                value={formData.rarityScore}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value)
                  const val = isNaN(parsed) ? 1 : parsed
                  onFormChange({ rarityScore: Math.max(1, Math.min(10, val)) })
                }}
                className="bg-stone-900 border border-stone-800 text-center text-white w-full sm:w-16 h-12 rounded-lg focus:border-emerald-500 focus:outline-none text-lg"
                aria-label="Rarity score from 1 to 10"
              />
            </div>
          </div>

          {/* GPS Location Capture */}
          <div className="bg-stone-900/50 p-3 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">
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
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 rounded-lg text-xs text-stone-300 transition-colors"
                aria-label={geoLoading ? 'Capturing location...' : coords ? 'Update GPS location' : 'Capture GPS location'}
              >
                {geoLoading ? (
                  <Loader className="w-3 h-3 animate-spin" aria-hidden="true" />
                ) : (
                  <Navigation className="w-3 h-3" aria-hidden="true" />
                )}
                <span>{coords ? 'Update' : 'Capture'}</span>
              </button>
            </div>
          </div>

          {/* Visual Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-800">
              <label className="flex items-center space-x-2 mb-2 text-stone-500">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-wider font-medium">Luster</span>
              </label>
              <input
                value={formData.visuals.luster}
                onChange={(e) =>
                  onFormChange({
                    visuals: { ...formData.visuals, luster: e.target.value }
                  })
                }
                className="bg-transparent text-base font-medium text-stone-200 w-full focus:outline-none"
                placeholder="e.g., Vitreous, Metallic"
                aria-label="Rock luster"
              />
            </div>
            <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-800">
              <label className="flex items-center space-x-2 mb-2 text-stone-500">
                <Droplets className="w-4 h-4" aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-wider font-medium">Texture</span>
              </label>
              <input
                value={formData.visuals.texture}
                onChange={(e) =>
                  onFormChange({
                    visuals: { ...formData.visuals, texture: e.target.value }
                  })
                }
                className="bg-transparent text-base font-medium text-stone-200 w-full focus:outline-none"
                placeholder="e.g., Crystalline, Glassy"
                aria-label="Rock texture"
              />
            </div>
          </div>

          {/* Extended Properties (from AI) */}
          {(formData.hardness || formData.cleavage) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.hardness && (
                <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-800">
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1 font-medium">Hardness</p>
                  <p className="text-base font-medium text-stone-200">{formData.hardness} (Mohs)</p>
                </div>
              )}
              {formData.cleavage && (
                <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-800">
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1 font-medium">Cleavage</p>
                  <p className="text-base font-medium text-stone-200 line-clamp-2">{formData.cleavage}</p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              rows={3}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-stone-300 mt-2 focus:border-emerald-500 focus:outline-none text-base leading-relaxed"
              aria-label="Rock description"
            />
          </div>

          {/* Personal Note/Story */}
          <div>
            <label className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">
              Your Story <span className="text-stone-600">(optional)</span>
            </label>
            <textarea
              value={formData.personalNote || ''}
              onChange={(e) => onFormChange({ personalNote: e.target.value })}
              rows={2}
              maxLength={300}
              placeholder="Tell the story behind this rock... where you found it, what it means to you, or any memories attached"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-stone-300 mt-2 focus:border-amber-500 focus:outline-none text-sm placeholder-stone-600"
              aria-label="Your personal story about this rock"
            />
            <p className="text-[10px] text-stone-600 mt-1">
              {(formData.personalNote?.length || 0)}/300 • Shown to others when they view this rock
            </p>
          </div>

          {/* Self-Collected Toggle */}
          <Toggle
            enabled={formData.isSelfCollected || false}
            onChange={(enabled) => onFormChange({ isSelfCollected: enabled })}
            label="I found this in the field"
          />

          {/* Public Toggle - with explanation */}
          <div className="space-y-2">
            <Toggle
              enabled={formData.isPublic}
              onChange={(enabled) => onFormChange({ isPublic: enabled })}
              label="List on Global Market"
            />
            <p className="text-[10px] text-stone-500 ml-12">
              {formData.isPublic
                ? 'Others can see and propose trades for this specimen'
                : 'This will be private in your vault only'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {/* Primary action - Save to Collection */}
            <button
              onClick={handleSave}
              disabled={!formData.name}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-colors min-h-[52px]"
              aria-label={protectedArea?.isProtected ? 'Review protected area warning and save' : 'Save rock to collection'}
            >
              {protectedArea?.isProtected ? 'Review & Save' : formData.isPublic ? 'Save & List on Market' : 'Save to Vault'}
            </button>

            {/* Secondary actions */}
            <div className="flex space-x-3">
              <button
                onClick={onDiscard}
                className="flex-1 py-3 rounded-xl font-medium text-stone-400 hover:text-stone-300 hover:bg-stone-900 transition-colors border border-stone-800 min-h-[48px]"
                aria-label="Discard and go back"
              >
                Discard
              </button>
              <button
                onClick={onSaveAsObservation}
                disabled={!formData.name}
                className="flex-1 py-3 rounded-xl font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                aria-label="Save as observation only - private and not tradeable"
              >
                Save as Observation
              </button>
            </div>
            <p className="text-[10px] text-stone-500 text-center">
              Observations are private, not on market, and can't be traded
            </p>
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
