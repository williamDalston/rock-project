# Fixing Firestore image URLs (Unsplash / wrong images)

## What the app already does

- **Display**: Any `imageUrl` from Unsplash is never shown; the app uses the fallback image instead.
- **Database**: When the app loads market rocks or personal rocks, it automatically updates any document whose `imageUrl` is from Unsplash to `imageUrl: ''`. So the database fixes itself as users open the app.

You don’t have to run a script if you’re okay with that gradual fix.

## One-time fix (optional)

To clear Unsplash `imageUrl` from **market_rocks** in one go:

1. Install Firebase Admin (once):  
   `npm install firebase-admin`
2. In [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service accounts → “Generate new private key”.
3. Run:  
   `GOOGLE_APPLICATION_CREDENTIALS=/path/to/that-key.json node scripts/fix-firestore-image-urls.js`

User rocks (personal collection) are updated by the app when each user loads their collection; the script only touches `market_rocks`.

## Other possible issues

- **Caching**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R) or open in incognito so you get the latest JS and images.
- **Service worker**: If the app uses a PWA worker, unregister it or “Update on reload” in DevTools so it doesn’t serve old assets.
- **Deploy**: Confirm the deployed site is from the latest commit (runtime `getBase()` + `getRockImageUrl()` + blocked Unsplash).
