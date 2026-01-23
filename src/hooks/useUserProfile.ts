import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { APP_CONFIG } from '@/constants'
import {
  calculateLevel,
  getTitle,
  getXPForAction,
  createDefaultProfile
} from '@/services/gamification'
import type { UserProfile, XPAction, User } from '@/types'

interface UseUserProfileReturn {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  addXP: (action: XPAction) => Promise<void>
  incrementStat: (stat: 'totalSpecimens' | 'totalTrades' | 'totalLikes') => Promise<void>
}

export function useUserProfile(user: User | null): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const profilePath = `artifacts/${APP_CONFIG.APP_ID}/users/${user.uid}/profile`
    const profileRef = doc(db, profilePath, 'data')

    const unsubscribe = onSnapshot(
      profileRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as UserProfile
          setProfile(data)
        } else {
          // Create new profile if doesn't exist
          const newProfile = {
            ...createDefaultProfile(user.uid),
            joinedAt: serverTimestamp()
          }

          try {
            await setDoc(profileRef, newProfile)
            // Profile will be updated via the snapshot listener
          } catch (err) {
            setError('Failed to create profile')
          }
        }
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user])

  const addXP = useCallback(async (action: XPAction) => {
    if (!user || !profile) return

    const xpGain = getXPForAction(action)
    if (xpGain <= 0) return

    const profilePath = `artifacts/${APP_CONFIG.APP_ID}/users/${user.uid}/profile`
    const profileRef = doc(db, profilePath, 'data')

    const newXP = profile.xp + xpGain
    const newLevel = calculateLevel(newXP)
    const newTitle = getTitle(newLevel)

    try {
      await updateDoc(profileRef, {
        xp: increment(xpGain),
        level: newLevel,
        title: newTitle
      })
    } catch (err) {
      setError('Failed to update XP')
    }
  }, [user, profile])

  const incrementStat = useCallback(async (stat: 'totalSpecimens' | 'totalTrades' | 'totalLikes') => {
    if (!user) return

    const profilePath = `artifacts/${APP_CONFIG.APP_ID}/users/${user.uid}/profile`
    const profileRef = doc(db, profilePath, 'data')

    try {
      await updateDoc(profileRef, {
        [stat]: increment(1)
      })
    } catch (err) {
      setError(`Failed to update ${stat}`)
    }
  }, [user])

  return {
    profile,
    loading,
    error,
    addXP,
    incrementStat
  }
}
