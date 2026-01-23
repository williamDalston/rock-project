import { Mountain, Search, Repeat, Heart, Sparkles, Gem, Map } from 'lucide-react'

type EmptyStateType =
  | 'collection'
  | 'market'
  | 'trades'
  | 'wishlist'
  | 'search'
  | 'likes'
  | 'feed'

interface EmptyStateProps {
  type: EmptyStateType
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

// Custom SVG Illustrations
function CrystalIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Main crystal */}
      <path
        d="M100 20L150 70L100 180L50 70Z"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-30"
      />
      <path
        d="M50 70L100 95L150 70"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-20"
      />
      <path
        d="M100 95V180"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-20"
      />

      {/* Small crystals */}
      <path
        d="M30 90L45 105L30 140L15 105Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-20"
      />
      <path
        d="M170 85L185 100L170 130L155 100Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-20"
      />

      {/* Sparkles */}
      <circle cx="75" cy="35" r="3" fill="currentColor" className="opacity-40 animate-pulse" />
      <circle cx="135" cy="55" r="2" fill="currentColor" className="opacity-30 animate-pulse delay-200" />
      <circle cx="40" cy="60" r="2" fill="currentColor" className="opacity-30 animate-pulse delay-100" />
      <circle cx="160" cy="130" r="2" fill="currentColor" className="opacity-30 animate-pulse delay-300" />
    </svg>
  )
}

function SearchIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Magnifying glass */}
      <circle cx="85" cy="85" r="45" stroke="currentColor" strokeWidth="2" className="opacity-30" />
      <line
        x1="118" y1="118"
        x2="165" y2="165"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        className="opacity-30"
      />

      {/* Crystal inside */}
      <path
        d="M85 50L105 70L85 110L65 70Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-40"
      />

      {/* Question sparkles */}
      <circle cx="55" cy="50" r="3" fill="currentColor" className="opacity-30 animate-pulse" />
      <circle cx="120" cy="55" r="2" fill="currentColor" className="opacity-30 animate-pulse delay-200" />
    </svg>
  )
}

function TradeIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Left crystal */}
      <path d="M45 55L65 75L45 120L25 75Z" stroke="currentColor" strokeWidth="2" className="opacity-30" />

      {/* Right crystal */}
      <path d="M155 55L175 75L155 120L135 75Z" stroke="currentColor" strokeWidth="2" className="opacity-30" />

      {/* Arrows */}
      <path d="M75 65H125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
      <path d="M115 55L125 65L115 75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />

      <path d="M125 110H75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
      <path d="M85 100L75 110L85 120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />

      {/* Sparkles */}
      <circle cx="100" cy="87" r="4" fill="currentColor" className="opacity-30 animate-pulse" />
    </svg>
  )
}

function HeartCrystalIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Heart outline made of crystal facets */}
      <path
        d="M100 170C100 170 35 115 35 70C35 45 50 30 75 30C90 30 98 42 100 55C102 42 110 30 125 30C150 30 165 45 165 70C165 115 100 170 100 170Z"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-30"
      />

      {/* Inner facets */}
      <path d="M100 55L80 80L100 130L120 80Z" stroke="currentColor" strokeWidth="1.5" className="opacity-20" />

      {/* Sparkles */}
      <circle cx="65" cy="55" r="3" fill="currentColor" className="opacity-40 animate-pulse" />
      <circle cx="135" cy="55" r="3" fill="currentColor" className="opacity-40 animate-pulse delay-200" />
      <circle cx="100" cy="100" r="2" fill="currentColor" className="opacity-30 animate-pulse delay-100" />
    </svg>
  )
}

function MapIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Map outline */}
      <rect x="30" y="40" width="140" height="100" rx="4" stroke="currentColor" strokeWidth="2" className="opacity-30" />

      {/* Fold lines */}
      <line x1="77" y1="40" x2="77" y2="140" stroke="currentColor" strokeWidth="1" className="opacity-15" />
      <line x1="123" y1="40" x2="123" y2="140" stroke="currentColor" strokeWidth="1" className="opacity-15" />

      {/* Mountains/terrain */}
      <path d="M45 110L65 80L85 100L100 75L115 95L135 70L155 100" stroke="currentColor" strokeWidth="1.5" className="opacity-25" />

      {/* Pin marker */}
      <path d="M100 55L110 70L100 90L90 70Z" fill="currentColor" className="opacity-40" />
      <circle cx="100" cy="65" r="5" stroke="currentColor" strokeWidth="1.5" className="opacity-30" />

      {/* Sparkles */}
      <circle cx="60" cy="60" r="2" fill="currentColor" className="opacity-30 animate-pulse" />
      <circle cx="140" cy="85" r="2" fill="currentColor" className="opacity-30 animate-pulse delay-200" />
    </svg>
  )
}

function CameraIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Camera body */}
      <rect x="30" y="55" width="140" height="95" rx="12" stroke="currentColor" strokeWidth="2" className="opacity-30" />
      <rect x="65" y="40" width="70" height="20" rx="5" stroke="currentColor" strokeWidth="2" className="opacity-25" />

      {/* Lens */}
      <circle cx="100" cy="102" r="32" stroke="currentColor" strokeWidth="2" className="opacity-30" />
      <circle cx="100" cy="102" r="20" stroke="currentColor" strokeWidth="1.5" className="opacity-20" />

      {/* Crystal in viewfinder */}
      <path d="M100 85L112 97L100 122L88 97Z" stroke="currentColor" strokeWidth="1.5" className="opacity-40" />

      {/* Flash */}
      <circle cx="150" cy="72" r="8" stroke="currentColor" strokeWidth="1.5" className="opacity-25" />

      {/* Sparkle */}
      <circle cx="100" cy="102" r="4" fill="currentColor" className="opacity-30 animate-pulse" />
    </svg>
  )
}

const EMPTY_STATE_CONFIG: Record<EmptyStateType, {
  icon: React.ReactNode
  illustration: React.ReactNode
  title: string
  description: string
  color: string
}> = {
  collection: {
    icon: <Mountain className="w-12 h-12" />,
    illustration: <CameraIllustration className="w-40 h-40 text-emerald-500" />,
    title: 'Your vault echoes with emptiness',
    description: 'Every great collection starts with a single specimen. Time to hunt!',
    color: 'text-emerald-500'
  },
  market: {
    icon: <Gem className="w-12 h-12" />,
    illustration: <CrystalIllustration className="w-40 h-40 text-violet-500" />,
    title: 'The stratum lies dormant',
    description: 'No specimens in the market yet. Be the first to share a discovery!',
    color: 'text-violet-500'
  },
  trades: {
    icon: <Repeat className="w-12 h-12" />,
    illustration: <TradeIllustration className="w-40 h-40 text-amber-500" />,
    title: 'No trades in motion',
    description: 'Your trading post awaits its first exchange. Browse the market to propose a swap!',
    color: 'text-amber-500'
  },
  wishlist: {
    icon: <Sparkles className="w-12 h-12" />,
    illustration: <HeartCrystalIllustration className="w-40 h-40 text-rose-500" />,
    title: 'Dream specimens await',
    description: 'Create a wishlist and let the community help you find your perfect piece.',
    color: 'text-rose-500'
  },
  search: {
    icon: <Search className="w-12 h-12" />,
    illustration: <SearchIllustration className="w-40 h-40 text-stone-500" />,
    title: 'No specimens unearthed',
    description: 'Try adjusting your search or exploring different filters.',
    color: 'text-stone-500'
  },
  likes: {
    icon: <Heart className="w-12 h-12" />,
    illustration: <HeartCrystalIllustration className="w-40 h-40 text-rose-500" />,
    title: 'No favorites yet',
    description: 'Double-tap specimens you love to add them here.',
    color: 'text-rose-500'
  },
  feed: {
    icon: <Map className="w-12 h-12" />,
    illustration: <MapIllustration className="w-40 h-40 text-cyan-500" />,
    title: 'The earth keeps its secrets',
    description: 'Check back soon for fresh geological discoveries.',
    color: 'text-cyan-500'
  }
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const config = EMPTY_STATE_CONFIG[type]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
      {/* Background illustration */}
      <div className="relative mb-2">
        {/* Illustration */}
        <div className="animate-float">
          {config.illustration}
        </div>
      </div>

      {/* Icon badge */}
      <div className={`relative ${config.color} mb-4`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 ${config.color} opacity-20 blur-xl`} />

        {/* Icon with ring */}
        <div className="relative w-16 h-16 rounded-full bg-stone-900/80 border border-stone-700 flex items-center justify-center">
          {config.icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl text-white mb-2">
        {title || config.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-stone-400 max-w-xs leading-relaxed mb-6">
        {description || config.description}
      </p>

      {/* Optional action button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-3 rounded-xl font-bold text-sm
                     bg-gradient-to-r from-emerald-600 to-emerald-500
                     hover:from-emerald-500 hover:to-emerald-400
                     text-white shadow-lg shadow-emerald-900/30
                     transition-all duration-200 hover:scale-105 active:scale-95`}
        >
          {action.label}
        </button>
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
