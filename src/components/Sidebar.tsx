import { ReactNode, Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './ErrorFallback'
import Loader from './Loader'
import { Button } from './Button'

interface SidebarProps {
  icon: ReactNode
  title: string
  contentComponent: ReactNode
  section: 'notes' | 'folders'
  actionButtonComponent?: ReactNode
}

export function Sidebar({
  icon,
  title,
  contentComponent,
  section,
  actionButtonComponent,
}: SidebarProps) {
  const [open, setOpen] = useState(true)

  const headerClass = open
    ? 'h-12 flex items-center justify-between gap-2 px-4 py-2'
    : 'h-12 flex items-center justify-center p-2'

  return (
    <aside
      className={`shrink-0 flex flex-col transition-all duration-200 bg-neutral-100 dark:bg-neutral-800 max-md:w-full max-md:border-b max-md:border-neutral-300 max-md:dark:border-neutral-500 max-md:border-r-0 border-r border-neutral-300 dark:border-neutral-500 ${
        open ? 'w-50 max-md:h-40' : 'w-12 max-md:w-full max-md:h-12'
      }`}
    >
      <div className={headerClass}>
        <Button
          onClick={() => setOpen((o) => !o)}
          className={`cursor-pointer flex items-center px-2 py-1 ${open ? '-ml-2.5' : 'ml-0'}`}
          kind="invisible"
          size="none"
          aria-label={
            open
              ? `Collapse ${title.toLowerCase()}`
              : `Expand ${title.toLowerCase()}`
          }
        >
          {icon}
          {open && <h2 className="ml-2 text-sm font-semibold">{title}</h2>}
        </Button>
        {open && actionButtonComponent ? actionButtonComponent : null}
      </div>
      <div
        className={`flex-1 ${
          open
            ? 'border-t border-neutral-300 dark:border-neutral-500 overflow-auto opacity-100 transition-opacity duration-200 delay-200'
            : 'border-t border-neutral-300 dark:border-neutral-500 overflow-hidden opacity-0 transition-none pointer-events-none'
        }`}
      >
        <ErrorBoundary
          FallbackComponent={(props) => (
            <ErrorFallback {...props} section={section} />
          )}
        >
          <Suspense fallback={<Loader />}>{contentComponent}</Suspense>
        </ErrorBoundary>
      </div>
    </aside>
  )
}

export default Sidebar
