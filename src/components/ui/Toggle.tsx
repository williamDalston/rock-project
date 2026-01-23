interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
  disabled?: boolean
}

export function Toggle({ enabled, onChange, label, disabled = false }: ToggleProps) {
  return (
    <div className="flex items-center space-x-3 bg-stone-900 p-4 rounded-xl border border-stone-800">
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${
          enabled
            ? 'bg-emerald-600 hover:bg-emerald-500'
            : 'bg-stone-700 hover:bg-stone-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
            enabled ? 'translate-x-5' : ''
          }`}
        />
      </button>
      <span className="text-sm font-medium text-stone-200">{label}</span>
    </div>
  )
}
