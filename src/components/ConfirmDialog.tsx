import { ReactNode, useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmDialogProps {
  children: ReactNode
  onAccept: () => void
  onReject?: () => void
}

export function ConfirmDialog({
  children,
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
    onAccept()
    setIsOpen(false)
  }

  const handleReject = useCallback(() => {
    onRejectRef.current()
    setIsOpen(false)
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
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={handleReject}
            />
            <div className="relative bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Are you sure?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                This action can&apos;t be undone.
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
