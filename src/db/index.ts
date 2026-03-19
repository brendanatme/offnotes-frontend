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
