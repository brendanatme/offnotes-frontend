import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  kind?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'invisible'
  size?: 'sm' | 'md' | 'lg' | 'none'
  onClick: () => void
}

export function Button({
  children,
  className = '',
  kind = 'primary',
  onClick,
  size = 'md',
  ...props
}: ButtonProps) {
  const getColorClasses = () => {
    if (props.disabled) {
      return 'bg-gray-400 cursor-not-allowed'
    }
    switch (kind) {
      case 'invisible':
        return 'text-white bg-transparent hover:bg-neutral-700 transition-colors'
      case 'secondary':
        return 'text-white bg-neutral-700 hover:bg-neutral-600 transition-colors'
      case 'danger':
        return 'text-white bg-red-600 hover:bg-red-700 transition-colors'
      case 'success':
        return 'text-white bg-green-600 hover:bg-green-700 transition-colors'
      case 'warning':
        return 'text-white bg-yellow-600 hover:bg-yellow-700 transition-colors'
      case 'primary':
      default:
        return 'text-white bg-gray-700 hover:bg-gray-600 transition-colors'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1'
      case 'lg':
        return 'text-lg px-5 py-3'
      case 'none':
        return ''
      case 'md':
      default:
        return 'text-md px-4 py-2'
    }
  }

  const colorClasses = getColorClasses()
  const sizeClasses = getSizeClasses()

  return (
    <button
      type="button"
      className={`cursor-pointer flex items-center ${sizeClasses} ${colorClasses} rounded ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
