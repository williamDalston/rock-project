import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export const getCollectionPaths = (appId: string, userId?: string) => ({
  // Existing paths
  userRocks: userId
    ? `artifacts/${appId}/users/${userId}/rocks`
    : null,
  marketRocks: `artifacts/${appId}/public/data/market_rocks`,

  // Phase 3: Trading paths
  trades: `artifacts/${appId}/trades`,

  // Phase 3: Verification paths
  verifications: `artifacts/${appId}/verifications`,
  verificationVotes: `artifacts/${appId}/verification_votes`,

  // Phase 3: Reviews path
  reviews: `artifacts/${appId}/reviews`,

  // Phase 3: User-specific paths
  userWishlists: userId
    ? `artifacts/${appId}/users/${userId}/wishlists`
    : null,
  userReputation: userId
    ? `artifacts/${appId}/users/${userId}/reputation/data`
    : null,
  userProfile: userId
    ? `artifacts/${appId}/users/${userId}/profile/data`
    : null
})
