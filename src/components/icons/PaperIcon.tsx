import React from 'react'

interface PaperIconProps {
  className?: string
}

export function PaperIcon({ className = 'w-4 h-4' }: PaperIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-4-4H9v2h6v-2zm4-4H9v2h10v-2zm0-4H9v2h10V7z" />
    </svg>
  )
}

export default PaperIcon
