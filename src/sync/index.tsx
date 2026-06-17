import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  db,
  type SyncOperation,
  type SyncStatus,
  type SyncableNote,
} from '~/db'
import * as api from '~/api'
import type { Folder, Note } from '~/interfaces'
import { ConflictModal, type ConflictState } from '~/components/ConflictModal'

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
  const queryClient = useQueryClient()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingOperations, setPendingOperations] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)
  const isSyncingRef = useRef(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [conflict, setConflict] = useState<ConflictState | null>(null)

  const processFolderOp = useCallback(async (operation: SyncOperation) => {
    let folder = operation.localId
      ? await db.folders.where('localId').equals(operation.localId).first()
      : operation.serverId
        ? await db.folders.where('serverId').equals(operation.serverId).first()
        : null

    switch (operation.type) {
      case 'create': {
        const folderData = operation.data as Partial<Folder>
        const serverFolder = await api.createFolder({
          name: folderData?.name ?? folder?.name ?? '',
        })
        if (operation.localId) {
          await db.folders
            .where('localId')
            .equals(operation.localId)
            .modify({
              id: serverFolder.id,
              syncStatus: 'synced' as SyncStatus,
              serverId: serverFolder.id,
            })
        }
        break
      }
      case 'update': {
        if (folder?.serverId) {
          await api.updateFolder(
            folder.serverId,
            operation.data as Partial<Folder>
          )
          if (operation.localId) {
            await db.folders
              .where('localId')
              .equals(operation.localId)
              .modify({
                syncStatus: 'synced' as SyncStatus,
              })
          }
        }
        break
      }
      case 'delete': {
        if (operation.serverId) {
          await api.deleteFolder(operation.serverId)
        }
        if (operation.localId) {
          await db.folders.where('localId').equals(operation.localId).delete()
        } else if (operation.serverId) {
          await db.folders.where('serverId').equals(operation.serverId).delete()
        }
        break
      }
    }
  }, [])

  const processNoteOp = useCallback(
    async (operation: SyncOperation) => {
      let note = operation.localId
        ? await db.notes.where('localId').equals(operation.localId).first()
        : operation.serverId
          ? await db.notes.where('serverId').equals(operation.serverId).first()
          : null

      switch (operation.type) {
        case 'create': {
          const noteData = operation.data as Partial<Note>
          const serverNote = await api.createNote({
            user_id: api.getUserId(),
            folder: noteData?.folder ?? note?.folder ?? 0,
            title: noteData?.title ?? note?.title ?? '',
            date: noteData?.date ?? note?.date ?? '',
            content: noteData?.content ?? note?.content ?? '',
          })
          if (operation.localId) {
            await db.notes
              .where('localId')
              .equals(operation.localId)
              .modify({
                id: serverNote.id,
                syncStatus: 'synced' as SyncStatus,
                serverId: serverNote.id,
              })
          }
          break
        }
        case 'update': {
          if (note?.serverId) {
            const { latest_commit: queuedCommit, ...updatePayload } =
              (operation.data ?? {}) as Partial<Note> & {
                latest_commit?: number
              }

            if (queuedCommit !== undefined) {
              const serverNote = await api.fetchNote(note.serverId)

              if (serverNote.latest_commit !== queuedCommit) {
                const choice = await new Promise<'local' | 'server'>(
                  (resolve) => {
                    setConflict({ localNote: note, serverNote, resolve })
                  }
                )
                setConflict(null)

                if (choice === 'local') {
                  await api.updateNote(note.serverId, updatePayload)
                  if (operation.localId) {
                    await db.notes
                      .where('localId')
                      .equals(operation.localId)
                      .modify({ syncStatus: 'synced' as SyncStatus })
                  }
                } else {
                  const syncedFields: Partial<SyncableNote> = {
                    ...serverNote,
                    syncStatus: 'synced',
                    serverId: serverNote.id,
                  }
                  if (operation.localId) {
                    await db.notes
                      .where('localId')
                      .equals(operation.localId)
                      .modify(syncedFields)
                  } else {
                    await db.notes
                      .where('id')
                      .equals(note.id)
                      .modify(syncedFields)
                  }
                  queryClient.invalidateQueries({ queryKey: ['notes'] })
                }
                break
              }
            }

            await api.updateNote(note.serverId, updatePayload)
            if (operation.localId) {
              await db.notes
                .where('localId')
                .equals(operation.localId)
                .modify({ syncStatus: 'synced' as SyncStatus })
            }
          }
          break
        }
        case 'delete': {
          if (operation.serverId) {
            await api.deleteNote(operation.serverId)
          }
          if (operation.localId) {
            await db.notes.where('localId').equals(operation.localId).delete()
          } else if (operation.serverId) {
            await db.notes.where('serverId').equals(operation.serverId).delete()
          }
          break
        }
      }
    },
    [queryClient]
  )

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
    const userId = api.getUserId()
    const count = userId
      ? await db.syncQueue.where('userId').equals(userId).count()
      : 0
    setPendingOperations(count)
  }, [])

  const addToSyncQueue = useCallback(
    async (
      operation: Omit<
        SyncOperation,
        'id' | 'timestamp' | 'retryCount' | 'userId'
      >
    ) => {
      await db.syncQueue.add({
        ...operation,
        timestamp: Date.now(),
        retryCount: 0,
        userId: api.getUserId(),
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
      const userId = api.getUserId()
      const operations = userId
        ? await db.syncQueue.where('userId').equals(userId).sortBy('timestamp')
        : []

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
      {conflict && <ConflictModal conflict={conflict} />}
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
