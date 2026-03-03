#!/usr/bin/env node
/**
 * One-time script: clear Unsplash (and other blocked) imageUrl from Firestore
 * so market and user rocks show fallback instead of wrong images.
 *
 * Option A – Firebase Admin (recommended; run once):
 *   1. npm install firebase-admin
 *   2. Get a service account key from Firebase Console → Project Settings → Service accounts
 *   3. GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/fix-firestore-image-urls.js
 *
 * Option B – App auto-fix: the app already clears blocked imageUrls when it loads
 *   market_rocks and user rocks; just open the app signed in and the DB will fix over time.
 */

import admin from 'firebase-admin'

const PROJECT_ID = process.env.GCLOUD_PROJECT || 'rock-project-ef60a'
const APP_ID = process.env.VITE_APP_ID || 'default-app-id'

function isBlockedImageUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return false
  if (!url.startsWith('http')) return false
  return url.toLowerCase().includes('unsplash.com')
}

async function fixCollection(db, path) {
  const col = db.collection(path)
  const snap = await col.get()
  let updated = 0
  for (const d of snap.docs) {
    const data = d.data()
    if (data.imageUrl && isBlockedImageUrl(data.imageUrl)) {
      await d.ref.update({ imageUrl: '' })
      updated++
      console.log('  updated', d.id)
    }
  }
  return updated
}

async function main() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({ projectId: PROJECT_ID })
    } catch (e) {
      console.error('Firebase Admin init failed. Use GOOGLE_APPLICATION_CREDENTIALS or run from GCP.')
      process.exit(1)
    }
  }
  const db = admin.firestore()

  const marketPath = `artifacts/${APP_ID}/public/data/market_rocks`
  console.log('Fixing market_rocks:', marketPath)
  const marketUpdated = await fixCollection(db, marketPath)
  console.log('Market: cleared imageUrl on', marketUpdated, 'docs')

  console.log('Done. User rocks are fixed by the app when users load their collection.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
