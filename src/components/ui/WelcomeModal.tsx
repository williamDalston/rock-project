import { useState } from 'react'
import { ScanLine, Globe, Book, Sparkles, ChevronRight, X } from 'lucide-react'

interface WelcomeModalProps {
  onComplete: () => void
}

const STEPS = [
  {
    icon: <Sparkles className="w-10 h-10" />,
    title: 'Welcome to Lithos',
    description: 'Your AI-powered rock & mineral identification companion. Discover, collect, and trade geological specimens with fellow enthusiasts.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  },
  {
    icon: <ScanLine className="w-10 h-10" />,
    title: 'Scan Any Rock',
    description: 'Tap the scan button to photograph any rock or mineral. Our AI will identify it, estimate its rarity, and add it to your collection.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10'
  },
  {
    icon: <Globe className="w-10 h-10" />,
    title: 'Explore the Market',
    description: 'Browse specimens shared by collectors worldwide. Like your favorites, propose trades, and build your reputation.',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10'
  },
  {
    icon: <Book className="w-10 h-10" />,
    title: 'Build Your Vault',
    description: 'Your personal collection grows with every scan. Track self-collected finds, earn XP, and level up as a geologist.',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10'
  }
]

export function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const isLastStep = currentStep === STEPS.length - 1
  const step = STEPS[currentStep]

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                     text-stone-500 hover:text-white transition-colors rounded-full
                     hover:bg-stone-800"
          aria-label="Skip onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Content */}
        <div className="text-center">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${step.bgColor} ${step.color} mb-6`}>
            {step.icon}
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl font-bold text-white mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-stone-400 leading-relaxed mb-8 px-4">
            {step.description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            {STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-6 bg-emerald-500'
                    : index < currentStep
                    ? 'bg-emerald-700'
                    : 'bg-stone-700'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl
                       font-bold text-base transition-colors flex items-center justify-center space-x-2
                       active:scale-[0.98]"
          >
            <span>{isLastStep ? "Let's Go!" : 'Next'}</span>
            {!isLastStep && <ChevronRight className="w-5 h-5" />}
          </button>

          {/* Skip Text */}
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="mt-4 text-sm text-stone-500 hover:text-stone-300 transition-colors"
            >
              Skip intro
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
