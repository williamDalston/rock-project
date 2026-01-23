import { useState, useCallback } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'
import { db, getCollectionPaths } from '@/services/firebase'
import { APP_CONFIG } from '@/constants'
import type { Rock, User } from '@/types'

interface UseLikesReturn {
  isLiking: boolean
  toggleLike: (rock: Rock) => Promise<void>
  isLikedByUser: (rock: Rock, userId: string) => boolean
}

export function useLikes(user: User | null): UseLikesReturn {
  const [isLiking, setIsLiking] = useState(false)

  const isLikedByUser = useCallback((rock: Rock, userId: string): boolean => {
    return rock.likedBy?.includes(userId) || false
  }, [])

  const toggleLike = useCallback(async (rock: Rock) => {
    if (!user) return

    setIsLiking(true)

    try {
      const paths = getCollectionPaths(APP_CONFIG.APP_ID, rock.ownerId)
      const marketRef = doc(db, paths.marketRocks, rock.id)

      const isCurrentlyLiked = isLikedByUser(rock, user.uid)

      if (isCurrentlyLiked) {
        // Unlike
        await updateDoc(marketRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid)
        })
      } else {
        // Like
        await updateDoc(marketRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid)
        })
      }
    } catch (err) {
      console.error('Failed to toggle like:', err)
    } finally {
      setIsLiking(false)
    }
  }, [user, isLikedByUser])

  return {
    isLiking,
    toggleLike,
    isLikedByUser
  }
}
