import { useEffect, useState } from 'react'
import { CheckCircle, Sparkles, ArrowLeftRight } from 'lucide-react'

interface TradeCelebrationProps {
  yourRock: {
    name: string
    imageUrl: string
  }
  theirRock: {
    name: string
    imageUrl: string
  }
  onComplete: () => void
}

export function TradeCelebration({ yourRock, theirRock, onComplete }: TradeCelebrationProps) {
  const [phase, setPhase] = useState<'enter' | 'swap' | 'celebrate' | 'exit'>('enter')
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([])

  useEffect(() => {
    // Generate confetti
    const colors = ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5
    }))
    setConfetti(newConfetti)

    // Animation sequence
    const timers = [
      setTimeout(() => setPhase('swap'), 500),
      setTimeout(() => setPhase('celebrate'), 1500),
      setTimeout(() => setPhase('exit'), 4000),
      setTimeout(onComplete, 4500)
    ]

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm
                  transition-opacity duration-500 ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}
      onClick={onComplete}
    >
      {/* Confetti */}
      {phase === 'celebrate' && confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: '-5%',
            backgroundColor: piece.color,
            animation: `confetti-fall 3s linear ${piece.delay}s forwards`
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative">
        {/* Success icon */}
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 transition-all duration-500 ${
            phase === 'celebrate' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full" />
            <CheckCircle className="w-12 h-12 text-emerald-400 relative" />
          </div>
        </div>

        {/* Rock cards */}
        <div className="flex items-center gap-4">
          {/* Your rock */}
          <div
            className={`w-32 transition-all duration-700 ${
              phase === 'swap' || phase === 'celebrate' || phase === 'exit'
                ? 'translate-x-[72px] opacity-100'
                : phase === 'enter'
                ? '-translate-x-8 opacity-0'
                : 'opacity-100'
            }`}
          >
            <div className="bg-stone-800 rounded-xl overflow-hidden border-2 border-emerald-500">
              <img
                src={yourRock.imageUrl}
                alt={yourRock.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <p className="text-xs text-center text-stone-400 mt-2 truncate">
              {yourRock.name}
            </p>
          </div>

          {/* Swap icon */}
          <div
            className={`transition-all duration-500 ${
              phase === 'swap' ? 'scale-125 rotate-180' : 'scale-100 rotate-0'
            } ${phase === 'celebrate' ? 'opacity-0' : 'opacity-100'}`}
          >
            <ArrowLeftRight className="w-8 h-8 text-amber-400" />
          </div>

          {/* Their rock */}
          <div
            className={`w-32 transition-all duration-700 ${
              phase === 'swap' || phase === 'celebrate' || phase === 'exit'
                ? '-translate-x-[72px] opacity-100'
                : phase === 'enter'
                ? 'translate-x-8 opacity-0'
                : 'opacity-100'
            }`}
          >
            <div className="bg-stone-800 rounded-xl overflow-hidden border-2 border-amber-500">
              <img
                src={theirRock.imageUrl}
                alt={theirRock.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <p className="text-xs text-center text-stone-400 mt-2 truncate">
              {theirRock.name}
            </p>
          </div>
        </div>

        {/* Success message */}
        <div
          className={`text-center mt-8 transition-all duration-500 ${
            phase === 'celebrate' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-2xl font-serif font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Trade Complete!
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h2>
          <p className="text-stone-400 text-sm mt-2">
            Your new specimen awaits in your vault
          </p>
        </div>

        {/* Tap to continue */}
        <p
          className={`text-center text-xs text-stone-500 mt-6 transition-opacity duration-500 ${
            phase === 'celebrate' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Tap anywhere to continue
        </p>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
