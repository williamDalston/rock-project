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
  orderBy,
  writeBatch,
  Timestamp
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
      // Store sender's contact info (revealed when accepted)
      fromUserEmail: user.email || null,
      fromUserName: user.displayName || 'Anonymous Collector',
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

    if (action === 'accept') {
      // Include receiver's contact info when accepting
      await updateDoc(proposalRef, {
        status: 'accepted',
        toUserEmail: user.email || null,
        toUserName: user.displayName || 'Anonymous Collector',
        updatedAt: serverTimestamp()
      })
    } else {
      await updateDoc(proposalRef, {
        status: 'rejected',
        updatedAt: serverTimestamp()
      })
    }
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

    // Find the proposal in local state
    const proposal = [...sentProposals, ...receivedProposals].find(p => p.id === proposalId)
    if (!proposal) throw new Error('Proposal not found')
    if (proposal.status !== 'accepted') throw new Error('Trade must be accepted first')

    const batch = writeBatch(db)

    // Get user paths for both parties
    const senderPaths = getCollectionPaths(APP_CONFIG.APP_ID, proposal.fromUserId)
    const receiverPaths = getCollectionPaths(APP_CONFIG.APP_ID, proposal.toUserId)

    // Prepare rock data with updated ownership and timestamp
    const now = Timestamp.now()

    const offeredRockForReceiver = {
      ...proposal.offeredRock,
      ownerId: proposal.toUserId,
      previousOwnerId: proposal.fromUserId,
      acquiredVia: 'trade',
      acquiredAt: now
    }

    const targetRockForSender = {
      ...proposal.targetRock,
      ownerId: proposal.fromUserId,
      previousOwnerId: proposal.toUserId,
      acquiredVia: 'trade',
      acquiredAt: now
    }

    // Transfer offered rock: sender -> receiver
    if (senderPaths.userRocks) {
      const senderRockRef = doc(db, senderPaths.userRocks, proposal.offeredRockId)
      batch.delete(senderRockRef)
    }
    if (receiverPaths.userRocks) {
      const receiverNewRockRef = doc(db, receiverPaths.userRocks, proposal.offeredRockId)
      batch.set(receiverNewRockRef, offeredRockForReceiver)
    }

    // Transfer target rock: receiver -> sender
    if (receiverPaths.userRocks) {
      const receiverRockRef = doc(db, receiverPaths.userRocks, proposal.targetRockId)
      batch.delete(receiverRockRef)
    }
    if (senderPaths.userRocks) {
      const senderNewRockRef = doc(db, senderPaths.userRocks, proposal.targetRockId)
      batch.set(senderNewRockRef, targetRockForSender)
    }

    // Update market copies with new ownership
    const marketPath = paths.marketRocks
    const offeredMarketRef = doc(db, marketPath, proposal.offeredRockId)
    const targetMarketRef = doc(db, marketPath, proposal.targetRockId)

    // Update market rocks (they may or may not exist)
    batch.set(offeredMarketRef, offeredRockForReceiver, { merge: true })
    batch.set(targetMarketRef, targetRockForSender, { merge: true })

    // Mark trade as completed
    const proposalRef = doc(db, tradesPath, proposalId)
    batch.update(proposalRef, {
      status: 'completed' as TradeStatus,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Execute all operations atomically
    await batch.commit()
  }, [user, tradesPath, paths.marketRocks, sentProposals, receivedProposals])

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
