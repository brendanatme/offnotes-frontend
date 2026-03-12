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
    ? 'h-14 flex items-center justify-between gap-2 p-4'
    : 'h-14 flex items-center justify-center p-2'

  return (
    <aside
      className={`shrink-0 bg-neutral-800 flex flex-col border-r border-neutral-500 transition-all duration-200 ${
        open ? 'w-50' : 'w-12'
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
            ? 'overflow-auto opacity-100 transition-opacity duration-200 delay-200'
            : 'overflow-hidden opacity-0 transition-none pointer-events-none'
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
