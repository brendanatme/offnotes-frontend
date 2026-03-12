import { FallbackProps } from 'react-error-boundary'

interface ErrorFallbackProps extends FallbackProps {
  section?: string
}

export default function ErrorFallback({ section }: ErrorFallbackProps) {
  return (
    <div>
      <p className="text-red-500 text-sm font-semibold mb-2">Error</p>
      <span className="text-red-400 text-xs">
        There was an error loading {section && `${section}`}
      </span>
    </div>
  )
}
