import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { db, type SyncOperation, type SyncStatus } from '~/db'
import * as api from '~/api'
import type { Folder, Note } from '~/interfaces'

export interface SyncState {
  isOnline: boolean
  isSyncing: boolean
  pendingOperations: number
  lastSyncTime: number | null
}

interface SyncContextType extends SyncState {
  addToSyncQueue: (
    operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>
  ) => Promise<void>
  forceSync: () => Promise<void>
}

const SyncContext = createContext<SyncContextType | undefined>(undefined)

const MAX_RETRY_COUNT = 3

export function SyncProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingOperations, setPendingOperations] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)
  const isSyncingRef = useRef(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const processFolderOp = useCallback(async (operation: SyncOperation) => {
    const folder = await db.folders
      .where('localId')
      .equals(operation.localId)
      .first()

    switch (operation.type) {
      case 'create': {
        const serverFolder = await api.createFolder({
          name: folder?.name || '',
        })
        await db.folders
          .where('localId')
          .equals(operation.localId)
          .modify({
            id: serverFolder.id,
            syncStatus: 'synced' as SyncStatus,
            serverId: serverFolder.id,
          })
        break
      }
      case 'update': {
        if (folder?.serverId) {
          await api.updateFolder(
            folder.serverId,
            operation.data as Partial<Folder>
          )
          await db.folders
            .where('localId')
            .equals(operation.localId)
            .modify({
              syncStatus: 'synced' as SyncStatus,
            })
        }
        break
      }
      case 'delete': {
        if (folder?.serverId) {
          await api.deleteFolder(folder.serverId)
        }
        await db.folders.where('localId').equals(operation.localId).delete()
        break
      }
    }
  }, [])

  const processNoteOp = useCallback(async (operation: SyncOperation) => {
    const note = await db.notes
      .where('localId')
      .equals(operation.localId)
      .first()

    switch (operation.type) {
      case 'create': {
        const serverNote = await api.createNote({
          user: null,
          folder: note?.folder || 0,
          title: note?.title || '',
          date: note?.date || '',
          content: note?.content || '',
        })
        await db.notes
          .where('localId')
          .equals(operation.localId)
          .modify({
            id: serverNote.id,
            syncStatus: 'synced' as SyncStatus,
            serverId: serverNote.id,
          })
        break
      }
      case 'update': {
        if (note?.serverId) {
          await api.updateNote(note.serverId, operation.data as Partial<Note>)
          await db.notes
            .where('localId')
            .equals(operation.localId)
            .modify({
              syncStatus: 'synced' as SyncStatus,
            })
        }
        break
      }
      case 'delete': {
        if (note?.serverId) {
          await api.deleteNote(note.serverId)
        }
        await db.notes.where('localId').equals(operation.localId).delete()
        break
      }
    }
  }, [])

  const processOperation = useCallback(
    async (operation: SyncOperation) => {
      switch (operation.entityType) {
        case 'folder':
          await processFolderOp(operation)
          break
        case 'note':
          await processNoteOp(operation)
          break
      }
    },
    [processFolderOp, processNoteOp]
  )

  const updatePendingCount = useCallback(async () => {
    const count = await db.syncQueue.count()
    setPendingOperations(count)
  }, [])

  const addToSyncQueue = useCallback(
    async (
      operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>
    ) => {
      await db.syncQueue.add({
        ...operation,
        timestamp: Date.now(),
        retryCount: 0,
      })
      await updatePendingCount()
    },
    [updatePendingCount]
  )

  const processSyncQueue = useCallback(async () => {
    if (!navigator.onLine || isSyncingRef.current) return

    isSyncingRef.current = true
    setIsSyncing(true)

    try {
      const operations = await db.syncQueue.orderBy('timestamp').toArray()

      for (const operation of operations) {
        try {
          await processOperation(operation)
          await db.syncQueue.delete(operation.id!)
        } catch {
          if (operation.retryCount < MAX_RETRY_COUNT) {
            await db.syncQueue.update(operation.id!, {
              retryCount: operation.retryCount + 1,
            })
          } else {
            console.error(
              `Operation failed after ${MAX_RETRY_COUNT} retries:`,
              operation
            )
          }
        }
      }

      setLastSyncTime(Date.now())
    } finally {
      isSyncingRef.current = false
      setIsSyncing(false)
      await updatePendingCount()
    }
  }, [updatePendingCount, processOperation])

  const forceSync = useCallback(async () => {
    if (navigator.onLine) {
      await processSyncQueue()
    }
  }, [processSyncQueue])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    updatePendingCount()
  }, [updatePendingCount])

  useEffect(() => {
    if (isOnline && !isSyncingRef.current) {
      processSyncQueue()
    }
  }, [isOnline, processSyncQueue])

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingOperations,
        lastSyncTime,
        addToSyncQueue,
        forceSync,
      }}
    >
      {children}
    </SyncContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSync(): SyncContextType {
  const context = useContext(SyncContext)
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider')
  }
  return context
}

/* eslint-disable react-refresh/only-export-components */
export { generateLocalId, db } from './exports'
export type { SyncableFolder, SyncableNote, SyncStatus } from './exports'
/* eslint-enable react-refresh/only-export-components */
