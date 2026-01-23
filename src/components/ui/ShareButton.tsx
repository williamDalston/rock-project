import { useState } from 'react'
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle } from 'lucide-react'

interface ShareButtonProps {
  title: string
  text: string
  url?: string
  imageUrl?: string
  rockName: string
  rockType?: string
  className?: string
  variant?: 'icon' | 'button'
}

export function ShareButton({
  title,
  text,
  url,
  rockName,
  rockType,
  className = '',
  variant = 'icon'
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate share URL - in a real app this would be a deep link to the rock
  const shareUrl = url || `https://www.lithoshub.com/?rock=${encodeURIComponent(rockName)}`

  // Generate share text
  const shareText = text || `Check out this ${rockType || 'rock'}: ${rockName} - identified with Lithos AI!`

  const handleShare = async () => {
    // Try native Web Share API first (works great on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl
        })
        return
      } catch (err) {
        // User cancelled or share failed - fall through to menu
        if ((err as Error).name === 'AbortError') return
      }
    }

    // Fallback: show share menu
    setShowMenu(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = `${shareText}\n\n${shareUrl}`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 2000)
    }
  }

  const shareToTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(tweetUrl, '_blank', 'width=550,height=420')
    setShowMenu(false)
  }

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(fbUrl, '_blank', 'width=550,height=420')
    setShowMenu(false)
  }

  const shareToWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    window.open(waUrl, '_blank')
    setShowMenu(false)
  }

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleShare}
          className={`p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors ${className}`}
          aria-label="Share this rock"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Share Menu Dropdown */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-stone-900 border border-stone-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-2 border-b border-stone-800">
                <p className="text-xs text-stone-500 px-2">Share to</p>
              </div>

              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4 text-sky-400" />
                <span className="text-sm">Twitter / X</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Facebook</span>
              </button>

              <button
                onClick={shareToWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">WhatsApp</span>
              </button>

              <div className="border-t border-stone-800">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Button variant
  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 hover:text-white transition-colors ${className}`}
    >
      <Share2 className="w-4 h-4" />
      <span className="text-sm font-medium">Share</span>
    </button>
  )
}

// Utility function to generate share data for a rock
export function generateRockShareData(rock: {
  name: string
  type?: string
  rarityScore?: number
  imageUrl?: string
  id?: string
}) {
  const rarityText = rock.rarityScore && rock.rarityScore >= 7
    ? ` (Rarity: ${rock.rarityScore}/10!)`
    : ''

  return {
    title: `${rock.name} - Lithos`,
    text: `Check out this ${rock.type || 'specimen'}: ${rock.name}${rarityText} - identified with Lithos AI!`,
    url: rock.id
      ? `https://www.lithoshub.com/rock/${rock.id}`
      : `https://www.lithoshub.com/?rock=${encodeURIComponent(rock.name)}`,
    rockName: rock.name,
    rockType: rock.type
  }
}
