'use client'


function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}


interface ButtonProps {
  label: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  ariaLabel?: string
  className?: string
}

export default function Button({
  label,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  disabled = false,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ariaLabel,
  className = '',
}: ButtonProps) {

  const base = [
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
    'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth ? 'w-full' : '',
  ].join(' ')

  const variants = {
    primary:   'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:     'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
    outline:   'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel || label}
      aria-busy={isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading && iconPosition === 'left'  && <Spinner />}
      {!isLoading && icon && iconPosition === 'left'  && icon}
      <span>{isLoading ? 'Loading...' : label}</span>
      {!isLoading && icon && iconPosition === 'right' && icon}
      {isLoading && iconPosition === 'right' && <Spinner />}
    </button>
  )
}