import type { Specimen, SpecimenCategory } from '@/types'

/**
 * Demo specimens for the Rock Porn feed.
 * Use shared fallback URL so wiring matches app constants.
 */
import { FALLBACK_IMAGE_URL } from '@/constants'

// Random usernames for demo
const USERNAMES = [
  'CrystalHunter', 'MineralMaven', 'GeodeGuru', 'QuartzQueen', 'RockHound42',
  'GemSeeker', 'StoneWhisperer', 'CaveExplorer', 'MysticMiner', 'EarthTreasures',
  'PyritePrince', 'OpalObsessed', 'GarnetGatherer', 'SilicaSage', 'VolcanicVibes',
  'CosmicCollector', 'ToxicTreasures', 'NeonCollector', 'DarkMinerals', 'PastelStones'
]

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
  // === CLASSIC MINERALS ===
  // ============================================
  {
    filename: 'pyrite_cube_01.webp',
    title: 'Pyrite Cubes',
    type: 'mineral',
    description: 'Naturally forming perfect cubes of iron sulfide found in Navajún, Spain. Known as Fools Gold.',
    tags: ['pyrite', 'gold', 'metallic', 'cubic', 'spain'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/photos/Ay-8VsuG_UA',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 5123,
    username: 'CubeCollector',
    category: 'metal'
  },
  {
    filename: 'malachite_texture_01.webp',
    title: 'Malachite Banding',
    type: 'mineral',
    description: 'Polished surface showing deep green botryoidal banding patterns. Copper carbonate mineral.',
    tags: ['malachite', 'green', 'pattern', 'banded', 'copper'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/photos/vIdRMp8IpO0',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3876,
    username: 'GreenStones',
    category: 'classic'
  },
  {
    filename: 'native_gold_01.webp',
    title: 'Native Gold Nugget',
    type: 'metal',
    description: 'Raw native gold nugget with textured surface. The ultimate precious metal specimen.',
    tags: ['gold', 'metal', 'nugget', 'precious', 'yellow'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/photos/eLeXwRx4ALs',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 6234,
    username: 'GoldRush',
    category: 'precious'
  },
  {
    filename: 'fluorite_raw_01.webp',
    title: 'Raw Fluorite',
    type: 'crystal',
    description: 'Rough fluorite specimen showing purple and white zoning. Known for its fluorescence.',
    tags: ['fluorite', 'purple', 'white', 'raw', 'halide'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/photos/BVjRFkvG4Kg',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3456,
    username: 'FluoFan',
    category: 'classic'
  },
  {
    filename: 'quartz_clear_01.webp',
    title: 'Clear Quartz Points',
    type: 'crystal',
    description: 'Pristine clear quartz points rising from matrix. Known as the Master Healer.',
    tags: ['quartz', 'clear', 'points', 'cluster', 'silica'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/photos/V0l3kUa6aBs',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3789,
    username: 'HealerStones',
    category: 'classic'
  },
  {
    filename: 'amethyst_geode_01.webp',
    title: 'Amethyst Geode',
    type: 'crystal',
    description: 'Large split geode revealing deep violet amethyst interior. Cathedral-grade specimen.',
    tags: ['amethyst', 'geode', 'cave', 'violet', 'large'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com/photos/VPX6eeOI5s4',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 5432,
    username: 'GeodeGuru',
    category: 'classic'
  },

  // ============================================
  // === MYSTIC & COSMIC ===
  // ============================================
  {
    filename: 'celestite_heaven_01.webp',
    title: 'Celestite Cluster',
    type: 'mineral',
    description: 'Delicate, sky-blue strontium sulfate crystals. Known for promoting peace and angelic connection.',
    tags: ['celestite', 'blue', 'sky', 'angelic', 'peace'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3654,
    username: 'SkyStones',
    category: 'mystic'
  },
  {
    filename: 'charoite_swirl_01.webp',
    title: 'Charoite',
    type: 'mineral',
    description: 'A rare purple silicate found only in Siberia, featuring distinct swirling, fibrous patterns.',
    tags: ['charoite', 'purple', 'swirl', 'siberia', 'rare'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3876,
    username: 'SiberianStones',
    category: 'mystic'
  },
  {
    filename: 'moonstone_rainbow_01.webp',
    title: 'Rainbow Moonstone',
    type: 'feldspar',
    description: 'A stone of new beginnings and feminine energy. Its blue flash represents lunar light.',
    tags: ['moonstone', 'intuition', 'feminine', 'mystic', 'flash'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3891,
    username: 'MoonChild',
    category: 'mystic'
  },
  {
    filename: 'moldavite_tektite_01.webp',
    title: 'Moldavite',
    type: 'tektite',
    description: 'Green silica glass formed by meteorite impact 15 million years ago. High vibrational stone.',
    tags: ['moldavite', 'alien', 'transformation', 'meteorite', 'green'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 5234,
    username: 'CosmicCollector',
    category: 'mystic'
  },

  // ============================================
  // === CANDY & POP (Vivid Colors) ===
  // ============================================
  {
    filename: 'rose_quartz_raw_01.webp',
    title: 'Rose Quartz',
    type: 'crystal',
    description: 'Pink quartz - the universal stone of unconditional love and peace.',
    tags: ['rose', 'quartz', 'pink', 'love', 'gentle'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 4234,
    username: 'LoveStones',
    category: 'candy'
  },
  {
    filename: 'rhodochrosite_bacon_01.webp',
    title: 'Rhodochrosite',
    type: 'mineral',
    description: 'Rose-red manganese carbonate with white bands. Known as the Inca Rose.',
    tags: ['rhodochrosite', 'pink', 'red', 'banded', 'heart'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 4567,
    username: 'PinkStones',
    category: 'candy'
  },
  {
    filename: 'orange_calcite_juicy_01.webp',
    title: 'Orange Calcite',
    type: 'mineral',
    description: 'Bright, juicy orange stone with waxy luster. Promotes creativity and joy.',
    tags: ['calcite', 'orange', 'citrus', 'joy', 'creative'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 2876,
    username: 'CitrusStones',
    category: 'candy'
  },
  {
    filename: 'grape_agate_cluster_01.webp',
    title: 'Grape Agate',
    type: 'crystal',
    description: 'Botryoidal purple chalcedony that looks exactly like a bunch of small grapes.',
    tags: ['grape', 'agate', 'purple', 'spheres', 'indonesia'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 4234,
    username: 'GrapeGems',
    category: 'candy'
  },

  // ============================================
  // === NEON & TOXIC ===
  // ============================================
  {
    filename: 'autunite_glow_01.webp',
    title: 'Autunite',
    type: 'mineral',
    description: 'Radioactive uranium mineral with an intense, natural neon-yellow glow under UV light.',
    tags: ['autunite', 'radioactive', 'neon', 'yellow', 'uranium'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3421,
    username: 'ToxicTreasures',
    category: 'neon'
  },
  {
    filename: 'chalcanthite_electric_01.webp',
    title: 'Chalcanthite',
    type: 'mineral',
    description: 'Water-soluble copper sulfate with an incredibly vibrant, electric blue hue.',
    tags: ['chalcanthite', 'blue', 'electric', 'copper', 'fragile'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 2876,
    username: 'NeonCollector',
    category: 'neon'
  },
  {
    filename: 'vanadinite_blood_01.webp',
    title: 'Vanadinite',
    type: 'mineral',
    description: 'Bright red-orange hexagonal crystals containing lead and vanadium.',
    tags: ['vanadinite', 'red', 'hexagonal', 'lead', 'geometric'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3567,
    username: 'GeometryLover',
    category: 'neon'
  },

  // ============================================
  // === ABYSSAL & DARK ===
  // ============================================
  {
    filename: 'black_tourmaline_rough_01.webp',
    title: 'Schorl (Black Tourmaline)',
    type: 'crystal',
    description: 'Deep black striated columns that absorb almost all light. Ultimate protection stone.',
    tags: ['tourmaline', 'black', 'schorl', 'protection', 'dark'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3212,
    username: 'ShadowStones',
    category: 'abyssal'
  },
  {
    filename: 'smoky_quartz_dark_01.webp',
    title: 'Smoky Quartz',
    type: 'crystal',
    description: 'A translucent grey-to-black quartz variety. Its color comes from natural irradiation.',
    tags: ['quartz', 'smoky', 'black', 'grounding', 'shadow'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 2345,
    username: 'ShadowQuartz',
    category: 'abyssal'
  },
  {
    filename: 'galena_silver_01.webp',
    title: 'Galena',
    type: 'mineral',
    description: 'Primary ore of lead. Heavy, metallic grey crystals with perfect cubic cleavage.',
    tags: ['galena', 'lead', 'silver', 'heavy', 'cubic'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 2345,
    username: 'HeavyMetal',
    category: 'metal'
  },

  // ============================================
  // === ETHEREAL & PASTEL ===
  // ============================================
  {
    filename: 'aquamarine_blue_01.webp',
    title: 'Aquamarine',
    type: 'gem',
    description: 'Pale blue-green beryl crystal. The stone of sailors, promoting safe travels.',
    tags: ['aquamarine', 'blue', 'beryl', 'ocean', 'calm'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3456,
    username: 'OceanicGems',
    category: 'ethereal'
  },
  {
    filename: 'kunzite_lilac_01.webp',
    title: 'Kunzite',
    type: 'gem',
    description: 'Lilac-colored spodumene crystal with a glass-like vertical structure.',
    tags: ['kunzite', 'lilac', 'purple', 'blade', 'clarity'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 2654,
    username: 'LilacLover',
    category: 'ethereal'
  },
  {
    filename: 'morganite_pink_01.webp',
    title: 'Raw Morganite',
    type: 'gem',
    description: 'Pale pink to peach beryl, known as the Pink Emerald. Divine love stone.',
    tags: ['morganite', 'pink', 'peach', 'soft', 'romance'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3891,
    username: 'PastelStones',
    category: 'ethereal'
  },

  // ============================================
  // === PRECIOUS GEMS ===
  // ============================================
  {
    filename: 'emerald_raw_01.webp',
    title: 'Raw Emerald',
    type: 'gem',
    description: 'Green gem variety of Beryl. The stone of successful love and domestic bliss.',
    tags: ['emerald', 'green', 'gem', 'royal', 'beryl'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 5678,
    username: 'RoyalGems',
    category: 'precious'
  },
  {
    filename: 'sapphire_blue_01.webp',
    title: 'Raw Sapphire',
    type: 'gem',
    description: 'Gem quality corundum. Deep blue variety prized throughout history.',
    tags: ['sapphire', 'blue', 'hard', 'gem', 'wisdom'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 4987,
    username: 'SapphireSeeker',
    category: 'precious'
  },
  {
    filename: 'opal_welo_fire_01.webp',
    title: 'Welo Opal',
    type: 'gem',
    description: 'Ethiopian opal known for vivid play-of-color against a translucent body.',
    tags: ['opal', 'fire', 'rainbow', 'flash', 'ethiopia'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 5432,
    username: 'OpalObsessed',
    category: 'precious'
  },

  // ============================================
  // === ORGANIC & EARTHY ===
  // ============================================
  {
    filename: 'moss_agate_forest_01.webp',
    title: 'Moss Agate',
    type: 'chalcedony',
    description: 'Clear stone with green dendritic inclusions that resemble moss or forests.',
    tags: ['agate', 'moss', 'green', 'nature', 'forest'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3456,
    username: 'ForestStones',
    category: 'organic'
  },
  {
    filename: 'ocean_jasper_orb_01.webp',
    title: 'Ocean Jasper',
    type: 'mineral',
    description: 'Rare orbicular jasper from Madagascar with circles and dots in multiple colors.',
    tags: ['jasper', 'circles', 'pattern', 'madagascar', 'rare'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 4123,
    username: 'OceanicGems',
    category: 'organic'
  },
  {
    filename: 'petrified_wood_ancient_01.webp',
    title: 'Petrified Wood',
    type: 'fossil',
    description: 'Ancient wood where organic material has been replaced by silicate minerals.',
    tags: ['petrified', 'wood', 'ancient', 'tree', 'fossil'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 2765,
    username: 'AncientWisdom',
    category: 'organic'
  },

  // ============================================
  // === COMMON COLLECTIBLES ===
  // ============================================
  {
    filename: 'tigers_eye_gold_01.webp',
    title: "Tiger's Eye",
    type: 'mineral',
    description: 'Chatoyant gemstone with a silky luster and golden to red-brown color.',
    tags: ['tigers eye', 'gold', 'chatoyancy', 'protection', 'grounding'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 2987,
    username: 'EverydayGems',
    category: 'common'
  },
  {
    filename: 'carnelian_ember_01.webp',
    title: 'Carnelian',
    type: 'mineral',
    description: 'Glassy, translucent orange-red chalcedony that glows like a dying ember.',
    tags: ['carnelian', 'orange', 'fire', 'vitality', 'sacral'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 2567,
    username: 'FireStones',
    category: 'common'
  },
  {
    filename: 'citrine_point_01.webp',
    title: 'Citrine',
    type: 'crystal',
    description: 'Yellow-to-orange quartz. Known as the Merchants Stone for attracting wealth.',
    tags: ['citrine', 'yellow', 'wealth', 'sun', 'quartz'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3456,
    username: 'WealthStones',
    category: 'common'
  },
  {
    filename: 'lapis_lazuli_01.webp',
    title: 'Lapis Lazuli',
    type: 'rock',
    description: 'Deep blue metamorphic rock with gold pyrite flecks. Stone of royalty and wisdom.',
    tags: ['lapis', 'blue', 'gold', 'royal', 'ancient'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 3456,
    username: 'RoyalStones',
    category: 'common'
  },
  {
    filename: 'sodalite_blue_01.webp',
    title: 'Sodalite',
    type: 'rock',
    description: 'Rich royal blue stone crossed with white calcite veins. Enhances intuition.',
    tags: ['sodalite', 'blue', 'white', 'intuition', 'logic'],
    source: 'Unsplash',
    license: 'CC0',
    url: 'https://unsplash.com',
    imageUrl: FALLBACK_IMAGE_URL,
    likes: 1987,
    username: 'BlueStones',
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
