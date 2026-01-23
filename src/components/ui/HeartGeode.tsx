import { useState } from 'react'

interface HeartGeodeProps {
  isLiked: boolean
  count: number
  onToggle: () => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function HeartGeode({ isLiked, count, onToggle, disabled, size = 'md' }: HeartGeodeProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (disabled) return

    setIsAnimating(true)
    onToggle()

    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 600)
  }

  const sizeClasses = {
    sm: {
      button: 'space-x-1 px-2 py-1 rounded-full min-h-[28px]',
      svg: 'w-4 h-4',
      text: 'text-[10px]'
    },
    md: {
      button: 'space-x-2 px-4 py-2.5 rounded-full min-h-[44px]',
      svg: 'w-6 h-6',
      text: 'text-sm'
    }
  }

  const sizeClass = sizeClasses[size]

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative flex items-center ${sizeClass.button}
        transition-all duration-300 group active:scale-95
        ${isLiked
          ? 'bg-rose-500/20 text-rose-400'
          : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-rose-400 active:bg-stone-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      aria-pressed={isLiked}
    >
      {/* Geode SVG */}
      <svg
        viewBox="0 0 24 24"
        className={`
          ${sizeClass.svg} transition-transform duration-300
          ${isAnimating ? 'animate-geode-crack' : ''}
          ${isLiked ? 'scale-110' : 'group-hover:scale-105'}
        `}
        style={{ willChange: isAnimating ? 'transform' : 'auto' }}
        fill="none"
        strokeWidth="1.5"
      >
        {/* Outer geode shell */}
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          className={`
            transition-all duration-300
            ${isLiked
              ? 'fill-rose-500 stroke-rose-400'
              : 'fill-stone-700 stroke-stone-500'
            }
          `}
        />

        {/* Crystal interior (visible when liked) */}
        {isLiked && (
          <>
            <path
              d="M12 7l2 4-2 3-2-3 2-4z"
              className="fill-rose-300 animate-pulse"
            />
            <path
              d="M9 10l1.5 3h3L15 10"
              className="stroke-rose-200"
              strokeWidth="0.5"
            />
            {/* Sparkle effects */}
            <circle cx="8" cy="8" r="0.5" className="fill-white animate-sparkle" />
            <circle cx="16" cy="9" r="0.5" className="fill-white animate-sparkle delay-100" />
            <circle cx="12" cy="14" r="0.5" className="fill-white animate-sparkle delay-200" />
          </>
        )}
      </svg>

      {/* Like count */}
      <span className={`
        ${sizeClass.text} font-bold tabular-nums
        transition-all duration-300
        ${isAnimating ? 'scale-125' : ''}
      `}>
        {count > 0 ? count : ''}
      </span>

      {/* Particle burst effect on like */}
      {isAnimating && isLiked && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 bg-rose-400 rounded-full animate-burst"
              style={{
                left: '50%',
                top: '50%',
                animationDelay: `${i * 50}ms`,
                transform: `rotate(${i * 60}deg) translateY(-20px)`
              }}
            />
          ))}
        </div>
      )}
    </button>
  )
}
