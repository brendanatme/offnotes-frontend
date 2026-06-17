import Dexie, { type EntityTable } from 'dexie'
import { Folder, Note } from '~/interfaces'

export type SyncStatus = 'synced' | 'pending' | 'failed'

export interface SyncableFolder extends Folder {
  syncStatus: SyncStatus
  localId?: string
  serverId?: number
}

export interface SyncableNote extends Note {
  syncStatus: SyncStatus
  localId?: string
  serverId?: number
}

export type OperationType = 'create' | 'update' | 'delete'

export interface SyncOperation {
  id?: number
  type: OperationType
  entityType: 'folder' | 'note'
  localId?: string
  serverId?: number
  data?: Record<string, unknown>
  timestamp: number
  retryCount: number
  userId?: number | null
}

class OfflineDatabase extends Dexie {
  folders!: EntityTable<SyncableFolder, 'id'>
  notes!: EntityTable<SyncableNote, 'id'>
  syncQueue!: EntityTable<SyncOperation, 'id'>
  metadata!: EntityTable<{ key: string; value: unknown }, 'key'>

  constructor() {
    super('OffNotesDB')

    this.version(1).stores({
      folders: 'id, name, syncStatus, localId, serverId',
      notes: 'id, folder, syncStatus, localId, serverId, date',
      syncQueue: '++id, entityType, localId, timestamp',
      metadata: 'key',
    })

    this.version(2).stores({
      folders: 'id, name, syncStatus, localId, serverId, user',
      notes: 'id, folder, syncStatus, localId, serverId, date, user',
      syncQueue: '++id, entityType, localId, timestamp, userId',
      metadata: 'key',
    })

    this.version(3)
      .stores({
        folders: 'id, name, syncStatus, localId, serverId, user_id',
        notes: 'id, folder, syncStatus, localId, serverId, date, user_id',
        syncQueue: '++id, entityType, localId, timestamp, userId',
        metadata: 'key',
      })
      .upgrade(async (tx) => {
        await tx
          .table('folders')
          .toCollection()
          .modify((folder: SyncableFolder & { user?: number | null }) => {
            folder.user_id = folder.user ?? null
            delete folder.user
          })
        await tx
          .table('notes')
          .toCollection()
          .modify((note: SyncableNote & { user?: number | null }) => {
            note.user_id = note.user ?? null
            delete note.user
          })
      })
  }
}

export const db = new OfflineDatabase()

export async function initializeDatabase() {
  await db.open()
}

export async function clearAllData() {
  await db.folders.clear()
  await db.notes.clear()
  await db.syncQueue.clear()
}

export function generateLocalId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}
