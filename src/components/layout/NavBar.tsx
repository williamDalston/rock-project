import { useState, useEffect } from 'react'
import { Globe, Book, ScanLine } from 'lucide-react'
import type { ViewType } from '@/types'

interface NavBarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  onScan: (e: React.ChangeEvent<HTMLInputElement>) => void
  scanInputRef?: React.MutableRefObject<HTMLInputElement | null>
}

export function NavBar({ currentView, onViewChange, onScan, scanInputRef }: NavBarProps) {
  const [showScanHint, setShowScanHint] = useState(false)

  // Show scan hint for first-time users
  useEffect(() => {
    const hasScanned = localStorage.getItem('lithos_has_scanned')
    if (!hasScanned) {
      // Delay showing hint to let onboarding complete first
      const timer = setTimeout(() => setShowScanHint(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('lithos_has_scanned', 'true')
    setShowScanHint(false)
    onScan(e)
  }
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-stone-950/90 backdrop-blur-xl border-t border-stone-800 z-50 pb-safe"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center px-2 py-2 max-w-lg mx-auto">
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

        <div className="relative -top-5 flex flex-col items-center">
          {/* Scan hint tooltip for new users */}
          {showScanHint && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
              <div className="bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg">
                Identify with AI — tap to scan!
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-600 rotate-45" />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => scanInputRef?.current?.click()}
            className={`bg-gradient-to-tr from-emerald-500 to-emerald-700 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/50 border-4 border-stone-950 cursor-pointer hover:scale-105 transition-transform active:scale-95 ${
              showScanHint ? 'ring-4 ring-emerald-400/50 ring-offset-2 ring-offset-stone-950' : ''
            }`}
            aria-label="Scan new rock specimen"
          >
            <ScanLine className="w-7 h-7 text-white" aria-hidden="true" />
          </button>
          <input
            ref={scanInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleScan}
            className="hidden"
            aria-label="Upload rock photo for AI identification"
          />
          <span className="text-[10px] font-bold tracking-wider uppercase mt-2 text-emerald-400">
            Identify
          </span>
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
