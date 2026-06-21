interface BadgeProps {
  label: string
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
}

export default function Badge({ label, variant = 'neutral', size = 'md', dot = false }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700',
    danger:  'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    info:    'bg-blue-100 text-blue-700',
    neutral: 'bg-slate-100 text-slate-600',
  }
  const dots = {
    success: 'bg-emerald-500', danger: 'bg-red-500',
    warning: 'bg-amber-500',  info:    'bg-blue-500', neutral: 'bg-slate-400',
  }
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-xs px-2.5 py-1' }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`} />}
      {label}
    </span>
  )
}