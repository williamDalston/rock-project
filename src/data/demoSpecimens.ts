import type { Specimen, SpecimenCategory } from '@/types'

/**
 * Demo specimens for the Rock Porn feed.
 * Uses placeholder images until real images are processed.
 * Replace imageUrl with actual processed images from /lithos-images/processed/
 */

// Placeholder image generator - curated crystal/mineral photos from Unsplash
const PLACEHOLDERS: Record<string, string> = {
  // Classic minerals
  amethyst: 'https://images.unsplash.com/photo-1610123581698-5b3cbf7f1a0d?w=1080&h=1350&fit=crop',
  pyrite: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=1080&h=1350&fit=crop',
  bismuth: 'https://images.unsplash.com/photo-1635070040705-ed06a3d19089?w=1080&h=1350&fit=crop',
  malachite: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&h=1350&fit=crop',
  gold: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1080&h=1350&fit=crop',
  quartz: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1080&h=1350&fit=crop',
  obsidian: 'https://images.unsplash.com/photo-1558171813-4c2a0a7d0f9a?w=1080&h=1350&fit=crop',
  geode: 'https://images.unsplash.com/photo-1596394723269-5f4c5f0e6bf1?w=1080&h=1350&fit=crop',
  crystal: 'https://images.unsplash.com/photo-1612197527762-8cfb55b618d1?w=1080&h=1350&fit=crop',

  // Color-based
  blue: 'https://images.unsplash.com/photo-1571115764595-44f2c9c5cd21?w=1080&h=1350&fit=crop',
  pink: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1080&h=1350&fit=crop',
  dark: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1080&h=1350&fit=crop',
  green: 'https://images.unsplash.com/photo-1518882605630-8b5a7c7e4e0d?w=1080&h=1350&fit=crop',
  orange: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1080&h=1350&fit=crop',
  purple: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&h=1350&fit=crop',
  red: 'https://images.unsplash.com/photo-1518882605630-8b5a7c7e4e0d?w=1080&h=1350&fit=crop',
  yellow: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1080&h=1350&fit=crop',

  // Texture-based
  metallic: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=1080&h=1350&fit=crop',
  iridescent: 'https://images.unsplash.com/photo-1635070040705-ed06a3d19089?w=1080&h=1350&fit=crop',
  swirl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&h=1350&fit=crop',
  pattern: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&h=1350&fit=crop',

  // Gem-like
  emerald: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1080&h=1350&fit=crop',
  sapphire: 'https://images.unsplash.com/photo-1571115764595-44f2c9c5cd21?w=1080&h=1350&fit=crop',
  opal: 'https://images.unsplash.com/photo-1596394723269-5f4c5f0e6bf1?w=1080&h=1350&fit=crop',
}

// Random usernames for demo
const USERNAMES = [
  'CrystalHunter', 'MineralMaven', 'GeodeGuru', 'QuartzQueen', 'RockHound42',
  'GemSeeker', 'StoneWhisperer', 'CaveExplorer', 'MysticMiner', 'EarthTreasures',
  'PyritePrince', 'OpalObsessed', 'GarnetGatherer', 'SilicaSage', 'VolcanicVibes',
  'CosmicCollector', 'ToxicTreasures', 'NeonCollector', 'DarkMinerals', 'PastelStones'
]

// Helper functions for generating random data (used when expanding the feed)
export const getRandomUsername = () => USERNAMES[Math.floor(Math.random() * USERNAMES.length)]
export const getRandomLikes = () => Math.floor(Math.random() * 4500) + 100

export interface DemoSpecimen extends Specimen {
  imageUrl: string
  likes: number
  username: string
  category: SpecimenCategory
}

