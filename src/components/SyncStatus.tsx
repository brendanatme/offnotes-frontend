import { useSync } from '~/sync'
import { RefreshIcon } from './icons/WifiIcon'
import { useFavicon } from '~/hooks/useFavicon'
import { useState, useEffect, useRef } from 'react'

export function SyncStatus() {
  const { isOnline, isSyncing, pendingOperations, forceSync } = useSync()
  const [displaySyncing, setDisplaySyncing] = useState(false)
  const syncingRef = useRef(false)

  useFavicon(isOnline)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    syncingRef.current = isSyncing

    let timer: ReturnType<typeof setTimeout>

    if (isSyncing) {
      setDisplaySyncing(true)
    } else {
      timer = setTimeout(() => {
        if (!syncingRef.current) {
          setDisplaySyncing(false)
        }
      }, 300)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isSyncing])
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full cursor-pointer ${
          isOnline
            ? 'bg-green-500 dark:bg-green-400'
            : 'bg-amber-500 dark:bg-amber-400'
        }`}
        title={isOnline ? 'Online' : 'Offline'}
      ></span>
      {pendingOperations > 0 && (
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          ({pendingOperations} pending)
        </span>
      )}
      {pendingOperations > 0 && isOnline && !displaySyncing && (
        <button
          onClick={forceSync}
          className="ml-2 p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          title="Sync now"
        >
          <RefreshIcon className="w-4 h-4" />
        </button>
      )}
      {displaySyncing && <RefreshIcon className="w-4 h-4 animate-spin" />}
    </div>
  )
}
