import { Globe, Book, ScanLine } from 'lucide-react'
import type { ViewType } from '@/types'

interface NavBarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  onScan: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function NavBar({ currentView, onViewChange, onScan }: NavBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-stone-950/90 backdrop-blur-xl border-t border-stone-800 z-50 pb-safe"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center px-2 py-2">
        <button
          onClick={() => onViewChange('market')}
          aria-label="Market feed"
          aria-current={currentView === 'market' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
            currentView === 'market'
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-stone-400 hover:text-stone-300 hover:bg-stone-800/50'
          }`}
        >
          <Globe
            className="w-6 h-6"
            strokeWidth={currentView === 'market' ? 2.5 : 2}
          />
          <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">
            Market
          </span>
        </button>

        <div className="relative -top-5">
          <label
            className="bg-gradient-to-tr from-emerald-500 to-emerald-700 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/50 border-4 border-stone-950 cursor-pointer hover:scale-105 transition-transform active:scale-95"
            aria-label="Scan new rock specimen"
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.currentTarget.querySelector('input')?.click()
              }
            }}
          >
            <ScanLine className="w-7 h-7 text-white" aria-hidden="true" />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onScan}
              className="hidden"
              aria-label="Upload rock photo"
            />
          </label>
        </div>

        <button
          onClick={() => onViewChange('collection')}
          aria-label="My rock collection"
          aria-current={currentView === 'collection' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
            currentView === 'collection'
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-stone-400 hover:text-stone-300 hover:bg-stone-800/50'
          }`}
        >
          <Book
            className="w-6 h-6"
            strokeWidth={currentView === 'collection' ? 2.5 : 2}
          />
          <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">
            Vault
          </span>
        </button>
      </div>
    </nav>
  )
}
