// ✅ SpinnerIcon is OUTSIDE — accepts className as prop so size can be passed in
function SpinnerIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-8 bg-slate-200 rounded w-full mt-4" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  )
}

interface LoaderProps {
  type?: 'spinner' | 'page' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const spinnerSizes = {
  sm: 'animate-spin w-4 h-4 text-emerald-600',
  md: 'animate-spin w-8 h-8 text-emerald-600',
  lg: 'animate-spin w-12 h-12 text-emerald-600',
}

export default function Loader({ type = 'spinner', size = 'md', text }: LoaderProps) {

  if (type === 'page') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <SpinnerIcon className={spinnerSizes[size]} />
        {text && <p className="text-slate-500 text-sm">{text}</p>}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <SpinnerIcon className={spinnerSizes[size]} />
      {text && <p className="text-slate-500 text-sm">{text}</p>}
    </div>
  )
}