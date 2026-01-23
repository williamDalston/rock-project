/**
 * Database seeding script
 * Run with: npx tsx scripts/seedDatabase.ts
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Firebase config - same as in .env
const firebaseConfig = {
  apiKey: "AIzaSyBTp7AW32PSybCVDFNc6yO_WrBrw44DURA",
  authDomain: "rock-project-ef60a.firebaseapp.com",
  projectId: "rock-project-ef60a",
  storageBucket: "rock-project-ef60a.firebasestorage.app",
  messagingSenderId: "296916174373",
  appId: "1:296916174373:web:eefbf1d52dadefa6efe1cc"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Demo specimens data
const demoSpecimens = [
  {
    name: 'Amethyst Cluster',
    type: 'crystal',
    description: 'Purple quartz. A meditative and calming stone that promotes balance.',
    imageUrl: 'https://images.unsplash.com/photo-1610123581698-5a93cc3f89e5?w=800&h=800&fit=crop',
    tags: ['purple', 'calm', 'classic', 'quartz'],
    rarity: 3,
    likes: 4567
  },
  {
    name: 'Pyrite Cubes',
    type: 'mineral',
    description: 'Naturally forming perfect cubes of iron sulfide found in Navajún, Spain.',
    imageUrl: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=800&h=800&fit=crop',
    tags: ['cube', 'gold', 'geometric', 'spain'],
    rarity: 4,
    likes: 5123
  },
  {
    name: 'Bismuth Crystal',
    type: 'metal',
    description: 'Post-transition metal with iridescent oxide tarnish and distinct hopper crystal structure.',
    imageUrl: 'https://images.unsplash.com/photo-1635070040705-ed06a3d19089?w=800&h=800&fit=crop',
    tags: ['geometric', 'rainbow', 'metal', 'synthetic'],
    rarity: 4,
    likes: 4891
  },
  {
    name: 'Malachite',
    type: 'mineral',
    description: 'Striking green banded copper carbonate mineral with concentric rings.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
    tags: ['green', 'banded', 'copper', 'swirl'],
    rarity: 3,
    likes: 3421
  },
  {
    name: 'Rose Quartz',
    type: 'crystal',
    description: 'Pink quartz. The universal stone of unconditional love and peace.',
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=800&fit=crop',
    tags: ['pink', 'love', 'heart', 'gentle'],
    rarity: 2,
    likes: 4234
  },
  {
    name: 'Labradorite',
    type: 'feldspar',
    description: 'A high-grade Labradorite showing the full spectrum of colors with stunning flash.',
    imageUrl: 'https://images.unsplash.com/photo-1571115764595-44f2c9c5cd21?w=800&h=800&fit=crop',
    tags: ['rainbow', 'flash', 'magic', 'shielding'],
    rarity: 4,
    likes: 4521
  },
  {
    name: 'Obsidian',
    type: 'rock',
    description: 'Volcanic glass with hidden rainbow sheen visible when polished.',
    imageUrl: 'https://images.unsplash.com/photo-1558171813-4c2a0a7d0f9a?w=800&h=800&fit=crop',
    tags: ['obsidian', 'volcanic', 'glass', 'dark'],
    rarity: 2,
    likes: 2876
  },
  {
    name: 'Citrine Point',
    type: 'crystal',
    description: "Yellow-to-orange quartz. Known as the 'Merchant's Stone' for attracting wealth.",
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=800&fit=crop',
    tags: ['yellow', 'wealth', 'sun', 'energy'],
    rarity: 3,
    likes: 3456
  },
  {
    name: 'Clear Quartz',
    type: 'crystal',
    description: "Pure silicon dioxide. Known as the 'Master Healer' and amplifier of energy.",
    imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=800&fit=crop',
    tags: ['clear', 'healer', 'amplifier', 'master'],
    rarity: 2,
    likes: 3789
  },
  {
    name: 'Fluorite Rainbow',
    type: 'mineral',
    description: 'Transparent crystal showing distinct bands of purple, green, and clear colors.',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=800&fit=crop',
    tags: ['purple', 'green', 'striped', 'clarity'],
    rarity: 3,
    likes: 3789
  },
  {
    name: 'Tiger Eye',
    type: 'mineral',
    description: 'Chatoyant gemstone with a golden to red-brown color and silky luster.',
    imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop',
    tags: ['brown', 'gold', 'protection', 'grounding'],
    rarity: 2,
    likes: 2987
  },
  {
    name: 'Celestite Cluster',
    type: 'mineral',
    description: 'Delicate, sky-blue crystals found in geodes. Known for promoting peace.',
    imageUrl: 'https://images.unsplash.com/photo-1612197527762-8cfb55b618d1?w=800&h=800&fit=crop',
    tags: ['blue', 'sky', 'peace', 'fragile'],
    rarity: 4,
    likes: 3654
  }
]

const APP_ID = 'default-app-id'

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  const marketRocksPath = `artifacts/${APP_ID}/public/data/market_rocks`

  let count = 0
  for (const specimen of demoSpecimens) {
    try {
      const rockData = {
        name: specimen.name,
        type: specimen.type,
        description: specimen.description,
        imageUrl: specimen.imageUrl,
        tags: specimen.tags,
        rarity: specimen.rarity,
        likes: specimen.likes,
        likedBy: [],
        ownerId: 'demo-user',
        ownerName: 'Lithos Demo',
        isPublic: true,
        location: null,
        createdAt: serverTimestamp()
      }

      await addDoc(collection(db, marketRocksPath), rockData)
      count++
      console.log(`✅ Added: ${specimen.name}`)
    } catch (error) {
      console.error(`❌ Failed to add ${specimen.name}:`, error)
    }
  }

  console.log(`\n🎉 Seeding complete! Added ${count} rocks to the market.`)
  console.log('Refresh your app to see the rocks!')
  process.exit(0)
}

seedDatabase()
