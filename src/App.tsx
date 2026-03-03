import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRocks } from '@/hooks/useRocks'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useTradeProposals } from '@/hooks/useTradeProposals'
import { useNotifications } from '@/hooks/useNotifications'
import { identifyRockWithAI, validateImage } from '@/services/gemini'
import { compressImage } from '@/utils/imageCompression'
import { DEFAULT_FORM_DATA, XP_REWARDS } from '@/constants'
import { demoMarketRocks, demoCollectionRocks, isDemoId } from '@/data/demoData'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { NavBar } from '@/components/layout/NavBar'
import { ToastContainer, useToast } from '@/components/ui/Toast'
import { WelcomeModal } from '@/components/ui/WelcomeModal'
import { AuthModal } from '@/components/modals/AuthModal'
import { NotificationPrompt } from '@/components/ui/NotificationPrompt'
import { LevelUpCelebration, useLevelUpCelebration } from '@/components/ui/LevelUpCelebration'
import { TradeCelebration } from '@/components/ui/TradeCelebration'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import type { ViewType, RockFormData, AIAnalysisResult, TradeProposal } from '@/types'

// Lazy load views for code splitting
const MarketView = lazy(() => import('@/views/MarketView').then(m => ({ default: m.MarketView })))
const ScanView = lazy(() => import('@/views/ScanView').then(m => ({ default: m.ScanView })))
const CollectionView = lazy(() => import('@/views/CollectionView').then(m => ({ default: m.CollectionView })))

