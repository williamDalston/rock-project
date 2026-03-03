import { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db, getCollectionPaths } from '@/services/firebase'
import { APP_CONFIG, isBlockedImageUrl, getSpecimenPathForRock } from '@/constants'
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

    // Subscribe to personal rocks; sanitize and persist-fix blocked imageUrls
    const unsubPersonal = paths.userRocks
      ? onSnapshot(
          collection(db, paths.userRocks),
          (snapshot) => {
            const rocks = snapshot.docs.map((d) => {
              const rock = { id: d.id, ...d.data() } as Rock
              if (isBlockedImageUrl(rock.imageUrl)) {
                const correctPath = getSpecimenPathForRock(rock) || ''
                rock.imageUrl = correctPath
                updateDoc(doc(db, paths.userRocks!, d.id), { imageUrl: correctPath }).catch(() => {})
              }
              return rock
            })
            rocks.sort((a, b) => {
              const aTime = a.createdAt?.seconds || 0
              const bTime = b.createdAt?.seconds || 0
              return bTime - aTime
            })
            setPersonalRocks(rocks)
          }
        )
      : () => {}

    // Subscribe to market rocks; sanitize and persist-fix blocked imageUrls (e.g. old Unsplash)
    const unsubMarket = onSnapshot(
      collection(db, paths.marketRocks),
      (snapshot) => {
        const rocks = snapshot.docs.map((d) => {
          const rock = { id: d.id, ...d.data() } as Rock
          if (isBlockedImageUrl(rock.imageUrl)) {
            const correctPath = getSpecimenPathForRock(rock) || ''
            rock.imageUrl = correctPath
            updateDoc(doc(db, paths.marketRocks, d.id), { imageUrl: correctPath }).catch(() => {})
          }
          return rock
        })
        rocks.sort((a, b) => {
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

    // Store the correct image path from the start (specimen from name/marketTitle if imageUrl empty or blocked)
    let imageUrl = data.imageUrl?.trim() || ''
    if (!imageUrl || isBlockedImageUrl(imageUrl)) {
      const specimenPath = getSpecimenPathForRock(data)
      if (specimenPath) imageUrl = specimenPath
    }
    const rockData = {
      ...data,
      imageUrl,
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

  const deleteRock = async (rockId: string, _rockName: string) => {
    if (!user) throw new Error('User not authenticated')

    const paths = getCollectionPaths(APP_CONFIG.APP_ID, user.uid)
    if (!paths.userRocks) throw new Error('Invalid user path')

    // Get the rock data before deleting so we can match the market listing
    const rockDoc = await getDocs(query(collection(db, paths.userRocks), where('__name__', '==', rockId)))
    const rockData = rockDoc.docs[0]?.data()

    // Delete from personal collection
    await deleteDoc(doc(db, paths.userRocks, rockId))

    // Delete from market - match by ownerId and imageUrl+createdAt for uniqueness
    // This avoids the name-collision bug where two rocks with the same name both get deleted
    if (rockData) {
      const marketRef = collection(db, paths.marketRocks)
      const q = query(
        marketRef,
        where('ownerId', '==', user.uid),
        where('imageUrl', '==', rockData.imageUrl || '')
      )
      const snapshot = await getDocs(q)

      // Only delete the first match (there should be exactly one)
      if (snapshot.docs.length > 0) {
        await deleteDoc(doc(db, paths.marketRocks, snapshot.docs[0].id))
      }
    }
  }

  return { personalRocks, marketRocks, loading, addRock, deleteRock }
}
