import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db, getCollectionPaths } from '@/services/firebase'
import { APP_CONFIG, TRADING_CONFIG } from '@/constants'
import type { TradeProposal, TradeStatus, Rock, User } from '@/types'

interface UseTradeProposalsReturn {
  sentProposals: TradeProposal[]
  receivedProposals: TradeProposal[]
  loading: boolean
  error: string | null

  // Actions
  createProposal: (targetRock: Rock, offeredRock: Rock, message?: string) => Promise<string>
  respondToProposal: (proposalId: string, action: 'accept' | 'reject') => Promise<void>
  counterProposal: (proposalId: string, counterRock: Rock, message?: string) => Promise<void>
  cancelProposal: (proposalId: string) => Promise<void>
  completeProposal: (proposalId: string) => Promise<void>

  // Counts
  pendingReceivedCount: number
  pendingSentCount: number
}

export function useTradeProposals(user: User | null): UseTradeProposalsReturn {
  const [sentProposals, setSentProposals] = useState<TradeProposal[]>([])
  const [receivedProposals, setReceivedProposals] = useState<TradeProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paths = getCollectionPaths(APP_CONFIG.APP_ID, user?.uid)
  const tradesPath = paths.trades

  useEffect(() => {
    if (!user) {
      setSentProposals([])
      setReceivedProposals([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Query for sent proposals
    const sentQuery = query(
      collection(db, tradesPath),
      where('fromUserId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    // Query for received proposals
    const receivedQuery = query(
      collection(db, tradesPath),
      where('toUserId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubSent = onSnapshot(sentQuery, (snapshot) => {
      const proposals = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as TradeProposal))
      setSentProposals(proposals)
    }, (err) => {
      console.error('Error fetching sent proposals:', err)
      setError('Failed to load sent proposals')
    })

    const unsubReceived = onSnapshot(receivedQuery, (snapshot) => {
      const proposals = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as TradeProposal))
      setReceivedProposals(proposals)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching received proposals:', err)
      setError('Failed to load received proposals')
      setLoading(false)
    })

    return () => {
      unsubSent()
      unsubReceived()
    }
  }, [user, tradesPath])

  const createProposal = useCallback(async (
    targetRock: Rock,
    offeredRock: Rock,
    message?: string
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated')

    // Check limits
    const activeCount = sentProposals.filter(p =>
      p.status === 'proposed' || p.status === 'countered'
    ).length

    if (activeCount >= TRADING_CONFIG.MAX_ACTIVE_PROPOSALS_SENT) {
      throw new Error('Maximum active proposals reached')
    }

    const proposalData = {
      targetRockId: targetRock.id,
      targetRock,
      offeredRockId: offeredRock.id,
      offeredRock,
      fromUserId: user.uid,
      toUserId: targetRock.ownerId,
      status: 'proposed' as TradeStatus,
      message: message || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, tradesPath), proposalData)
    return docRef.id
  }, [user, sentProposals, tradesPath])

  const respondToProposal = useCallback(async (
    proposalId: string,
    action: 'accept' | 'reject'
  ) => {
    if (!user) throw new Error('User not authenticated')

    const proposalRef = doc(db, tradesPath, proposalId)
    await updateDoc(proposalRef, {
      status: action === 'accept' ? 'accepted' : 'rejected',
      updatedAt: serverTimestamp()
    })
  }, [user, tradesPath])

  const counterProposal = useCallback(async (
    proposalId: string,
    counterRock: Rock,
    message?: string
  ) => {
    if (!user) throw new Error('User not authenticated')

    const proposalRef = doc(db, tradesPath, proposalId)
    await updateDoc(proposalRef, {
      status: 'countered' as TradeStatus,
      counterOfferedRockId: counterRock.id,
      counterOfferedRock: counterRock,
      counterMessage: message || null,
      updatedAt: serverTimestamp()
    })
  }, [user, tradesPath])

  const cancelProposal = useCallback(async (proposalId: string) => {
    if (!user) throw new Error('User not authenticated')

    const proposalRef = doc(db, tradesPath, proposalId)
    await updateDoc(proposalRef, {
      status: 'cancelled' as TradeStatus,
      updatedAt: serverTimestamp()
    })
  }, [user, tradesPath])

  const completeProposal = useCallback(async (proposalId: string) => {
    if (!user) throw new Error('User not authenticated')

    const proposalRef = doc(db, tradesPath, proposalId)
    await updateDoc(proposalRef, {
      status: 'completed' as TradeStatus,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Note: Rock ownership transfer should be handled by a Cloud Function
    // for atomicity and security
  }, [user, tradesPath])

  // Calculate pending counts
  const pendingReceivedCount = receivedProposals.filter(
    p => p.status === 'proposed' || p.status === 'countered'
  ).length

  const pendingSentCount = sentProposals.filter(
    p => p.status === 'proposed' || p.status === 'countered'
  ).length

  return {
    sentProposals,
    receivedProposals,
    loading,
    error,
    createProposal,
    respondToProposal,
    counterProposal,
    cancelProposal,
    completeProposal,
    pendingReceivedCount,
    pendingSentCount
  }
}
