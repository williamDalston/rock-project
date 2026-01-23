import { Hexagon } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen-safe bg-stone-950 text-emerald-500">
      <div className="relative">
        <Hexagon className="w-16 h-16 motion-safe:animate-spin" strokeWidth={1} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-emerald-900/50 rounded-full motion-safe:animate-pulse" />
        </div>
      </div>
      <p className="font-serif italic mt-6 text-emerald-400/80 tracking-widest uppercase text-xs">
        Accessing Stratum...
      </p>

      {/* Subtle dedication */}
      <p className="absolute bottom-8 text-stone-700 text-[10px] tracking-wide">
        For Iamê
      </p>
    </div>
  )
}