// Skeleton loading fallback for lazy components
function ViewLoader() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 space-y-4">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-24 bg-stone-800 rounded skeleton-shimmer" />
          <div className="h-3 w-40 bg-stone-800 rounded skeleton-shimmer" />
        </div>
        <div className="flex gap-2">
          <div className="w-9 h-9 bg-stone-800 rounded-lg skeleton-shimmer" />
          <div className="w-9 h-9 bg-stone-800 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      {/* Filter skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-8 w-20 bg-stone-800 rounded-full skeleton-shimmer" />
        ))}
      </div>
      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800">
            <div className="aspect-square bg-stone-800 skeleton-shimmer" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-stone-800 rounded skeleton-shimmer" />
              <div className="h-3 w-full bg-stone-800 rounded skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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
  const { personalRocks, marketRocks, loading: rocksLoading, addRock, deleteRock } = useRocks(user)
  const { profile, addXP, incrementStat } = useUserProfile(user)
  const { receivedProposals, sentProposals } = useTradeProposals(user)
  const toast = useToast()
  const isOnline = useOnlineStatus()

  // Seed demo data when real data is empty so the app feels populated
  const isMarketDemo = marketRocks.length === 0
  const isCollectionDemo = personalRocks.length === 0
  const effectiveMarketRocks = isMarketDemo ? demoMarketRocks : marketRocks
  const effectivePersonalRocks = isCollectionDemo
    ? demoCollectionRocks.map(r => ({ ...r, ownerId: user?.uid || 'demo_self' }))
    : personalRocks

  // URL-based routing: read initial view from pathname for SEO crawlability
  const getViewFromPath = (): ViewType => {
    const path = window.location.pathname.replace(/^\//, '')
    if (path === 'collection') return 'collection'
    if (path === 'scan') return 'scan'
    return 'market'
  }

  const [view, setViewState] = useState<ViewType>(getViewFromPath)
  const [collectionTab, setCollectionTab] = useState<'collection' | 'trades' | 'wishlists'>('collection')

  // Sync URL with view state and scroll to top
  const setView = useCallback((newView: ViewType) => {
    setViewState(newView)
    window.scrollTo(0, 0)
    const path = newView === 'market' ? '/' : `/${newView}`
    if (window.location.pathname !== path) {
      window.history.pushState({ view: newView }, '', path)
    }
  }, [])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setViewState(getViewFromPath())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  const [formData, setFormData] = useState<RockFormData>(DEFAULT_FORM_DATA)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [tradeCelebration, setTradeCelebration] = useState<TradeProposal | null>(null)
  const scanInputRef = useRef<HTMLInputElement | null>(null)

  // Level up celebration
  const { celebration, celebrate, closeCelebration } = useLevelUpCelebration()
  const prevLevelRef = useRef<number | null>(null)

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

  // Notification system
  const { notifyNewTrade, notifyTradeResponse, notifyTradeCompleted } = useNotifications(navigateToTrades)

  // Track previous proposal counts to detect changes
  const prevReceivedCount = useRef(0)
  const prevSentStatuses = useRef<Map<string, string>>(new Map())

  // Watch for new received trades
  useEffect(() => {
    if (receivedProposals.length > prevReceivedCount.current) {
      // New trade proposal received
      const newProposals = receivedProposals.slice(0, receivedProposals.length - prevReceivedCount.current)
      newProposals.forEach(proposal => {
        if (proposal.status === 'proposed') {
          notifyNewTrade(proposal)
          toast.success('New trade proposal!', `Someone wants your "${proposal.targetRock.name}"`)
        }
      })
    }
    prevReceivedCount.current = receivedProposals.length
  }, [receivedProposals, notifyNewTrade, toast])

  // Watch for responses to sent trades
  useEffect(() => {
    sentProposals.forEach(proposal => {
      const prevStatus = prevSentStatuses.current.get(proposal.id)
      if (prevStatus && prevStatus !== proposal.status) {
        if (proposal.status === 'accepted') {
          notifyTradeResponse(proposal)
          toast.success('Trade accepted!', `Your trade for "${proposal.targetRock.name}" was accepted!`)
        } else if (proposal.status === 'rejected') {
          notifyTradeResponse(proposal)
          toast.error('Trade declined', `Your trade for "${proposal.targetRock.name}" was declined`)
        } else if (proposal.status === 'completed') {
          notifyTradeCompleted(proposal)
          // Show trade celebration animation
          setTradeCelebration(proposal)
        }
      }
      prevSentStatuses.current.set(proposal.id, proposal.status)
    })
  }, [sentProposals, notifyTradeResponse, notifyTradeCompleted, toast])

  // Watch for level ups
  useEffect(() => {
    if (!profile) return

    // On first load, just store the level
    if (prevLevelRef.current === null) {
      prevLevelRef.current = profile.level
      return
    }

    // Check if level increased
    if (profile.level > prevLevelRef.current) {
      celebrate(profile.level, profile.title)
    }

    prevLevelRef.current = profile.level
  }, [profile, celebrate])

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

      // Validate image quality and content first
      const validation = await validateImage(compressed)

      // Only block obvious non-rocks - be permissive for good UX
      if (!validation.isRock) {
        toast.error('Not a rock', validation.reason || 'Please upload a photo of a rock, mineral, or fossil.')
        setView('market')
        setFormData(DEFAULT_FORM_DATA)
        setIsAnalyzing(false)
        return
      }

      // Note: We don't block poor quality images - let the AI try to identify them
      // This gives users a better experience

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

  const handleFormChange = useCallback((updates: Partial<RockFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

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

  const handleDeleteRock = async (rockId: string, rockName: string) => {
    if (isDemoId(rockId)) {
      toast.warning('Demo specimen', 'Scan your own rocks to build a real collection!')
      return
    }
    try {
      await deleteRock(rockId, rockName)
      toast.success('Deleted', `"${rockName}" has been removed from your collection`)
    } catch (err) {
      console.error('Failed to delete:', err)
      toast.error('Delete failed', 'Please try again')
    }
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

      {/* Offline banner */}
      {!isOnline && (
        <div className="sticky top-0 z-[100] bg-amber-600 text-white text-center py-2 text-sm font-medium">
          You're offline — some features may not work
        </div>
      )}

      <main role="main">
      <ErrorBoundary>
      <Suspense fallback={<ViewLoader />}>
        {view === 'market' && (
          <MarketView
            marketRocks={effectiveMarketRocks}
            personalRocks={effectivePersonalRocks}
            user={user}
            profile={profile}
            onNavigateToTrades={navigateToTrades}
            onOpenAuth={() => setShowAuthModal(true)}
            isAnonymous={isAnonymous}
            onSignOut={handleSignOut}
            onRequestScan={() => scanInputRef.current?.click()}
            onShowError={(title, desc) => toast.error(title, desc)}
            isDemoData={isMarketDemo}
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
            personalRocks={effectivePersonalRocks}
            profile={profile}
            user={user}
            marketRocks={effectiveMarketRocks}
            initialTab={collectionTab}
            onTabChange={setCollectionTab}
            onOpenAuth={() => setShowAuthModal(true)}
            isAnonymous={isAnonymous}
            onSignOut={handleSignOut}
            onDeleteRock={handleDeleteRock}
            onShowError={(title, desc) => toast.error(title, desc)}
            isDemoData={isCollectionDemo}
          />
        )}
      </Suspense>
      </ErrorBoundary>
      </main>

      {view !== 'scan' && (
        <NavBar
          currentView={view}
          onViewChange={setView}
          onScan={handleScan}
          scanInputRef={scanInputRef}
        />
      )}

      {/* Notification permission prompt */}
      <NotificationPrompt onNavigateToTrades={navigateToTrades} />

      {/* Level up celebration */}
      {celebration && (
        <LevelUpCelebration
          level={celebration.level}
          title={celebration.title}
          onComplete={closeCelebration}
        />
      )}

      {/* Trade completion celebration */}
      {tradeCelebration && (
        <TradeCelebration
          yourRock={{
            name: tradeCelebration.offeredRock.name,
            imageUrl: tradeCelebration.offeredRock.imageUrl
          }}
          theirRock={{
            name: tradeCelebration.targetRock.name,
            imageUrl: tradeCelebration.targetRock.imageUrl
          }}
          onComplete={() => setTradeCelebration(null)}
        />
      )}
    </div>
  )
}
