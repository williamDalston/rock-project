import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from '@/services/firebase'
import type { User } from '@/types'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: Error | null
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Authentication failed'))
        setLoading(false)
      }
    }

    initAuth()

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, loading, error }
}
