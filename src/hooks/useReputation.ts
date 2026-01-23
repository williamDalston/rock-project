import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db, getCollectionPaths } from '@/services/firebase'
import { APP_CONFIG, REPUTATION_CONFIG } from '@/constants'
import {
  calculateTrustLevel,
  createDefaultReputation,
  updateReputationWithReview
} from '@/services/reputation'
import type { Review, UserReputation, User, TradeProposal } from '@/types'

interface UseReputationReturn {
  reputation: UserReputation | null
  reviews: Review[]
  loading: boolean
  error: string | null

  submitReview: (
    trade: TradeProposal,
    rating: 1 | 2 | 3 | 4 | 5,
    comment?: string,
    photoUrl?: string
  ) => Promise<void>
  canReviewTrade: (trade: TradeProposal) => boolean
  getUserReputation: (userId: string) => Promise<UserReputation | null>
  hasReviewedTrade: (tradeId: string) => boolean
}

export function useReputation(user: User | null): UseReputationReturn {
  const [reputation, setReputation] = useState<UserReputation | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewedTradeIds, setReviewedTradeIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paths = getCollectionPaths(APP_CONFIG.APP_ID, user?.uid)

  useEffect(() => {
    if (!user) {
      setReputation(null)
      setReviews([])
      setReviewedTradeIds(new Set())
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // User's reputation
    const repRef = doc(db, paths.userReputation!)
    const unsubRep = onSnapshot(repRef, (snapshot) => {
      if (snapshot.exists()) {
        setReputation(snapshot.data() as UserReputation)
      } else {
        // Create default reputation if none exists
        setReputation(createDefaultReputation(user.uid))
      }
    }, (err) => {
      console.error('Error fetching reputation:', err)
      setError('Failed to load reputation')
    })

    // Reviews received by user
    const reviewsReceivedQuery = query(
      collection(db, `artifacts/${APP_CONFIG.APP_ID}/reviews`),
      where('revieweeId', '==', user.uid)
    )
    const unsubReviewsReceived = onSnapshot(reviewsReceivedQuery, (snapshot) => {
      const reviewList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Review))
      setReviews(reviewList)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching reviews:', err)
      setLoading(false)
    })

    // Track trades the user has already reviewed
    const reviewsGivenQuery = query(
      collection(db, `artifacts/${APP_CONFIG.APP_ID}/reviews`),
      where('reviewerId', '==', user.uid)
    )
    const unsubReviewsGiven = onSnapshot(reviewsGivenQuery, (snapshot) => {
      const tradeIds = new Set(snapshot.docs.map(d => d.data().tradeId as string))
      setReviewedTradeIds(tradeIds)
    })

    return () => {
      unsubRep()
      unsubReviewsReceived()
      unsubReviewsGiven()
    }
  }, [user, paths.userReputation])

  const canReviewTrade = useCallback((trade: TradeProposal): boolean => {
    if (!user || trade.status !== 'completed') return false
    if (!trade.completedAt) return false

    // Check if already reviewed
    if (reviewedTradeIds.has(trade.id)) return false

    // Check if within review window
    const completedTime = trade.completedAt.seconds * 1000
    const now = Date.now()
    const daysSinceCompletion = (now - completedTime) / (1000 * 60 * 60 * 24)

    return daysSinceCompletion <= REPUTATION_CONFIG.REVIEW_WINDOW_DAYS
  }, [user, reviewedTradeIds])

  const hasReviewedTrade = useCallback((tradeId: string): boolean => {
    return reviewedTradeIds.has(tradeId)
  }, [reviewedTradeIds])

  const submitReview = useCallback(async (
    trade: TradeProposal,
    rating: 1 | 2 | 3 | 4 | 5,
    comment?: string,
    photoUrl?: string
  ) => {
    if (!user) throw new Error('User not authenticated')
    if (!canReviewTrade(trade)) throw new Error('Cannot review this trade')

    // Determine who we're reviewing
    const revieweeId = trade.fromUserId === user.uid ? trade.toUserId : trade.fromUserId

    const reviewData = {
      tradeId: trade.id,
      reviewerId: user.uid,
      revieweeId,
      rating,
      comment: comment || null,
      photoUrl: photoUrl || null,
      tradedRockName: trade.targetRock.name,
      createdAt: serverTimestamp()
    }

    await addDoc(collection(db, `artifacts/${APP_CONFIG.APP_ID}/reviews`), reviewData)

    // Update reviewee's reputation
    await updateUserReputationWithReview(revieweeId, rating)
  }, [user, canReviewTrade])

  const getUserReputation = useCallback(async (userId: string): Promise<UserReputation | null> => {
    const userPaths = getCollectionPaths(APP_CONFIG.APP_ID, userId)
    const repRef = doc(db, userPaths.userReputation!)
    const snapshot = await getDoc(repRef)
    return snapshot.exists() ? snapshot.data() as UserReputation : null
  }, [])

  return {
    reputation,
    reviews,
    loading,
    error,
    submitReview,
    canReviewTrade,
    getUserReputation,
    hasReviewedTrade
  }
}

async function updateUserReputationWithReview(userId: string, newRating: number) {
  const userPaths = getCollectionPaths(APP_CONFIG.APP_ID, userId)
  const repRef = doc(db, userPaths.userReputation!)

  const snapshot = await getDoc(repRef)

  if (snapshot.exists()) {
    const current = snapshot.data() as UserReputation
    const updates = updateReputationWithReview(current, newRating)

    await updateDoc(repRef, {
      ...updates,
      lastUpdated: serverTimestamp()
    })
  } else {
    // Create new reputation record with this review
    const newRep = createDefaultReputation(userId)
    newRep.averageRating = newRating
    newRep.totalReviews = 1

    await setDoc(repRef, {
      ...newRep,
      lastUpdated: serverTimestamp()
    })
  }
}
