import { useState, useEffect } from 'react'
import { X, Mail, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSignInWithGoogle: () => Promise<void>
  onSignInWithEmail: (email: string, password: string) => Promise<void>
  onSignUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  onResetPassword: (email: string) => Promise<void>
  error: Error | null
  clearError: () => void
  loading: boolean
  isAnonymous: boolean
  onUpgradeAccount?: (method: 'google' | 'email', email?: string, password?: string) => Promise<void>
}

type AuthView = 'main' | 'email-signin' | 'email-signup' | 'reset-password'

export function AuthModal({
  isOpen,
  onClose,
  onSignInWithGoogle,
  onSignInWithEmail,
  onSignUpWithEmail,
  onResetPassword,
  error,
  clearError,
  loading,
  isAnonymous,
  onUpgradeAccount
}: AuthModalProps) {
  const [view, setView] = useState<AuthView>('main')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    setView('main')
    setEmail('')
    setPassword('')
    setDisplayName('')
    setResetSent(false)
    clearError()
    onClose()
  }

  const handleBack = () => {
    setView('main')
    setEmail('')
    setPassword('')
    setDisplayName('')
    setResetSent(false)
    clearError()
  }

  const handleGoogleSignIn = async () => {
    if (isAnonymous && onUpgradeAccount) {
      await onUpgradeAccount('google')
    } else {
      await onSignInWithGoogle()
    }
    if (!error) handleClose()
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSignInWithEmail(email, password)
    if (!error) handleClose()
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isAnonymous && onUpgradeAccount) {
      await onUpgradeAccount('email', email, password)
    } else {
      await onSignUpWithEmail(email, password, displayName)
    }
    if (!error) handleClose()
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onResetPassword(email)
      setResetSent(true)
    } catch {
      // Error handled by hook
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-stone-900 rounded-2xl w-full max-w-md overflow-hidden border border-stone-700/50 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-700/50">
          {view !== 'main' ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-stone-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}
          <h2 id="auth-modal-title" className="text-lg font-semibold text-white">
            {view === 'main' && (isAnonymous ? 'Create Account' : 'Sign In')}
            {view === 'email-signin' && 'Sign In with Email'}
            {view === 'email-signup' && 'Create Account'}
            {view === 'reset-password' && 'Reset Password'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error.message}
            </div>
          )}

          {/* Main View */}
          {view === 'main' && (
            <div className="space-y-3">
              {isAnonymous && (
                <p className="text-stone-400 text-sm text-center mb-4">
                  Save your collection and access it from any device
                </p>
              )}

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-stone-100 text-stone-900 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-stone-900 text-stone-500">or</span>
                </div>
              </div>

              {/* Email Options */}
              <button
                onClick={() => setView('email-signin')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-xl transition-colors"
              >
                <Mail className="w-5 h-5" />
                Sign in with Email
              </button>

              <button
                onClick={() => setView('email-signup')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors"
              >
                Create new account
              </button>
            </div>
          )}

          {/* Email Sign In View */}
          {view === 'email-signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-stone-300 mb-1">
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-stone-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 pr-12"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => setView('reset-password')}
                className="w-full text-sm text-amber-500 hover:text-amber-400"
              >
                Forgot your password?
              </button>
            </form>
          )}

          {/* Email Sign Up View */}
          {view === 'email-signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-stone-300 mb-1">
                  Display Name (optional)
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-stone-300 mb-1">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-stone-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 pr-12"
                    placeholder="At least 6 characters"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>
          )}

          {/* Reset Password View */}
          {view === 'reset-password' && (
            <div className="space-y-4">
              {resetSent ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Check your email</h3>
                  <p className="text-stone-400 text-sm">
                    We've sent a password reset link to {email}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-stone-400 text-sm">
                    Enter your email and we'll send you a link to reset your password.
                  </p>

                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-stone-300 mb-1">
                      Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
