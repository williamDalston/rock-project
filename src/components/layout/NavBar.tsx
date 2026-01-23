import { Globe, Book, ScanLine } from 'lucide-react'
import type { ViewType } from '@/types'

interface NavBarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  onScan: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function NavBar({ currentView, onViewChange, onScan }: NavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-950/90 backdrop-blur-xl border-t border-stone-800 z-50 pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        <button
          onClick={() => onViewChange('market')}
          className={`flex flex-col items-center space-y-1 ${
            currentView === 'market' ? 'text-emerald-400' : 'text-stone-500'
          }`}
        >
          <Globe
            className="w-6 h-6"
            strokeWidth={currentView === 'market' ? 2.5 : 2}
          />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Market
          </span>
        </button>

        <div className="relative -top-5">
          <label className="bg-gradient-to-tr from-emerald-500 to-emerald-700 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/50 border-4 border-stone-950 cursor-pointer hover:scale-105 transition-transform active:scale-95">
            <ScanLine className="w-7 h-7 text-white" />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onScan}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={() => onViewChange('collection')}
          className={`flex flex-col items-center space-y-1 ${
            currentView === 'collection' ? 'text-emerald-400' : 'text-stone-500'
          }`}
        >
          <Book
            className="w-6 h-6"
            strokeWidth={currentView === 'collection' ? 2.5 : 2}
          />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Vault
          </span>
        </button>
      </div>
    </div>
  )
}
