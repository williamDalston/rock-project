import { useState, useEffect } from 'react'
import { Hexagon } from 'lucide-react'

const LOADING_MESSAGES = [
  'Excavating data...',
  'Polishing results...',
  'Analyzing crystal structure...',
  'Consulting the stratum...',
  'Unearthing specimens...',
  'Scanning mineral deposits...',
  'Decoding geological layers...',
  'Calibrating the spectrometer...',
  'Traversing fault lines...',
  'Mining the database...',
  'Crystallizing information...',
  'Pressurizing data cores...',
  'Extracting rare findings...',
  'Surveying the collection...',
  'Mapping tectonic data...',
]

interface GeologicalLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  showMessage?: boolean
  message?: string
  className?: string
}

export function GeologicalLoader({
  size = 'md',
  showMessage = true,
  message,
  className = ''
}: GeologicalLoaderProps) {
  const [currentMessage, setCurrentMessage] = useState(
    message || LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  )

  useEffect(() => {
    if (message) return // Don't rotate if custom message provided

    const interval = setInterval(() => {
      setCurrentMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)])
    }, 2500)

    return () => clearInterval(interval)
  }, [message])

  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-[10px]', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-xs', gap: 'gap-3' },
    lg: { icon: 'w-16 h-16', text: 'text-sm', gap: 'gap-4' }
  }

  const sizeClass = sizeClasses[size]

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClass.gap} ${className}`}>
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />

        {/* Spinning hexagon */}
        <Hexagon
          className={`${sizeClass.icon} text-emerald-500 animate-spin relative`}
          strokeWidth={1.5}
          style={{ animationDuration: '3s' }}
        />

        {/* Inner pulse */}
        <div
          className={`absolute inset-0 flex items-center justify-center`}
        >
          <div className="w-1/2 h-1/2 bg-emerald-500/30 rounded-full animate-ping" />
        </div>
      </div>

      {showMessage && (
        <p
          className={`${sizeClass.text} text-emerald-400/80 uppercase tracking-widest text-center
                      animate-pulse transition-all duration-300`}
        >
          {currentMessage}
        </p>
      )}
    </div>
  )
}

// Inline loader for buttons/small spaces
export function InlineLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

// Full page loader
export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950">
      <GeologicalLoader size="lg" message={message} />
    </div>
  )
}
