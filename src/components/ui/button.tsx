import React from 'react'
import clsx from 'clsx'

type Variant = 'default' | 'destructive' | 'outline'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export default function Button({ variant = 'default', className, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-[0.98]'
  const variants: Record<Variant, string> = {
    default: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-400 px-5 py-3',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400 px-5 py-3',
    outline: 'border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 px-4 py-2'
  }

  return (
    <button
      {...props}
      className={clsx(base, variants[variant], className)}
    >
      {children}
    </button>
  )
}
