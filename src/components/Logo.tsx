import { useSync } from '~/sync'

export function Logo() {
  const { isOnline } = useSync()
  return (
    <h1 className="text-lg font-semibold">
      <span
        className={
          isOnline
            ? 'text-green-600 dark:text-green-400'
            : 'text-amber-600 dark:text-amber-400'
        }
      >
        &Oslash;
      </span>
      ffNotes
    </h1>
  )
}
