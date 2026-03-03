import { useState, useEffect } from 'react'
import { Bell, X, Loader2 } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

interface NotificationPromptProps {
  onNavigateToTrades?: () => void
}

export function NotificationPrompt({ onNavigateToTrades }: NotificationPromptProps) {
  const { permission, supported, requestPermission } = useNotifications(onNavigateToTrades)
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    // Check if already dismissed this session
    const wasDismissed = sessionStorage.getItem('notification-prompt-dismissed')
    if (wasDismissed) {
      setDismissed(true)
      return
    }

    // Show after a delay if permission hasn't been granted/denied
    if (supported && permission === 'default') {
      const timer = setTimeout(() => setShow(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [supported, permission])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('notification-prompt-dismissed', 'true')
  }

  const handleEnable = async () => {
    setRequesting(true)
    try {
      await requestPermission()
      handleDismiss()
    } finally {
      setRequesting(false)
    }
  }

  if (!show || dismissed || permission !== 'default') return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up sm:left-auto sm:right-4 sm:w-80">
      <div className="bg-stone-800 border border-stone-700 rounded-xl p-4 shadow-2xl">
        <button
          onClick={handleDismiss}
          disabled={requesting}
          className="absolute top-2 right-2 p-1 text-stone-500 hover:text-stone-300 transition-colors disabled:opacity-50"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm">Enable Notifications</h3>
            <p className="text-stone-400 text-xs mt-1">
              Get notified when someone wants to trade with you. Your browser will show a permission prompt — choose Allow.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleEnable}
                disabled={requesting}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-70 flex items-center gap-1.5"
              >
                {requesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    Look for browser prompt…
                  </>
                ) : (
                  'Enable'
                )}
              </button>
              <button
                onClick={handleDismiss}
                disabled={requesting}
                className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
