import { MapPin, CheckCircle } from 'lucide-react'

interface SelfCollectedBadgeProps {
  size?: 'sm' | 'md'
}

export function SelfCollectedBadge({ size = 'md' }: SelfCollectedBadgeProps) {
  const sizeClasses = {
    sm: {
      container: 'px-1.5 py-0.5 space-x-1',
      icon: 'w-2.5 h-2.5',
      text: 'text-[8px]'
    },
    md: {
      container: 'px-2 py-1 space-x-1.5',
      icon: 'w-3 h-3',
      text: 'text-[10px]'
    }
  }

  const s = sizeClasses[size]

  return (
    <div
      className={`
        inline-flex items-center rounded-full
        bg-emerald-900/50 text-emerald-400 border border-emerald-800
        ${s.container}
      `}
    >
      <MapPin className={s.icon} />
      <CheckCircle className={s.icon} />
      <span className={`font-bold uppercase tracking-wider ${s.text}`}>
        Self-Collected
      </span>
    </div>
  )
}
