/**
 * Animated glow effects for rare and legendary items
 */

interface RarityGlowProps {
  score: number
  children: React.ReactNode
  className?: string
  intensity?: 'subtle' | 'normal' | 'intense'
}

function getGlowConfig(score: number) {
  if (score >= 9) {
    // Legendary - gold/amber glow with animation
    return {
      color: 'rgba(251, 191, 36, 0.4)', // amber-400
      shadowColor: 'rgba(251, 191, 36, 0.6)',
      animate: true,
      pulseSpeed: 2
    }
  } else if (score >= 7) {
    // Rare - purple glow
    return {
      color: 'rgba(167, 139, 250, 0.3)', // violet-400
      shadowColor: 'rgba(167, 139, 250, 0.5)',
      animate: true,
      pulseSpeed: 3
    }
  }
  return null
}

export function RarityGlow({ score, children, className = '', intensity = 'normal' }: RarityGlowProps) {
  const config = getGlowConfig(score)

  if (!config) {
    return <div className={className}>{children}</div>
  }

  const intensityMultiplier = {
    subtle: 0.5,
    normal: 1,
    intense: 1.5
  }[intensity]

  return (
    <div className={`relative ${className}`}>
      {/* Animated glow layer */}
      <div
        className="absolute -inset-1 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${config.color} 0%, transparent 70%)`,
          opacity: intensityMultiplier,
          animation: config.animate ? `glow-pulse ${config.pulseSpeed}s ease-in-out infinite` : 'none'
        }}
      />

      {/* Content */}
      <div className="relative">{children}</div>

      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            opacity: ${0.4 * intensityMultiplier};
            transform: scale(1);
          }
          50% {
            opacity: ${0.8 * intensityMultiplier};
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  )
}

// Border glow effect for cards
export function RarityBorderGlow({ score, children, className = '' }: Omit<RarityGlowProps, 'intensity'>) {
  const isLegendary = score >= 9
  const isRare = score >= 7

  if (!isRare) {
    return <div className={`h-full ${className}`}>{children}</div>
  }

  return (
    <div className={`relative h-full ${className}`}>
      {/* Animated border */}
      <div
        className={`absolute -inset-[1px] rounded-3xl ${
          isLegendary
            ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500'
            : 'bg-gradient-to-r from-violet-500 via-purple-400 to-violet-500'
        }`}
        style={{
          backgroundSize: '200% 100%',
          animation: 'border-shimmer 3s linear infinite'
        }}
      />

      {/* Content with background to create border effect */}
      <div className="relative h-full bg-stone-900 rounded-3xl">
        {children}
      </div>

      <style>{`
        @keyframes border-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}

// Sparkle overlay for legendary items
export function LegendarySparkles({ active = true }: { active?: boolean }) {
  if (!active) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-amber-300 rounded-full"
          style={{
            left: `${15 + (i * 15)}%`,
            top: `${10 + (i % 3) * 30}%`,
            animation: `sparkle-float ${2 + (i % 3) * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle-float {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
