import { useState, useRef } from 'react'
import { X, Camera, User, Loader, Check } from 'lucide-react'
import { compressImage } from '@/utils/imageCompression'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'
import type { UserProfile } from '@/types'

interface ProfileEditModalProps {
  profile: UserProfile
  onClose: () => void
  onSave: (updates: { displayName?: string; avatarUrl?: string; bio?: string }) => Promise<void>
}

const MAX_BIO_LENGTH = 200

export function ProfileEditModal({ profile, onClose, onSave }: ProfileEditModalProps) {
  const [displayName, setDisplayName] = useState(profile.displayName || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '')
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl || '')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { swipeProps } = useSwipeToDismiss({
    onDismiss: onClose,
    threshold: 100,
    direction: 'down'
  })

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image too large. Please select a smaller image.')
      return
    }

    setUploadingAvatar(true)
    setError(null)

    try {
      // Compress the image for storage
      const compressed = await compressImage(file)

      setAvatarUrl(compressed)
      setAvatarPreview(compressed)
    } catch (err) {
      console.error('Failed to process image:', err)
      setError('Failed to process image. Please try another.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const updates: { displayName?: string; avatarUrl?: string; bio?: string } = {}

      // Only include changed fields
      if (displayName.trim() !== (profile.displayName || '')) {
        updates.displayName = displayName.trim() || undefined
      }
      if (bio.trim() !== (profile.bio || '')) {
        updates.bio = bio.trim() || undefined
      }
      if (avatarUrl !== (profile.avatarUrl || '')) {
        updates.avatarUrl = avatarUrl || undefined
      }

      if (Object.keys(updates).length > 0) {
        await onSave(updates)
      }

      onClose()
    } catch (err) {
      console.error('Failed to save profile:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges =
    displayName.trim() !== (profile.displayName || '') ||
    bio.trim() !== (profile.bio || '') ||
    avatarUrl !== (profile.avatarUrl || '')

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div
        {...swipeProps}
        className="bg-stone-900 w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden animate-slide-up"
      >
        {/* Swipe Handle Indicator */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-stone-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
          <h3 className="font-serif font-bold text-white text-lg">Edit Profile</h3>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full
                       text-stone-500 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="relative group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-800 border-2 border-stone-700 group-hover:border-emerald-500 transition-colors">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-stone-500" />
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploadingAvatar ? (
                  <Loader className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="text-xs text-stone-500 mt-2">
              Tap to upload photo
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs text-stone-400 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3
                         text-white text-sm placeholder-stone-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs text-stone-400 mb-2">
              About Me
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself and your rock collecting interests..."
              maxLength={MAX_BIO_LENGTH}
              rows={3}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3
                         text-white text-sm resize-none placeholder-stone-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-[10px] text-stone-600 mt-1 text-right">
              {bio.length}/{MAX_BIO_LENGTH}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-900/30 border border-rose-800 rounded-lg p-3">
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700
                       disabled:cursor-not-allowed text-white rounded-xl font-bold
                       transition-colors flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-full py-3 text-stone-500 hover:text-white text-sm font-medium transition-colors min-h-[44px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
