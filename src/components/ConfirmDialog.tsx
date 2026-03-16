import { ReactNode, useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmDialogProps {
  children: ReactNode
  heading?: string
  text?: string
  onAccept: () => void
  onReject?: () => void
}

export function ConfirmDialog({
  children,
  heading = 'Are you sure?',
  text = "This action can't be undone.",
  onAccept,
  onReject = () => {},
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const onRejectRef = useRef(onReject)

  useEffect(() => {
    onRejectRef.current = onReject
  }, [onReject])

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleAccept = () => {
    setIsOpen(false)
    onAccept()
  }

  const handleReject = useCallback(() => {
    setIsOpen(false)
    onRejectRef.current()
  }, [])

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleReject()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleReject])

  return (
    <>
      <span onClick={handleOpen} className="inline-flex">
        {children}
      </span>
      {createPortal(
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-150 ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-150 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleReject}
          />
          <div
            className={`relative bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 transition-transform duration-150 ${
              isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              {heading}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              {text}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-900 dark:text-white rounded hover:bg-neutral-300 dark:hover:bg-neutral-500 transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
