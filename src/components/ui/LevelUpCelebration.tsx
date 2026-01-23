import { useEffect, useState, useCallback } from 'react'
import { Sparkles, Crown, Star, Trophy } from 'lucide-react'

interface LevelUpCelebrationProps {
  level: number
  title: string
  onComplete: () => void
}

// Confetti colors - crystal/gem themed
const CONFETTI_COLORS = [
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#eab308', // yellow
  '#ef4444', // red
  '#3b82f6', // blue
]

interface ConfettiPiece {
  id: number
  x: number
  delay: number
  color: string
  size: number
  rotation: number
  shape: 'circle' | 'square' | 'triangle'
}

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1500,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 10 + 6,
    rotation: Math.random() * 360,
    shape: (['circle', 'square', 'triangle'] as const)[Math.floor(Math.random() * 3)],
  }))
}

export function LevelUpCelebration({ level, title, onComplete }: LevelUpCelebrationProps) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter')
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate confetti and particles
    setConfetti(generateConfetti(60))
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5
    }))
    setParticles(newParticles)

    // Animation phases
    const enterTimer = setTimeout(() => setPhase('show'), 100)
    const exitTimer = setTimeout(() => setPhase('exit'), 4000)
    const completeTimer = setTimeout(onComplete, 4500)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const handleComplete = useCallback(() => {
    setPhase('exit')
    setTimeout(onComplete, 500)
  }, [onComplete])

  // Get title-specific styling
  const getTitleStyle = (titleName: string) => {
    const styles: Record<string, { emoji: string; color: string }> = {
      'Pebble Pup': { emoji: '🪨', color: 'text-stone-400' },
      'Rockhound': { emoji: '🔍', color: 'text-emerald-400' },
      'Field Collector': { emoji: '⛏️', color: 'text-violet-400' },
      'Master Geologist': { emoji: '💎', color: 'text-amber-300' },
    }
    return styles[titleName] || { emoji: '🌟', color: 'text-amber-400' }
  }

  const titleStyle = getTitleStyle(title)

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center
                  transition-opacity duration-500 ${phase === 'enter' ? 'opacity-0' : phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleComplete}
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Confetti rain */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="fixed pointer-events-none"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.shape === 'triangle' ? 0 : piece.size,
            backgroundColor: piece.shape !== 'triangle' ? piece.color : 'transparent',
            borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'square' ? '2px' : 0,
            borderLeft: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : undefined,
            borderRight: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : undefined,
            borderBottom: piece.shape === 'triangle' ? `${piece.size}px solid ${piece.color}` : undefined,
            animation: `confetti-fall 3s ease-out ${piece.delay}ms forwards`,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: phase === 'show' ? 1 : 0,
          }}
        />
      ))}

      {/* Rising particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `hsl(${45 + Math.random() * 30}, 100%, ${60 + Math.random() * 20}%)`,
            animation: `particle-float 2s ease-out ${particle.delay}s forwards`,
            opacity: phase === 'show' ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />
      ))}

      {/* Main content */}
      <div
        className={`text-center transform transition-all duration-700 relative z-10 ${
          phase === 'show' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 -m-32 bg-amber-500/20 blur-3xl rounded-full animate-pulse" />

        {/* Trophy/Crown icon */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center relative animate-bounce">
            {level >= 25 ? (
              <Crown className="w-12 h-12 text-white drop-shadow-lg" />
            ) : (
              <Trophy className="w-12 h-12 text-white drop-shadow-lg" />
            )}
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-300 animate-sparkle-1" />
          <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-amber-300 animate-sparkle-2" />
          <Star className="absolute top-0 -left-4 w-5 h-5 text-yellow-300 animate-sparkle-3" />
        </div>

        {/* Level number with gradient */}
        <div className="relative mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 blur-xl" />
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 relative">
            Level {level}!
          </h1>
        </div>

        {/* Title with emoji */}
        <div className="mb-4">
          <span className="text-stone-400 text-sm">New Title</span>
          <p className={`text-2xl font-serif font-bold ${titleStyle.color} flex items-center justify-center gap-2`}>
            <span>{titleStyle.emoji}</span>
            <span>{title}</span>
          </p>
        </div>

        {/* Motivational message */}
        <p className="text-stone-300 text-sm max-w-xs mx-auto mb-6">
          {level < 10
            ? 'Your collection is growing! Keep hunting!'
            : level < 25
            ? 'You\'re becoming a true rockhound!'
            : level < 50
            ? 'Your expertise is impressive!'
            : 'You have mastered the mineral realm!'}
        </p>

        {/* Stars decoration */}
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(Math.min(Math.ceil(level / 10), 5))].map((_, i) => (
            <Star
              key={i}
              className="w-6 h-6 text-amber-400 fill-amber-400"
              style={{
                animation: `star-pop 0.3s ease-out ${i * 0.1}s forwards`,
                opacity: 0,
                transform: 'scale(0)'
              }}
            />
          ))}
        </div>

        {/* Continue button */}
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500
                     text-white font-bold rounded-xl shadow-lg shadow-amber-900/30
                     transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Continue
        </button>

        {/* Skip hint */}
        <p className="mt-4 text-xs text-stone-500">
          Tap anywhere to dismiss
        </p>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes particle-float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }
        @keyframes star-pop {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Hook to manage level up celebration state
 */
export function useLevelUpCelebration() {
  const [celebration, setCelebration] = useState<{
    level: number
    title: string
  } | null>(null)

  const celebrate = useCallback((level: number, title: string) => {
    setCelebration({ level, title })
  }, [])

  const closeCelebration = useCallback(() => {
    setCelebration(null)
  }, [])

  return {
    celebration,
    celebrate,
    closeCelebration,
  }
}
