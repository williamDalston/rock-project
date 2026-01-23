import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react'
import type { AIConfidence, PhysicalTest } from '@/types'
import { CONFIDENCE_THRESHOLDS } from '@/constants'

interface ConfidenceMeterProps {
  confidence: AIConfidence
  physicalTest?: PhysicalTest
  onTestComplete?: () => void
}

export function ConfidenceMeter({ confidence, physicalTest, onTestComplete }: ConfidenceMeterProps) {
  const probability = confidence.primary.probability
  const percentage = Math.round(probability * 100)

  // Determine confidence level
  const level = probability >= CONFIDENCE_THRESHOLDS.HIGH
    ? 'high'
    : probability >= CONFIDENCE_THRESHOLDS.MEDIUM
    ? 'medium'
    : 'low'

  const levelConfig = {
    high: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500',
      barColor: 'bg-emerald-400',
      icon: CheckCircle,
      label: 'High Confidence'
    },
    medium: {
      color: 'text-amber-400',
      bgColor: 'bg-amber-500',
      barColor: 'bg-amber-400',
      icon: HelpCircle,
      label: 'Moderate Confidence'
    },
    low: {
      color: 'text-rose-400',
      bgColor: 'bg-rose-500',
      barColor: 'bg-rose-400',
      icon: AlertTriangle,
      label: 'Low Confidence'
    }
  }

  const config = levelConfig[level]
  const Icon = config.icon

  return (
    <div className="bg-stone-900/50 rounded-xl border border-stone-800 overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
            {config.label}
          </span>
        </div>
        <span className={`text-lg font-bold ${config.color}`}>
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="px-3 py-2">
        <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${config.barColor} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Primary Identification */}
      <div className="px-3 py-2 border-t border-stone-800">
        <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Primary ID</p>
        <p className="text-sm font-medium text-white">{confidence.primary.name}</p>
      </div>

      {/* Alternatives (if any) */}
      {confidence.alternatives.length > 0 && (
        <div className="px-3 py-2 border-t border-stone-800">
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Alternatives</p>
          <div className="space-y-1">
            {confidence.alternatives.map((alt, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-stone-400">{alt.name}</span>
                <span className="text-xs text-stone-500">
                  {Math.round(alt.probability * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Physical Test Card (shown for low/medium confidence) */}
      {level !== 'high' && physicalTest && (
        <div className="p-3 bg-amber-900/20 border-t border-amber-800/50">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                {physicalTest.testName}
              </p>
              <p className="text-xs text-amber-200/80 leading-relaxed mb-2">
                {physicalTest.instruction}
              </p>
              <p className="text-xs text-stone-400 italic mb-3">
                Expected: {physicalTest.expectedResult}
              </p>
              {onTestComplete && (
                <button
                  onClick={onTestComplete}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
                >
                  I performed this test
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
