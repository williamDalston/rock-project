import { useState, useEffect, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/services/firebase'
import type { User } from '@/types'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: Error | null
  isAnonymous: boolean

  // Auth methods
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  upgradeAnonymousAccount: (method: 'google' | 'email', email?: string, password?: string) => Promise<void>
  clearError: () => void
}

const googleProvider = new GoogleAuthProvider()

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isAnonymous = user?.isAnonymous ?? false

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        // Auto sign in anonymously if no user
        try {
          await signInAnonymously(auth)
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Authentication failed'))
        }
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err: any) {
      // Handle popup closed by user
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err instanceof Error ? err : new Error('Google sign-in failed'))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      let message = 'Sign in failed'
      if (err.code === 'auth/user-not-found') message = 'No account found with this email'
      else if (err.code === 'auth/wrong-password') message = 'Incorrect password'
      else if (err.code === 'auth/invalid-email') message = 'Invalid email address'
      else if (err.code === 'auth/invalid-credential') message = 'Invalid email or password'
      setError(new Error(message))
    } finally {
      setLoading(false)
    }
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName?: string) => {
    setError(null)
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName })
      }
    } catch (err: any) {
      let message = 'Sign up failed'
      if (err.code === 'auth/email-already-in-use') message = 'An account with this email already exists'
      else if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters'
      else if (err.code === 'auth/invalid-email') message = 'Invalid email address'
      setError(new Error(message))
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      let message = 'Password reset failed'
      if (err.code === 'auth/user-not-found') message = 'No account found with this email'
      else if (err.code === 'auth/invalid-email') message = 'Invalid email address'
      setError(new Error(message))
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    try {
      await firebaseSignOut(auth)
      // Will auto sign in anonymously via the onAuthStateChanged listener
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign out failed'))
    }
  }, [])

  // Upgrade anonymous account to permanent account
  const upgradeAnonymousAccount = useCallback(async (
    method: 'google' | 'email',
    email?: string,
    password?: string
  ) => {
    if (!user || !user.isAnonymous) {
      setError(new Error('No anonymous account to upgrade'))
      return
    }

    setError(null)
    setLoading(true)

    try {
      if (method === 'google') {
        await linkWithPopup(user, googleProvider)
      } else if (method === 'email' && email && password) {
        const credential = EmailAuthProvider.credential(email, password)
        await linkWithCredential(user, credential)
      }
    } catch (err: any) {
      let message = 'Account upgrade failed'
      if (err.code === 'auth/credential-already-in-use') {
        message = 'This account is already linked to another user'
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists'
      }
      setError(new Error(message))
    } finally {
      setLoading(false)
    }
  }, [user])

  return {
    user,
    loading,
    error,
    isAnonymous,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
    upgradeAnonymousAccount,
    clearError
  }
}
