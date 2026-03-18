import { ReactNode, RefObject, useRef, useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { useClickOutside } from '~/hooks/useClickOutside'

interface HasId {
  id: number
}

interface SidebarContentProps<T extends HasId> {
  items: T[]
  selectedItem: T | null
  onSelect: (item: T) => void
  onDoubleClick?: (item: T) => void
  isEditing?: number | null
  editValue?: string
  setEditValue?: (value: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
  onEditSubmit?: (id: number) => void
  onEditCancel?: () => void
  onDelete?: (id: number) => void
  isAdding?: boolean
  onAddSubmit?: () => void
  onAddCancel?: () => void
  getLabel: (item: T) => string
  getSubtitle?: (item: T) => ReactNode
}

export function SidebarContent<T extends HasId>({
  items,
  selectedItem,
  onSelect,
  onDoubleClick,
  isEditing,
  editValue,
  setEditValue,
  inputRef,
  onEditSubmit,
  onEditCancel,
  onDelete,
  isAdding,
  onAddSubmit,
  onAddCancel,
  getLabel,
  getSubtitle,
}: SidebarContentProps<T>) {
  const editingItemRef = useRef<HTMLDivElement>(null)
  useClickOutside(editingItemRef, () => {
    if (isEditing != null && !isDeleting) {
      onEditSubmit?.(isEditing)
    }
  })

  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  return (
    <ul className="">
      {isAdding && (
        <li className="first:mt-0 -mt-px border-b border-neutral-300 dark:border-neutral-500 text-sm">
          <div className="flex justify-between items-center px-4 py-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="New folder name"
              className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded px-1 py-0.5 text-sm"
              value={editValue}
              onChange={(e) => setEditValue?.(e.target.value)}
              onBlur={() => onAddSubmit?.()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAddSubmit?.()
                } else if (e.key === 'Escape') {
                  onAddCancel?.()
                }
              }}
            />
          </div>
        </li>
      )}
      {items.map((item: T) => {
        const isSelected = selectedItem?.id === item.id
        const isItemEditing = isEditing === item.id
        return (
          <li
            key={item.id}
            className="first:mt-0 -mt-px border-b border-neutral-300 dark:border-neutral-500 text-sm flex"
          >
            {isItemEditing ? (
              <div
                ref={editingItemRef}
                className="flex flex-1 items-center px-4 py-2 gap-2 w-full"
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 min-w-0 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded px-1 py-0.5 text-sm"
                  value={editValue}
                  onChange={(e) => setEditValue?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onEditSubmit?.(item.id)
                    } else if (e.key === 'Escape') {
                      onEditCancel?.()
                    }
                  }}
                />
                {onDelete && (
                  <ConfirmDialog
                    heading="Delete folder?"
                    text="This will delete all notes in this folder. This action can't be undone."
                    onAccept={() => onDelete(item.id)}
                    onReject={() => setIsDeleting(false)}
                  >
                    <button
                      type="button"
                      className="flex-shrink-0 p-1 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 cursor-pointer"
                      onClick={() => setIsDeleting(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </ConfirmDialog>
                )}
              </div>
            ) : (
              <button
                type="button"
                className={`cursor-pointer w-full flex justify-between items-center px-4 py-2 text-left ${
                  isSelected
                    ? 'bg-neutral-200 dark:bg-neutral-700'
                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
                onClick={() => onSelect(item)}
                onDoubleClick={() => onDoubleClick?.(item)}
              >
                <span className="truncate">{getLabel(item)}</span>
                {getSubtitle && (
                  <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                    {getSubtitle(item)}
                  </span>
                )}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
