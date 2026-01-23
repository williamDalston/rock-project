import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'
import { db, getCollectionPaths } from '@/services/firebase'
import { APP_CONFIG, WISHLIST_CONFIG } from '@/constants'
import { findWishlistMatches, countPotentialMatches } from '@/services/wishlist'
import type { WishlistItem, WishlistMatch, Rock, User, RockType, LusterType, CrystalHabit } from '@/types'

interface UseWishlistsReturn {
  wishlists: WishlistItem[]
  matches: WishlistMatch[]
  loading: boolean
  error: string | null

  addWishlistItem: (item: WishlistItemInput) => Promise<string>
  updateWishlistItem: (itemId: string, updates: Partial<WishlistItemInput>) => Promise<void>
  removeWishlistItem: (itemId: string) => Promise<void>
  getMatchCountForWishlist: (wishlistId: string) => number
}

interface WishlistItemInput {
  rockType?: RockType
  name?: string
  minRarity?: number
  maxRarity?: number
  lusters?: LusterType[]
  habits?: CrystalHabit[]
  isPublic: boolean
}

export function useWishlists(user: User | null, marketRocks: Rock[]): UseWishlistsReturn {
  const [wishlists, setWishlists] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paths = getCollectionPaths(APP_CONFIG.APP_ID, user?.uid)

  useEffect(() => {
    if (!user || !paths.userWishlists) {
      setWishlists([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // User's wishlists
    const unsubUser = onSnapshot(
      collection(db, paths.userWishlists),
      (snapshot) => {
        const items = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        } as WishlistItem))
        setWishlists(items)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching wishlists:', err)
        setError('Failed to load wishlists')
        setLoading(false)
      }
    )

    return () => unsubUser()
  }, [user, paths.userWishlists])

  // Find matches against current market rocks
  const matches = useMemo(() => {
    if (!wishlists.length || !marketRocks.length) return []
    return findWishlistMatches(wishlists, marketRocks)
  }, [wishlists, marketRocks])

  // Get match count per wishlist
  const matchCountByWishlist = useMemo(() => {
    const counts = new Map<string, number>()
    for (const match of matches) {
      const current = counts.get(match.wishlistItemId) || 0
      counts.set(match.wishlistItemId, current + 1)
    }
    return counts
  }, [matches])

  const addWishlistItem = useCallback(async (item: WishlistItemInput): Promise<string> => {
    if (!user || !paths.userWishlists) {
      throw new Error('User not authenticated')
    }

    if (wishlists.length >= WISHLIST_CONFIG.MAX_WISHLIST_ITEMS) {
      throw new Error('Maximum wishlist items reached')
    }

    const wishlistData = {
      ...item,
      userId: user.uid,
      createdAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, paths.userWishlists), wishlistData)
    return docRef.id
  }, [user, wishlists, paths.userWishlists])

  const updateWishlistItem = useCallback(async (
    itemId: string,
    updates: Partial<WishlistItemInput>
  ) => {
    if (!user || !paths.userWishlists) {
      throw new Error('User not authenticated')
    }

    const itemRef = doc(db, paths.userWishlists, itemId)
    await updateDoc(itemRef, updates)
  }, [user, paths.userWishlists])

  const removeWishlistItem = useCallback(async (itemId: string) => {
    if (!user || !paths.userWishlists) {
      throw new Error('User not authenticated')
    }

    await deleteDoc(doc(db, paths.userWishlists, itemId))
  }, [user, paths.userWishlists])

  const getMatchCountForWishlist = useCallback((wishlistId: string): number => {
    return matchCountByWishlist.get(wishlistId) || 0
  }, [matchCountByWishlist])

  return {
    wishlists,
    matches,
    loading,
    error,
    addWishlistItem,
    updateWishlistItem,
    removeWishlistItem,
    getMatchCountForWishlist
  }
}
