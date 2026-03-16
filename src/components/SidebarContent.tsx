import { ReactNode, useEffect, RefObject } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

interface HasId {
  id: number
}

interface SidebarContentProps<T extends HasId> {
  queryKey?: string[]
  queryFn?: () => Promise<T[]>
  items: T[]
  selectedItem: T | null
  setItems: (items: T[]) => void
  onSelect: (item: T) => void
  onDoubleClick?: (item: T) => void
  isEditing?: number | null
  editValue?: string
  setEditValue?: (value: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
  onEditSubmit?: (id: number) => void
  onEditCancel?: () => void
  isAdding?: boolean
  onAddSubmit?: () => void
  onAddCancel?: () => void
  getLabel: (item: T) => string
  getSubtitle?: (item: T) => ReactNode
}

export function SidebarContent<T extends HasId>({
  queryKey,
  queryFn,
  items: initialItems,
  selectedItem,
  setItems,
  onSelect,
  onDoubleClick,
  isEditing,
  editValue,
  setEditValue,
  inputRef,
  onEditSubmit,
  onEditCancel,
  isAdding,
  onAddSubmit,
  onAddCancel,
  getLabel,
  getSubtitle,
}: SidebarContentProps<T>) {
  const shouldFetch = Boolean(queryKey && queryFn)
  const { data } = useSuspenseQuery<T[]>({
    queryKey: queryKey ?? [],
    queryFn: queryFn ?? (async () => []),
  })

  const items = shouldFetch && data ? data : initialItems

  useEffect(() => {
    if (shouldFetch && data) {
      setItems(data)
    }
  }, [data, setItems, shouldFetch])

  return (
    <ul className="">
      {isAdding && (
        <li className="first:mt-0 -mt-px border-y border-neutral-300 dark:border-neutral-500 text-sm">
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
            className="first:mt-0 -mt-px border-y border-neutral-300 dark:border-neutral-500 text-sm"
          >
            {isItemEditing ? (
              <div className="flex justify-between items-center px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded px-1 py-0.5 text-sm"
                  value={editValue}
                  onChange={(e) => setEditValue?.(e.target.value)}
                  onBlur={() => onEditSubmit?.(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onEditSubmit?.(item.id)
                    } else if (e.key === 'Escape') {
                      onEditCancel?.()
                    }
                  }}
                />
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