export const demoSpecimens: DemoSpecimen[] = [
  // ============================================
  // === NEON & TOXIC (High Visual Impact) ===
  // ============================================
  {
    filename: 'autunite_glow_01.webp',
    title: 'Autunite',
    type: 'mineral',
    description: 'Radioactive uranium mineral with an intense, natural neon-yellow glow. Often found in granite pegmatites.',
    tags: ['radioactive', 'neon', 'yellow', 'uranium', 'danger'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/autunite-mineral',
    imageUrl: PLACEHOLDERS.yellow,
    likes: 3421,
    username: 'ToxicTreasures',
    category: 'neon'
  },
  {
    filename: 'chalcanthite_electric_01.webp',
    title: 'Chalcanthite',
    type: 'mineral',
    description: 'Water-soluble copper sulfate with an incredibly vibrant, electric blue hue. Handle with care.',
    tags: ['blue', 'electric', 'copper', 'lab-grown', 'fragile'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/copper-sulfate-crystal',
    imageUrl: PLACEHOLDERS.blue,
    likes: 2876,
    username: 'NeonCollector',
    category: 'neon'
  },
  {
    filename: 'realgar_arsenic_01.webp',
    title: 'Realgar',
    type: 'mineral',
    description: 'An arsenic sulfide mineral known for its striking ruby-red color. It eventually disintegrates into yellow powder if exposed to light.',
    tags: ['red', 'arsenic', 'toxic', 'fragile', 'ancient'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/red-mineral-crystal',
    imageUrl: PLACEHOLDERS.red,
    likes: 2134,
    username: 'DangerMinerals',
    category: 'neon'
  },
  {
    filename: 'vanadinite_blood_01.webp',
    title: 'Vanadinite',
    type: 'mineral',
    description: 'Bright red-orange hexagonal crystals, usually found in arid climates. Contains lead and vanadium.',
    tags: ['red', 'hexagonal', 'lead', 'geometric', 'morocco'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/vanadinite',
    imageUrl: PLACEHOLDERS.orange,
    likes: 3567,
    username: 'GeometryLover',
    category: 'neon'
  },
  {
    filename: 'orpiment_gold_01.webp',
    title: 'Orpiment',
    type: 'mineral',
    description: "Deep orange-yellow arsenic sulfide. Historically used as a pigment called 'King's Yellow'.",
    tags: ['yellow', 'orange', 'arsenic', 'pigment', 'toxic'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/yellow-mineral',
    imageUrl: PLACEHOLDERS.gold,
    likes: 1987,
    username: 'HistoricMinerals',
    category: 'neon'
  },

  // ============================================
  // === COSMIC & MYSTIC (Spiritual/Metaphysical) ===
  // ============================================
  {
    filename: 'moldavite_impact_01.webp',
    title: 'Moldavite',
    type: 'tektite',
    description: 'Green silica glass formed by a meteorite impact 15 million years ago. Prized for its high vibrational energy.',
    tags: ['alien', 'meteorite', 'green', 'glass', 'high-vibe'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/moldavite',
    imageUrl: PLACEHOLDERS.green,
    likes: 5234,
    username: 'CosmicCollector',
    category: 'mystic'
  },
  {
    filename: 'labradorite_spectrolite_01.webp',
    title: 'Spectrolite',
    type: 'feldspar',
    description: 'A high-grade Labradorite from Finland that shows the full spectrum of colors, not just blue and gold.',
    tags: ['rainbow', 'flash', 'finland', 'magic', 'shielding'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/labradorite-macro',
    imageUrl: PLACEHOLDERS.iridescent,
    likes: 4521,
    username: 'NorthernLights',
    category: 'mystic'
  },
  {
    filename: 'charoite_swirl_01.webp',
    title: 'Charoite',
    type: 'mineral',
    description: 'A rare purple silicate found only in Siberia, featuring distinct swirling, fibrous patterns.',
    tags: ['purple', 'swirl', 'russia', 'dream', 'spirit'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/purple-stone-texture',
    imageUrl: PLACEHOLDERS.swirl,
    likes: 3876,
    username: 'SiberianStones',
    category: 'mystic'
  },
  {
    filename: 'super_seven_melody_01.webp',
    title: 'Super Seven',
    type: 'crystal',
    description: 'A quartz variety containing seven minerals: Amethyst, Cacoxenite, Goethite, Lepidocrocite, Rutile, Smoky Quartz, and Quartz.',
    tags: ['rare', 'seven', 'quartz', 'inclusion', 'ascension'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/amethyst-rutile',
    imageUrl: PLACEHOLDERS.purple,
    likes: 4123,
    username: 'MelodyStone',
    category: 'mystic'
  },
  {
    filename: 'celestite_heaven_01.webp',
    title: 'Celestite',
    type: 'mineral',
    description: 'Delicate, sky-blue crystals found in geodes. Known for promoting peace and mindfulness.',
    tags: ['blue', 'sky', 'peace', 'fragile', 'madagascar'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/celestite',
    imageUrl: PLACEHOLDERS.blue,
    likes: 3654,
    username: 'SkyStones',
    category: 'mystic'
  },
  {
    filename: 'angel_aura_quartz_01.webp',
    title: 'Angel Aura Quartz',
    type: 'crystal',
    description: 'Clear quartz bonded with platinum and silver vapor, creating an iridescent, pearly sheen.',
    tags: ['iridescent', 'rainbow', 'aura', 'treated', 'angel'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/angel-aura-quartz',
    imageUrl: PLACEHOLDERS.iridescent,
    likes: 4987,
    username: 'AuraCollector',
    category: 'mystic'
  },
  {
    filename: 'moonstone_rainbow_01.webp',
    title: 'Rainbow Moonstone',
    type: 'feldspar',
    description: 'A stone of new beginnings and feminine energy. Its blue flash represents the moon guiding through the subconscious.',
    tags: ['moonstone', 'intuition', 'feminine', 'mystic', 'flash'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/moonstone',
    imageUrl: PLACEHOLDERS.crystal,
    likes: 3891,
    username: 'MoonChild',
    category: 'mystic'
  },
  {
    filename: 'herkimer_diamond_01.webp',
    title: 'Herkimer Diamond',
    type: 'crystal',
    description: 'Double-terminated quartz with extreme clarity and high frequency. Used for attunement and dream work.',
    tags: ['herkimer', 'dream', 'clarity', 'attunement', 'quartz'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/diamond-quartz',
    imageUrl: PLACEHOLDERS.crystal,
    likes: 3456,
    username: 'DreamCatcher',
    category: 'mystic'
  },

  // ============================================
  // === HEAVY METAL (Industrial/Dark Mode) ===
  // ============================================
  {
    filename: 'bismuth_hopper_01.webp',
    title: 'Bismuth',
    type: 'metal',
    description: 'Post-transition metal with iridescent oxide tarnish and distinct hopper crystal structure.',
    tags: ['geometric', 'rainbow', 'metal', 'synthetic', 'tech'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/s/photos/bismuth',
    imageUrl: PLACEHOLDERS.bismuth,
    likes: 4891,
    username: 'GeometryLover',
    category: 'metal'
  },
  {
    filename: 'pyrite_cube_perfect_01.webp',
    title: 'Pyrite Cubes',
    type: 'mineral',
    description: 'Naturally forming perfect cubes of iron sulfide found in Navajún, Spain.',
    tags: ['cube', 'gold', 'geometric', 'spain', 'perfection'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/s/photos/pyrite-cube',
    imageUrl: PLACEHOLDERS.pyrite,
    likes: 5123,
    username: 'CubeCollector',
    category: 'metal'
  },
  {
    filename: 'galena_silver_01.webp',
    title: 'Galena',
    type: 'mineral',
    description: 'Primary ore of lead. Heavy, metallic grey crystals with perfect cubic cleavage.',
    tags: ['lead', 'silver', 'heavy', 'cubic', 'toxic'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/galena-mineral',
    imageUrl: PLACEHOLDERS.metallic,
    likes: 2345,
    username: 'HeavyMetal',
    category: 'metal'
  },
  {
    filename: 'stibnite_swords_01.webp',
    title: 'Stibnite',
    type: 'mineral',
    description: 'Antimony sulfide forming long, slender, sword-like metallic crystals.',
    tags: ['sharp', 'grey', 'sword', 'cluster', 'antimony'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/stibnite',
    imageUrl: PLACEHOLDERS.dark,
    likes: 2876,
    username: 'DarkMinerals',
    category: 'metal'
  },
  {
    filename: 'magnetite_lodestone_01.webp',
    title: 'Magnetite',
    type: 'mineral',
    description: 'A naturally magnetic iron ore. Used in the very first compasses (lodestone).',
    tags: ['magnetic', 'black', 'iron', 'science', 'compass'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/magnetite',
    imageUrl: PLACEHOLDERS.dark,
    likes: 1987,
    username: 'ScienceStones',
    category: 'metal'
  },

  // ============================================
  // === ORGANIC & EARTHY (Texture/Pattern) ===
  // ============================================
  {
    filename: 'moss_agate_forest_01.webp',
    title: 'Moss Agate',
    type: 'chalcedony',
    description: 'Clear stone with green dendritic inclusions that resemble moss or forests.',
    tags: ['green', 'plant', 'nature', 'forest', 'garden'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/moss-agate',
    imageUrl: PLACEHOLDERS.green,
    likes: 3456,
    username: 'ForestStones',
    category: 'organic'
  },
  {
    filename: 'ocean_jasper_orb_01.webp',
    title: 'Ocean Jasper',
    type: 'mineral',
    description: 'Rare orbicular jasper from Madagascar, featuring circles and dots in green, pink, and white.',
    tags: ['circles', 'pattern', 'madagascar', 'sea', 'rare'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/ocean-jasper',
    imageUrl: PLACEHOLDERS.pattern,
    likes: 4123,
    username: 'OceanicGems',
    category: 'organic'
  },
  {
    filename: 'petrified_wood_ancient_01.webp',
    title: 'Petrified Wood',
    type: 'fossil',
    description: 'Ancient wood where the organic material has been replaced by silicate minerals, preserving the structure.',
    tags: ['wood', 'brown', 'ancient', 'tree', 'fossil'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/petrified-wood',
    imageUrl: PLACEHOLDERS.pattern,
    likes: 2765,
    username: 'AncientWisdom',
    category: 'organic'
  },
  {
    filename: 'septarian_dragon_01.webp',
    title: 'Septarian Nodule',
    type: 'rock',
    description: "Clay nodules with yellow calcite centers and brown aragonite lines. Often called 'Dragon Eggs'.",
    tags: ['dragon', 'egg', 'yellow', 'brown', 'pattern'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/septarian',
    imageUrl: PLACEHOLDERS.pattern,
    likes: 3234,
    username: 'DragonEggs',
    category: 'organic'
  },
  {
    filename: 'bumblebee_jasper_volcano_01.webp',
    title: 'Bumblebee Jasper',
    type: 'rock',
    description: 'Vivid yellow, orange, and black banded rock formed in volcanic vents in Indonesia.',
    tags: ['yellow', 'black', 'volcanic', 'banded', 'sulfur'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/bumblebee-jasper',
    imageUrl: PLACEHOLDERS.yellow,
    likes: 2987,
    username: 'VolcanicVibes',
    category: 'organic'
  },

  // ============================================
  // === CANDY & POP (Vivid Color) ===
  // ============================================
  {
    filename: 'rhodochrosite_bacon_01.webp',
    title: 'Rhodochrosite',
    type: 'mineral',
    description: "Rose-red mineral often found with white bands. Known as the 'Inca Rose'.",
    tags: ['pink', 'red', 'sweet', 'banded', 'heart'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/rhodochrosite',
    imageUrl: PLACEHOLDERS.pink,
    likes: 4567,
    username: 'PinkStones',
    category: 'candy'
  },
  {
    filename: 'fluorite_rainbow_01.webp',
    title: 'Rainbow Fluorite',
    type: 'mineral',
    description: 'Transparent crystal showing distinct bands of purple, green, and clear colors.',
    tags: ['purple', 'green', 'striped', 'clarity', 'focus'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/rainbow-fluorite',
    imageUrl: PLACEHOLDERS.purple,
    likes: 3789,
    username: 'RainbowCollector',
    category: 'candy'
  },
  {
    filename: 'grape_agate_cluster_01.webp',
    title: 'Grape Agate',
    type: 'crystal',
    description: 'Botryoidal purple chalcedony that looks exactly like a bunch of small grapes.',
    tags: ['purple', 'spheres', 'fruit', 'indonesia', 'fun'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/grape-agate',
    imageUrl: PLACEHOLDERS.purple,
    likes: 4234,
    username: 'GrapeGems',
    category: 'candy'
  },
  {
    filename: 'orange_calcite_juicy_01.webp',
    title: 'Orange Calcite',
    type: 'mineral',
    description: 'Bright, juicy orange stone that looks like citrus fruit. Very soft and waxy feel.',
    tags: ['orange', 'citrus', 'joy', 'creative', 'soft'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/orange-calcite',
    imageUrl: PLACEHOLDERS.orange,
    likes: 2876,
    username: 'CitrusStones',
    category: 'candy'
  },
  {
    filename: 'larimar_caribbean_01.webp',
    title: 'Larimar',
    type: 'mineral',
    description: 'Rare blue pectolite found only in the Caribbean, resembling sunlit ocean water.',
    tags: ['blue', 'ocean', 'summer', 'rare', 'dominican'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/larimar',
    imageUrl: PLACEHOLDERS.blue,
    likes: 5123,
    username: 'CaribbeanGems',
    category: 'candy'
  },

  // ============================================
  // === ROYAL & PRECIOUS (High Value) ===
  // ============================================
  {
    filename: 'emerald_raw_01.webp',
    title: 'Raw Emerald',
    type: 'gem',
    description: 'Green gem variety of Beryl. The stone of successful love and domestic bliss.',
    tags: ['green', 'gem', 'royal', 'expensive', 'beryl'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/raw-emerald',
    imageUrl: PLACEHOLDERS.emerald,
    likes: 5678,
    username: 'RoyalGems',
    category: 'precious'
  },
  {
    filename: 'sapphire_blue_01.webp',
    title: 'Raw Sapphire',
    type: 'gem',
    description: 'Gem quality corundum. Typically deep blue, but can be yellow, pink, or white.',
    tags: ['blue', 'hard', 'gem', 'wisdom', 'corundum'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/raw-sapphire',
    imageUrl: PLACEHOLDERS.sapphire,
    likes: 4987,
    username: 'SapphireSeeker',
    category: 'precious'
  },
  {
    filename: 'tanzanite_violet_01.webp',
    title: 'Tanzanite',
    type: 'gem',
    description: 'Blue-violet stone found only in Tanzania. Displays different colors when viewed from different angles.',
    tags: ['violet', 'blue', 'rare', 'africa', 'pleochroic'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/tanzanite',
    imageUrl: PLACEHOLDERS.purple,
    likes: 4321,
    username: 'AfricanGems',
    category: 'precious'
  },
  {
    filename: 'opal_welo_fire_01.webp',
    title: 'Welo Opal',
    type: 'gem',
    description: 'Ethiopian opal known for vivid play-of-color against a white or translucent body.',
    tags: ['fire', 'rainbow', 'flash', 'ethiopia', 'gem'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/ethiopian-opal',
    imageUrl: PLACEHOLDERS.opal,
    likes: 5432,
    username: 'OpalObsessed',
    category: 'precious'
  },
  {
    filename: 'alexandrite_change_01.webp',
    title: 'Alexandrite',
    type: 'gem',
    description: 'Very rare chrysoberyl that changes color from green in daylight to red in incandescent light.',
    tags: ['color-change', 'rare', 'red', 'green', 'russian'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/alexandrite',
    imageUrl: PLACEHOLDERS.green,
    likes: 6123,
    username: 'RareGems',
    category: 'precious'
  },

  // ============================================
  // === ESSENTIALS (The Classics) ===
  // ============================================
  {
    filename: 'amethyst_cluster_01.webp',
    title: 'Amethyst',
    type: 'crystal',
    description: 'Purple quartz. A meditative and calming stone that promotes balance.',
    tags: ['purple', 'calm', 'classic', 'quartz', 'february'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/s/photos/amethyst-crystal',
    imageUrl: PLACEHOLDERS.amethyst,
    likes: 4567,
    username: 'CrystalHunter',
    category: 'classic'
  },
  {
    filename: 'citrine_point_01.webp',
    title: 'Citrine',
    type: 'crystal',
    description: "Yellow-to-orange quartz. Known as the 'Merchant's Stone' for attracting wealth.",
    tags: ['yellow', 'wealth', 'sun', 'energy', 'quartz'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/citrine',
    imageUrl: PLACEHOLDERS.gold,
    likes: 3456,
    username: 'WealthStones',
    category: 'classic'
  },
  {
    filename: 'rose_quartz_raw_01.webp',
    title: 'Rose Quartz',
    type: 'crystal',
    description: 'Pink quartz. The universal stone of unconditional love and peace.',
    tags: ['pink', 'love', 'heart', 'gentle', 'quartz'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/rose-quartz',
    imageUrl: PLACEHOLDERS.pink,
    likes: 4234,
    username: 'LoveStones',
    category: 'classic'
  },
  {
    filename: 'clear_quartz_point_01.webp',
    title: 'Clear Quartz',
    type: 'crystal',
    description: "Pure silicon dioxide. Known as the 'Master Healer' and amplifier of energy.",
    tags: ['clear', 'healer', 'amplifier', 'master', 'quartz'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/clear-quartz',
    imageUrl: PLACEHOLDERS.crystal,
    likes: 3789,
    username: 'HealerStones',
    category: 'classic'
  },
  {
    filename: 'tigers_eye_gold_01.webp',
    title: "Tiger's Eye",
    type: 'mineral',
    description: 'Chatoyant gemstone that is usually a metamorphic rock with a golden to red-brown color.',
    tags: ['brown', 'gold', 'protection', 'grounding', 'chatoyant'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/tigers-eye-stone',
    imageUrl: PLACEHOLDERS.gold,
    likes: 2987,
    username: 'EverydayGems',
    category: 'common'
  },

  // ============================================
  // === ABYSSAL & DARK ===
  // ============================================
  {
    filename: 'black_tourmaline_rough_01.webp',
    title: 'Schorl (Black Tourmaline)',
    type: 'crystal',
    description: 'Deep black, striated columns that absorb almost all light. Ultimate protection stone.',
    tags: ['tourmaline', 'black', 'schorl', 'protection', 'dark'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/black-tourmaline',
    imageUrl: PLACEHOLDERS.obsidian,
    likes: 3212,
    username: 'ShadowStones',
    category: 'abyssal'
  },
  {
    filename: 'obsidian_rainbow_01.webp',
    title: 'Rainbow Obsidian',
    type: 'rock',
    description: 'Volcanic glass with hidden rainbow sheen visible when polished and held at the right angle.',
    tags: ['obsidian', 'rainbow', 'volcanic', 'glass', 'dark'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/obsidian',
    imageUrl: PLACEHOLDERS.dark,
    likes: 2876,
    username: 'VolcanicVibes',
    category: 'abyssal'
  },
  {
    filename: 'smoky_quartz_dark_01.webp',
    title: 'Smoky Quartz',
    type: 'crystal',
    description: 'A translucent grey-to-black quartz variety. Its shadowy color comes from natural irradiation.',
    tags: ['quartz', 'smoky', 'black', 'grounding', 'shadow'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/smoky-quartz',
    imageUrl: PLACEHOLDERS.dark,
    likes: 2345,
    username: 'ShadowQuartz',
    category: 'abyssal'
  },

  // ============================================
  // === ETHEREAL & PASTEL ===
  // ============================================
  {
    filename: 'morganite_pink_01.webp',
    title: 'Raw Morganite',
    type: 'gem',
    description: "Pale pink to peach beryl, known as the 'Pink Emerald'. Divine love stone.",
    tags: ['morganite', 'pink', 'peach', 'soft', 'romance'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/morganite-crystal',
    imageUrl: PLACEHOLDERS.pink,
    likes: 3891,
    username: 'PastelStones',
    category: 'ethereal'
  },
  {
    filename: 'kunzite_lilac_01.webp',
    title: 'Kunzite',
    type: 'gem',
    description: 'Lilac-colored spodumene crystal with a glass-like vertical structure.',
    tags: ['kunzite', 'lilac', 'purple', 'blade', 'clarity'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/kunzite',
    imageUrl: PLACEHOLDERS.purple,
    likes: 2654,
    username: 'LilacLover',
    category: 'ethereal'
  },
  {
    filename: 'aquamarine_blue_01.webp',
    title: 'Aquamarine',
    type: 'gem',
    description: 'Pale blue-green beryl crystal. The stone of sailors, promoting safe travels across water.',
    tags: ['aquamarine', 'blue', 'beryl', 'ocean', 'calm'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/aquamarine',
    imageUrl: PLACEHOLDERS.blue,
    likes: 3456,
    username: 'OceanicGems',
    category: 'ethereal'
  },

  // ============================================
  // === COMMON & ACCESSIBLE ===
  // ============================================
  {
    filename: 'carnelian_ember_01.webp',
    title: 'Carnelian',
    type: 'mineral',
    description: 'Glassy, translucent orange-red chalcedony that seems to glow from within like a dying ember.',
    tags: ['carnelian', 'orange', 'fire', 'vitality', 'sacral'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/carnelian',
    imageUrl: PLACEHOLDERS.orange,
    likes: 2567,
    username: 'FireStones',
    category: 'common'
  },
  {
    filename: 'sodalite_blue_01.webp',
    title: 'Sodalite',
    type: 'rock',
    description: 'Rich royal blue stone crossed with white calcite veins. Enhances intuition and logic.',
    tags: ['sodalite', 'blue', 'white', 'intuition', 'logic'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/sodalite',
    imageUrl: PLACEHOLDERS.blue,
    likes: 1987,
    username: 'BlueStones',
    category: 'common'
  },
  {
    filename: 'lapis_lazuli_01.webp',
    title: 'Lapis Lazuli',
    type: 'rock',
    description: 'Deep blue metamorphic rock with gold pyrite flecks. Stone of royalty and wisdom.',
    tags: ['lapis', 'blue', 'gold', 'royal', 'ancient'],
    source: 'Unsplash Search',
    license: 'Check Source',
    url: 'https://unsplash.com/s/photos/lapis-lazuli',
    imageUrl: PLACEHOLDERS.blue,
    likes: 3456,
    username: 'RoyalStones',
    category: 'common'
  }
]

// Helper to get specimens by category
export const getSpecimensByCategory = (category: SpecimenCategory): DemoSpecimen[] =>
  demoSpecimens.filter(s => s.category === category)

// Get a shuffled feed (for variety)
export const getShuffledFeed = (): DemoSpecimen[] =>
  [...demoSpecimens].sort(() => Math.random() - 0.5)

// Get category display info
export const CATEGORY_INFO: Record<SpecimenCategory, { label: string; emoji: string; color: string }> = {
  classic: { label: 'Classic', emoji: '💎', color: 'emerald' },
  neon: { label: 'Neon & Toxic', emoji: '☢️', color: 'lime' },
  ethereal: { label: 'Ethereal', emoji: '✨', color: 'sky' },
  abyssal: { label: 'Abyssal', emoji: '🌑', color: 'slate' },
  mystic: { label: 'Cosmic & Mystic', emoji: '🔮', color: 'violet' },
  common: { label: 'Everyday Gems', emoji: '🪨', color: 'stone' },
  metal: { label: 'Heavy Metal', emoji: '⚙️', color: 'zinc' },
  organic: { label: 'Organic & Earthy', emoji: '🌿', color: 'amber' },
  candy: { label: 'Candy & Pop', emoji: '🍬', color: 'pink' },
  precious: { label: 'Royal & Precious', emoji: '👑', color: 'yellow' }
}
