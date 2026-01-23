interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
}

export function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center space-x-3 bg-stone-900 p-3 rounded-xl border border-stone-800">
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${
          enabled ? 'bg-emerald-600' : 'bg-stone-700'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-4' : ''
          }`}
        />
      </button>
      <span className="text-sm font-medium text-stone-300">{label}</span>
    </div>
  )
}
