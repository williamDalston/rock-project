import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRocks } from '@/hooks/useRocks'
import { useUserProfile } from '@/hooks/useUserProfile'
import { identifyRockWithAI } from '@/services/gemini'
import { compressImage } from '@/utils/imageCompression'
import { DEFAULT_FORM_DATA, XP_REWARDS } from '@/constants'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { NavBar } from '@/components/layout/NavBar'
import { MarketView } from '@/views/MarketView'
import { ScanView } from '@/views/ScanView'
import { CollectionView } from '@/views/CollectionView'
import type { ViewType, RockFormData, AIAnalysisResult } from '@/types'

export default function App() {
  const { user, loading: authLoading } = useAuth()
  const { personalRocks, marketRocks, loading: rocksLoading, addRock } = useRocks(user)
  const { profile, addXP, incrementStat } = useUserProfile(user)

  const [view, setView] = useState<ViewType>('market')
  const [formData, setFormData] = useState<RockFormData>(DEFAULT_FORM_DATA)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const loading = authLoading || rocksLoading

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    setView('scan')
    setAnalysisResult(null)

    try {
      const compressed = await compressImage(file)
      setFormData((prev) => ({ ...prev, imageUrl: compressed }))

      // Pass coordinates if available for location-aware identification
      const analysis = await identifyRockWithAI(compressed, formData.coordinates)
      setAnalysisResult(analysis)

      setFormData((prev) => ({
        ...prev,
        name: analysis.name,
        scientificName: analysis.scientificName,
        marketTitle: analysis.marketTitle || analysis.name,
        type: analysis.type,
        description: analysis.description,
        rarityScore: analysis.rarityScore || 3,
        visuals: analysis.visuals || { luster: 'Unknown', texture: 'Unknown' },
        hardness: analysis.hardness,
        cleavage: analysis.cleavage,
        fracture: analysis.fracture
      }))
    } catch (err) {
      console.error('Analysis failed:', err)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFormChange = (updates: Partial<RockFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleSave = async () => {
    if (!formData.name) return

    try {
      await addRock(formData)

      // Award XP for adding specimen
      await addXP('SPECIMEN_ADDED')
      await incrementStat('totalSpecimens')

      // Bonus XP for self-collected
      if (formData.isSelfCollected) {
        await addXP('SELF_COLLECTED')
      }

      // First specimen bonus
      if (personalRocks.length === 0) {
        await addXP('FIRST_SPECIMEN')
      }

      setView('collection')
      setFormData(DEFAULT_FORM_DATA)
      setAnalysisResult(null)
    } catch (err) {
      console.error('Failed to save:', err)
      alert('Failed to save rock. Please try again.')
    }
  }

  const handleSaveAsObservation = async () => {
    if (!formData.name) return

    try {
      await addRock({
        ...formData,
        isObservationOnly: true,
        isPublic: false // Don't list observations on market
      })

      await addXP('SPECIMEN_ADDED')
      await incrementStat('totalSpecimens')

      setView('collection')
      setFormData(DEFAULT_FORM_DATA)
      setAnalysisResult(null)
    } catch (err) {
      console.error('Failed to save observation:', err)
      alert('Failed to save. Please try again.')
    }
  }

  const handleDiscard = () => {
    setView('market')
    setFormData(DEFAULT_FORM_DATA)
    setAnalysisResult(null)
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 pb-24 font-sans">
      {view === 'market' && (
        <MarketView
          marketRocks={marketRocks}
          personalRocks={personalRocks}
          user={user}
          profile={profile}
        />
      )}

      {view === 'scan' && (
        <ScanView
          formData={formData}
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
          onFormChange={handleFormChange}
          onSave={handleSave}
          onSaveAsObservation={handleSaveAsObservation}
          onDiscard={handleDiscard}
        />
      )}

      {view === 'collection' && (
        <CollectionView
          personalRocks={personalRocks}
          profile={profile}
        />
      )}

      {view !== 'scan' && (
        <NavBar currentView={view} onViewChange={setView} onScan={handleScan} />
      )}
    </div>
  )
}
