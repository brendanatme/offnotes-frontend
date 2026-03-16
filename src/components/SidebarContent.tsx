import { ReactNode, useEffect } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

interface HasId {
  id: number
}

interface SidebarContentProps<T extends HasId> {
  queryKey: string[]
  queryFn: () => Promise<T[]>
  items: T[]
  selectedItem: T | null
  setItems: (items: T[]) => void
  onSelect: (item: T) => void
  getLabel: (item: T) => string
  getSubtitle?: (item: T) => ReactNode
}

export function SidebarContent<T extends HasId>({
  queryKey,
  queryFn,
  items,
  selectedItem,
  setItems,
  onSelect,
  getLabel,
  getSubtitle,
}: SidebarContentProps<T>) {
  const { data } = useSuspenseQuery<T[]>({
    queryKey,
    queryFn,
  })

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data, setItems])

  return (
    <ul className="">
      {items.map((item: T) => {
        const isSelected = selectedItem?.id === item.id
        return (
          <li
            key={item.id}
            className="first:mt-0 -mt-px border-y border-neutral-300 dark:border-neutral-500 text-sm"
          >
            <button
              type="button"
              className={`cursor-pointer w-full flex justify-between items-center px-4 py-2 text-left ${
                isSelected
                  ? 'bg-neutral-200 dark:bg-neutral-700'
                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
              onClick={() => onSelect(item)}
            >
              <span className="truncate">{getLabel(item)}</span>
              {getSubtitle && (
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                  {getSubtitle(item)}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
