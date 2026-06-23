import { createPortal } from 'react-dom'
import type { Note } from '~/interfaces'
import type { SyncableNote } from '~/db'

export interface ConflictState {
  localNote: SyncableNote
  serverNote: Note
  resolve: (choice: 'local' | 'server') => void
}

interface ConflictModalProps {
  conflict: ConflictState
}

export function ConflictModal({ conflict }: ConflictModalProps) {
  const { localNote, serverNote, resolve } = conflict

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg max-w-3xl w-full mx-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
          Sync Conflict
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-5">
          "{localNote.title}" was modified on another device. Choose which
          version to keep.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 border border-neutral-200 dark:border-neutral-600 rounded-lg p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Your version
            </div>
            <div className="font-medium text-neutral-900 dark:text-white">
              {localNote.title}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300 max-h-48 overflow-y-auto whitespace-pre-wrap wrap-break-word">
              {localNote.content || (
                <span className="italic text-neutral-400">No content</span>
              )}
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-auto">
              {new Date(localNote.updated_at).toLocaleString()}
            </div>
            <button
              onClick={() => resolve('local')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium"
            >
              Keep mine
            </button>
          </div>
          <div className="flex flex-col gap-3 border border-neutral-200 dark:border-neutral-600 rounded-lg p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Other device
            </div>
            <div className="font-medium text-neutral-900 dark:text-white">
              {serverNote.title}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300 max-h-48 overflow-y-auto whitespace-pre-wrap wrap-break-word">
              {serverNote.content || (
                <span className="italic text-neutral-400">No content</span>
              )}
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-auto">
              {new Date(serverNote.updated_at).toLocaleString()}
            </div>
            <button
              onClick={() => resolve('server')}
              className="mt-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-900 dark:text-white rounded hover:bg-neutral-300 dark:hover:bg-neutral-500 transition-colors cursor-pointer text-sm font-medium"
            >
              Keep theirs
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
