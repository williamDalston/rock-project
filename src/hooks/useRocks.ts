import { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db, getCollectionPaths } from '@/services/firebase'
import { APP_CONFIG } from '@/constants'
import type { Rock, RockFormData, User } from '@/types'

interface UseRocksReturn {
  personalRocks: Rock[]
  marketRocks: Rock[]
  loading: boolean
  addRock: (data: RockFormData) => Promise<void>
  deleteRock: (rockId: string, rockName: string) => Promise<void>
}

export function useRocks(user: User | null): UseRocksReturn {
  const [personalRocks, setPersonalRocks] = useState<Rock[]>([])
  const [marketRocks, setMarketRocks] = useState<Rock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const paths = getCollectionPaths(APP_CONFIG.APP_ID, user.uid)

    // Subscribe to personal rocks
    const unsubPersonal = paths.userRocks
      ? onSnapshot(
          collection(db, paths.userRocks),
          (snapshot) => {
            const rocks = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() } as Rock))
              .sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0
                const bTime = b.createdAt?.seconds || 0
                return bTime - aTime
              })
            setPersonalRocks(rocks)
          }
        )
      : () => {}

    // Subscribe to market rocks
    const unsubMarket = onSnapshot(
      collection(db, paths.marketRocks),
      (snapshot) => {
        const rocks = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Rock))
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0
            const bTime = b.createdAt?.seconds || 0
            return bTime - aTime
          })
        setMarketRocks(rocks)
        setLoading(false)
      }
    )

    return () => {
      unsubPersonal()
      unsubMarket()
    }
  }, [user])

  const addRock = async (data: RockFormData) => {
    if (!user) throw new Error('User not authenticated')

    const paths = getCollectionPaths(APP_CONFIG.APP_ID, user.uid)
    if (!paths.userRocks) throw new Error('Invalid user path')

    const rockData = {
      ...data,
      ownerId: user.uid,
      createdAt: serverTimestamp()
    }

    // Save to personal collection
    await addDoc(collection(db, paths.userRocks), rockData)

    // If public, save to market
    if (data.isPublic) {
      await addDoc(collection(db, paths.marketRocks), rockData)
    }
  }

  const deleteRock = async (rockId: string, rockName: string) => {
    if (!user) throw new Error('User not authenticated')

    const paths = getCollectionPaths(APP_CONFIG.APP_ID, user.uid)
    if (!paths.userRocks) throw new Error('Invalid user path')

    // Delete from personal collection
    await deleteDoc(doc(db, paths.userRocks, rockId))

    // Also try to delete from market (find by ownerId and name match)
    // Since market rocks have different IDs, we query by ownerId and name
    const marketRef = collection(db, paths.marketRocks)
    const q = query(
      marketRef,
      where('ownerId', '==', user.uid),
      where('name', '==', rockName)
    )
    const snapshot = await getDocs(q)

    // Delete all matching market listings
    const deletePromises = snapshot.docs.map(docSnap =>
      deleteDoc(doc(db, paths.marketRocks, docSnap.id))
    )
    await Promise.all(deletePromises)
  }

  return { personalRocks, marketRocks, loading, addRock, deleteRock }
}
