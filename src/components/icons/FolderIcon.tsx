import React from 'react'

interface FolderIconProps {
  className?: string
}

export function FolderIcon({ className = 'w-4 h-4' }: FolderIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 3h8l2 2h8a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  )
}

export default FolderIcon
