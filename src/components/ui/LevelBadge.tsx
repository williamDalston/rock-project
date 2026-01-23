import { Shield } from 'lucide-react'
import type { GeologistTitle } from '@/types'
import { TITLE_STYLES } from '@/constants'

interface LevelBadgeProps {
  level: number
  title: GeologistTitle
  size?: 'sm' | 'md' | 'lg'
  showTitle?: boolean
}

export function LevelBadge({ level, title, size = 'md', showTitle = true }: LevelBadgeProps) {
  const styles = TITLE_STYLES[title]

  const sizeClasses = {
    sm: {
      container: 'py-1 px-2 space-x-1.5',
      icon: 'w-3 h-3',
      text: 'text-[10px]'
    },
    md: {
      container: 'py-1.5 px-3 space-x-2',
      icon: 'w-3.5 h-3.5',
      text: 'text-xs'
    },
    lg: {
      container: 'py-2 px-4 space-x-2.5',
      icon: 'w-4 h-4',
      text: 'text-sm'
    }
  }

  const s = sizeClasses[size]

  return (
    <div
      className={`
        inline-flex items-center rounded-full border
        ${styles.bg} ${styles.text} ${styles.border}
        ${s.container}
      `}
    >
      <Shield className={s.icon} fill="currentColor" />
      <span className={`font-bold ${s.text}`}>
        Lvl {level}
        {showTitle && <span className="ml-1 opacity-75">{title}</span>}
      </span>
    </div>
  )
}

interface LevelBadgeCompactProps {
  level: number
  title: GeologistTitle
}

export function LevelBadgeCompact({ level, title }: LevelBadgeCompactProps) {
  const styles = TITLE_STYLES[title]

  return (
    <div
      className={`
        inline-flex items-center space-x-1 py-0.5 px-1.5 rounded
        ${styles.bg} ${styles.text} border ${styles.border}
      `}
    >
      <Shield className="w-2.5 h-2.5" fill="currentColor" />
      <span className="text-[9px] font-bold">{level}</span>
    </div>
  )
}
