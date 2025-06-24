import React from 'react'

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    ghost: 'hover:bg-slate-100 hover:text-slate-900',
    outline: 'border border-slate-300 hover:bg-slate-100 hover:text-slate-900'
  }
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }