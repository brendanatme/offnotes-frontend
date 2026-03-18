import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSync, generateLocalId } from '~/sync'
import { db, type SyncableNote } from '~/db'
import {
  fetchNotes,
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
} from '~/api'
import { folderKeys } from './folders'
import type { Note } from '~/interfaces'

export const noteKeys = {
  all: ['notes'] as const,
  byFolder: (folderId: number | undefined) => ['notes', folderId] as const,
}

export function useNotes(folderId?: number) {
  const { isOnline } = useSync()

  return useQuery({
    queryKey: noteKeys.byFolder(folderId),
    queryFn: async () => {
      if (folderId === undefined) return []

      const localNotes = await db.notes
        .where('folder')
        .equals(folderId)
        .toArray()

      if (!isOnline) {
        return localNotes
      }

      try {
        const serverNotes = await fetchNotes(folderId)
        const localOnly = localNotes.filter(
          (ln) => ln.syncStatus === 'pending' && ln.serverId === undefined
        )

        const merged: SyncableNote[] = [
          ...serverNotes.map((s) => ({
            ...s,
            syncStatus: 'synced' as const,
            serverId: s.id,
          })),
        ]
        for (const local of localOnly) {
          const serverIdx = merged.findIndex((sn) => sn.id === local.id)
          if (serverIdx === -1) {
            merged.push(local)
          }
        }

        await db.notes.where('folder').equals(folderId).delete()
        for (const note of merged) {
          await db.notes.put({
            ...note,
            syncStatus: 'synced',
            serverId: note.serverId || note.id,
          } as SyncableNote)
        }

        return db.notes.where('folder').equals(folderId).toArray()
      } catch {
        return localNotes
      }
    },
    enabled: folderId !== undefined,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  const { addToSyncQueue, isOnline } = useSync()

  return useMutation({
    mutationFn: async (
      note: Omit<Note, 'id' | 'created_at' | 'updated_at'>
    ) => {
      const localId = generateLocalId()
      const now = new Date().toISOString()

      const localNote: SyncableNote = {
        ...note,
        id: Date.now(),
        created_at: now,
        updated_at: now,
        syncStatus: 'pending',
        localId,
        serverId: undefined,
      }

      await db.notes.add(localNote)

      if (isOnline) {
        try {
          const serverNote = await apiCreateNote(note)
          await db.notes.where('localId').equals(localId).modify({
            id: serverNote.id,
            syncStatus: 'synced',
            serverId: serverNote.id,
          })
        } catch {
          await addToSyncQueue({
            type: 'create',
            entityType: 'note',
            localId,
            data: note as unknown as Record<string, unknown>,
          })
        }
      } else {
        await addToSyncQueue({
          type: 'create',
          entityType: 'note',
          localId,
          data: note as unknown as Record<string, unknown>,
        })
      }

      return localNote
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
    },
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()
  const { addToSyncQueue, isOnline } = useSync()

  return useMutation({
    mutationFn: async ({
      noteId,
      note,
    }: {
      noteId: number
      note: Partial<Note>
    }) => {
      const localNote = await db.notes.where('id').equals(noteId).first()
      const localId = localNote?.localId

      await db.notes
        .where('id')
        .equals(noteId)
        .modify({
          ...note,
          syncStatus: 'pending' as const,
          updated_at: new Date().toISOString(),
        })

      queryClient.invalidateQueries({ queryKey: noteKeys.all })

      if (isOnline && localId) {
        try {
          const serverNote = await db.notes
            .where('localId')
            .equals(localId)
            .first()
          if (serverNote?.serverId) {
            await apiUpdateNote(serverNote.serverId, note)
            await db.notes.where('id').equals(noteId).modify({
              syncStatus: 'synced',
            })
          }
        } catch {
          if (localId) {
            await addToSyncQueue({
              type: 'update',
              entityType: 'note',
              localId,
              data: note as Record<string, unknown>,
            })
          }
        }
      } else if (localId) {
        await addToSyncQueue({
          type: 'update',
          entityType: 'note',
          localId,
          data: note as Record<string, unknown>,
        })
      }

      return db.notes.where('id').equals(noteId).first()
    },
    onMutate: async ({ noteId, note }) => {
      const folderId = note.folder
      await queryClient.cancelQueries({ queryKey: noteKeys.all })
      if (folderId !== undefined) {
        await queryClient.cancelQueries({
          queryKey: noteKeys.byFolder(folderId),
        })
      }

      const previousNotes = queryClient.getQueryData<Note[]>(
        noteKeys.byFolder(folderId)
      )

      if (folderId !== undefined) {
        queryClient.setQueryData<Note[]>(noteKeys.byFolder(folderId), (old) =>
          old?.map((n) => (n.id === noteId ? { ...n, ...note } : n))
        )
      }

      return { previousNotes, folderId }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousNotes && context.folderId !== undefined) {
        queryClient.setQueryData(
          noteKeys.byFolder(context.folderId),
          context.previousNotes
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  const { addToSyncQueue, isOnline } = useSync()

  return useMutation({
    mutationFn: async (noteId: number) => {
      const localNote = await db.notes.where('id').equals(noteId).first()
      const localId = localNote?.localId
      const serverId = localNote?.serverId

      await db.notes.where('id').equals(noteId).delete()

      if (isOnline && serverId) {
        try {
          await apiDeleteNote(serverId)
        } catch {
          if (localId) {
            await addToSyncQueue({
              type: 'delete',
              entityType: 'note',
              localId,
            })
          }
        }
      } else if (localId) {
        await addToSyncQueue({
          type: 'delete',
          entityType: 'note',
          localId,
        })
      }
    },
    onMutate: async (noteId) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.all })

      const previousNotes = queryClient.getQueriesData<Note[]>({
        queryKey: noteKeys.all,
      })

      queryClient.setQueriesData<Note[]>({ queryKey: noteKeys.all }, (old) =>
        old?.filter((n) => n.id !== noteId)
      )

      return { previousNotes }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousNotes) {
        context.previousNotes.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
    },
  })
}
