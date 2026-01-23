import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { APP_CONFIG, VERIFICATION_CONFIG } from '@/constants'
import type {
  Rock,
  User,
  UserProfile,
  VerificationVote,
  RockVerification,
  VerificationLevel
} from '@/types'

interface UseVerificationReturn {
  rockVerification: RockVerification | null
  userVote: VerificationVote | null
  loading: boolean
  error: string | null

  submitVote: (isAccurate: boolean, comment?: string) => Promise<void>
  canVote: boolean
  isExpert: boolean
}

export function useVerification(
  rock: Rock | null,
  user: User | null,
  profile: UserProfile | null
): UseVerificationReturn {
  const [rockVerification, setRockVerification] = useState<RockVerification | null>(null)
  const [userVote, setUserVote] = useState<VerificationVote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paths = getCollectionPaths(APP_CONFIG.APP_ID, user?.uid)

  const isExpert = useMemo(() => {
    if (!profile) return false
    return profile.level >= VERIFICATION_CONFIG.EXPERT_MIN_LEVEL &&
      profile.totalSpecimens >= VERIFICATION_CONFIG.EXPERT_MIN_SPECIMENS
  }, [profile])

  const canVote = useMemo(() => {
    if (!user || !rock || !profile) return false
    if (rock.ownerId === user.uid) return false  // Can't vote on own rock
    if (userVote) return false  // Already voted
    return true
  }, [user, rock, profile, userVote])

  useEffect(() => {
    if (!rock) {
      setRockVerification(null)
      setUserVote(null)
      setLoading(false)
      return
    }

    setLoading(true)

    // Listen to rock's verification status
    const verificationRef = doc(db, paths.verifications!, rock.id)
    const unsubVerification = onSnapshot(verificationRef, (snapshot) => {
      if (snapshot.exists()) {
        setRockVerification(snapshot.data() as RockVerification)
      } else {
        setRockVerification(null)
      }
    }, (err) => {
      console.error('Error fetching verification:', err)
      setError('Failed to load verification status')
    })

    // Check if user has voted
    if (user) {
      const voteQuery = query(
        collection(db, paths.verificationVotes!),
        where('rockId', '==', rock.id),
        where('voterId', '==', user.uid)
      )

      const unsubVote = onSnapshot(voteQuery, (snapshot) => {
        if (!snapshot.empty) {
          setUserVote({
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
          } as VerificationVote)
        } else {
          setUserVote(null)
        }
        setLoading(false)
      }, (err) => {
        console.error('Error fetching user vote:', err)
        setLoading(false)
      })

      return () => {
        unsubVerification()
        unsubVote()
      }
    }

    setLoading(false)
    return () => unsubVerification()
  }, [rock, user, paths.verifications, paths.verificationVotes])

  const submitVote = useCallback(async (isAccurate: boolean, comment?: string) => {
    if (!user || !rock || !profile || !canVote) {
      throw new Error('Cannot submit vote')
    }

    const voteWeight = VERIFICATION_CONFIG.BASE_VOTE_WEIGHT +
      (profile.level * VERIFICATION_CONFIG.LEVEL_WEIGHT_MULTIPLIER)

    const voteData = {
      rockId: rock.id,
      voterId: user.uid,
      voterLevel: profile.level,
      isAccurate,
      comment: comment || null,
      createdAt: serverTimestamp()
    }

    // Add the vote
    await addDoc(collection(db, paths.verificationVotes!), voteData)

    // Update rock verification aggregate
    await updateRockVerificationAggregate(
      rock.id,
      isAccurate,
      voteWeight,
      isExpert,
      user.uid,
      paths.verifications!
    )
  }, [user, rock, profile, canVote, isExpert, paths.verificationVotes, paths.verifications])

  return {
    rockVerification,
    userVote,
    loading,
    error,
    submitVote,
    canVote,
    isExpert
  }
}

async function updateRockVerificationAggregate(
  rockId: string,
  isAccurate: boolean,
  weight: number,
  isExpertVote: boolean,
  voterId: string,
  verificationsPath: string
) {
  const verificationRef = doc(db, verificationsPath, rockId)
  const snapshot = await getDoc(verificationRef)

  const voteValue = isAccurate ? weight : -weight

  if (snapshot.exists()) {
    const current = snapshot.data() as RockVerification
    const newTotalVotes = current.totalVotes + 1
    const newWeightedScore = current.weightedScore + voteValue

    let newLevel: VerificationLevel = 'unverified'

    if (isExpertVote && isAccurate) {
      newLevel = 'expert_verified'
    } else if (
      newWeightedScore >= VERIFICATION_CONFIG.COMMUNITY_VERIFIED_THRESHOLD &&
      newTotalVotes >= VERIFICATION_CONFIG.COMMUNITY_VERIFIED_MIN_VOTES
    ) {
      newLevel = 'community_verified'
    }

    await updateDoc(verificationRef, {
      totalVotes: newTotalVotes,
      weightedScore: newWeightedScore,
      verificationLevel: newLevel,
      lastUpdated: serverTimestamp(),
      ...(isExpertVote && isAccurate ? {
        expertVerifiedBy: voterId,
        expertVerifiedAt: serverTimestamp()
      } : {})
    })
  } else {
    // Create new verification record
    const newData: Omit<RockVerification, 'lastUpdated' | 'expertVerifiedAt'> & { lastUpdated: any; expertVerifiedAt?: any } = {
      rockId,
      totalVotes: 1,
      weightedScore: voteValue,
      verificationLevel: isExpertVote && isAccurate ? 'expert_verified' : 'unverified',
      lastUpdated: serverTimestamp(),
      ...(isExpertVote && isAccurate ? {
        expertVerifiedBy: voterId,
        expertVerifiedAt: serverTimestamp()
      } : {})
    }

    await setDoc(verificationRef, newData)
  }
}
