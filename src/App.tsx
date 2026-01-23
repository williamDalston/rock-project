import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRocks } from '@/hooks/useRocks'
import { useUserProfile } from '@/hooks/useUserProfile'
import { identifyRockWithAI } from '@/services/gemini'
import { compressImage } from '@/utils/imageCompression'
import { DEFAULT_FORM_DATA, XP_REWARDS } from '@/constants'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { NavBar } from '@/components/layout/NavBar'
import { ToastContainer, useToast } from '@/components/ui/Toast'
import { WelcomeModal } from '@/components/ui/WelcomeModal'
import { AuthModal } from '@/components/modals/AuthModal'
import { MarketView } from '@/views/MarketView'
import { ScanView } from '@/views/ScanView'
import { CollectionView } from '@/views/CollectionView'
import type { ViewType, RockFormData, AIAnalysisResult } from '@/types'

export default function App() {
  const {
    user,
    loading: authLoading,
    error: authError,
    isAnonymous,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
    upgradeAnonymousAccount,
    clearError
  } = useAuth()
  const { personalRocks, marketRocks, loading: rocksLoading, addRock } = useRocks(user)
  const { profile, addXP, incrementStat } = useUserProfile(user)
  const toast = useToast()

  const [view, setView] = useState<ViewType>('market')
  const [collectionTab, setCollectionTab] = useState<'collection' | 'trades' | 'wishlists'>('collection')
  const [formData, setFormData] = useState<RockFormData>(DEFAULT_FORM_DATA)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Check if first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('lithos_welcomed')
    if (!hasSeenWelcome) {
      setShowWelcome(true)
    }
  }, [])

  const navigateToTrades = () => {
    setCollectionTab('trades')
    setView('collection')
  }

  const handleWelcomeComplete = () => {
    localStorage.setItem('lithos_welcomed', 'true')
    setShowWelcome(false)
  }

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
      toast.error('Analysis failed', 'Please try again with a clearer image.')
      setView('market')
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

      // Calculate total XP earned
      let xpEarned = XP_REWARDS.SPECIMEN_ADDED
      if (formData.isSelfCollected) xpEarned += XP_REWARDS.SELF_COLLECTED
      if (personalRocks.length === 0) xpEarned += XP_REWARDS.FIRST_SPECIMEN

      setView('collection')
      setFormData(DEFAULT_FORM_DATA)
      setAnalysisResult(null)

      toast.success('Rock saved!', `+${xpEarned} XP earned`)
    } catch (err) {
      console.error('Failed to save:', err)
      toast.error('Failed to save', 'Please check your connection and try again.')
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

      toast.success('Observation saved!', `+${XP_REWARDS.SPECIMEN_ADDED} XP earned`)
    } catch (err) {
      console.error('Failed to save observation:', err)
      toast.error('Failed to save', 'Please check your connection and try again.')
    }
  }

  const handleDiscard = () => {
    setView('market')
    setFormData(DEFAULT_FORM_DATA)
    setAnalysisResult(null)
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out', 'You are now browsing as a guest')
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen-safe bg-stone-950 text-stone-200 pb-24 font-sans">
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismissToast} />

      {/* First-time user welcome */}
      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignInWithGoogle={signInWithGoogle}
        onSignInWithEmail={signInWithEmail}
        onSignUpWithEmail={signUpWithEmail}
        onResetPassword={resetPassword}
        error={authError}
        clearError={clearError}
        loading={authLoading}
        isAnonymous={isAnonymous}
        onUpgradeAccount={upgradeAnonymousAccount}
      />

      {view === 'market' && (
        <MarketView
          marketRocks={marketRocks}
          personalRocks={personalRocks}
          user={user}
          profile={profile}
          onNavigateToTrades={navigateToTrades}
          onOpenAuth={() => setShowAuthModal(true)}
          isAnonymous={isAnonymous}
          onSignOut={handleSignOut}
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
          user={user}
          marketRocks={marketRocks}
          initialTab={collectionTab}
          onTabChange={setCollectionTab}
          onOpenAuth={() => setShowAuthModal(true)}
          isAnonymous={isAnonymous}
          onSignOut={handleSignOut}
        />
      )}

      {view !== 'scan' && (
        <NavBar currentView={view} onViewChange={setView} onScan={handleScan} />
      )}
    </div>
  )
}
