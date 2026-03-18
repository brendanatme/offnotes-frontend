import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSync, generateLocalId } from '~/sync'
import { db, type SyncableFolder } from '~/db'
import {
  fetchFolders,
  createFolder as apiCreateFolder,
  updateFolder as apiUpdateFolder,
  deleteFolder as apiDeleteFolder,
} from '~/api'
import type { Folder } from '~/interfaces'

export const folderKeys = {
  all: ['folders'] as const,
  local: ['folders', 'local'] as const,
}

export function useFolders() {
  const { isOnline } = useSync()

  return useQuery({
    queryKey: folderKeys.all,
    queryFn: async () => {
      if (!isOnline) {
        const localFolders = await db.folders.toArray()
        return localFolders
      }

      const serverFolders = await fetchFolders()
      const localFolders = await db.folders.toArray()

      const localOnly = localFolders.filter(
        (lf) => lf.syncStatus === 'pending' && lf.serverId === undefined
      )

      const merged = [...serverFolders]
      for (const local of localOnly) {
        const serverIdx = merged.findIndex((sf) => sf.id === local.id)
        if (serverIdx === -1) {
          merged.push(local)
        }
      }

      await db.folders.clear()
      for (const folder of merged) {
        await db.folders.put({
          ...folder,
          syncStatus: 'synced',
          serverId: folder.id,
        } as SyncableFolder)
      }

      return db.folders.toArray()
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  const { addToSyncQueue, isOnline } = useSync()

  return useMutation({
    mutationFn: async (name: string) => {
      const localId = generateLocalId()
      const now = new Date().toISOString()

      const localFolder: SyncableFolder = {
        id: Date.now(),
        user: null,
        name,
        created_at: now,
        updated_at: now,
        notes_count: 0,
        syncStatus: 'pending',
        localId,
        serverId: undefined,
      }

      await db.folders.add(localFolder)
      queryClient.setQueryData<SyncableFolder[]>(folderKeys.local, (old) => [
        ...(old || []),
        localFolder,
      ])

      if (isOnline) {
        try {
          const serverFolder = await apiCreateFolder({ name })
          await db.folders.where('localId').equals(localId).modify({
            id: serverFolder.id,
            syncStatus: 'synced',
            serverId: serverFolder.id,
          })
        } catch {
          await addToSyncQueue({
            type: 'create',
            entityType: 'folder',
            localId,
          })
        }
      } else {
        await addToSyncQueue({
          type: 'create',
          entityType: 'folder',
          localId,
        })
      }

      return localFolder
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
    },
  })
}

export function useUpdateFolder() {
  const queryClient = useQueryClient()
  const { addToSyncQueue, isOnline } = useSync()

  return useMutation({
    mutationFn: async ({
      folderId,
      folder,
    }: {
      folderId: number
      folder: Partial<Folder>
    }) => {
      const localId = (await db.folders.where('id').equals(folderId).first())
        ?.localId

      await db.folders
        .where('id')
        .equals(folderId)
        .modify({
          ...folder,
          syncStatus: 'pending' as const,
          updated_at: new Date().toISOString(),
        })

      if (isOnline && localId) {
        try {
          const serverFolder = await db.folders
            .where('localId')
            .equals(localId)
            .first()
          if (serverFolder?.serverId) {
            await apiUpdateFolder(serverFolder.serverId, folder)
            await db.folders.where('id').equals(folderId).modify({
              syncStatus: 'synced',
            })
          }
        } catch {
          if (localId) {
            await addToSyncQueue({
              type: 'update',
              entityType: 'folder',
              localId,
              data: folder as Record<string, unknown>,
            })
          }
        }
      } else if (localId) {
        await addToSyncQueue({
          type: 'update',
          entityType: 'folder',
          localId,
          data: folder as Record<string, unknown>,
        })
      }

      return db.folders.where('id').equals(folderId).first()
    },
    onMutate: async ({ folderId, folder }) => {
      await queryClient.cancelQueries({ queryKey: folderKeys.all })
      const previousFolders = queryClient.getQueryData<Folder[]>(folderKeys.all)

      queryClient.setQueryData<Folder[]>(folderKeys.all, (old) =>
        old?.map((f) => (f.id === folderId ? { ...f, ...folder } : f))
      )

      return { previousFolders }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(folderKeys.all, context.previousFolders)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
    },
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  const { addToSyncQueue, isOnline } = useSync()

  return useMutation({
    mutationFn: async (folderId: number) => {
      const localId = (await db.folders.where('id').equals(folderId).first())
        ?.localId

      await db.notes.where('folder').equals(folderId).delete()

      await db.folders.where('id').equals(folderId).delete()

      if (isOnline && localId) {
        try {
          const serverFolder = await db.folders
            .where('localId')
            .equals(localId)
            .first()
          if (serverFolder?.serverId) {
            await apiDeleteFolder(serverFolder.serverId)
          }
        } catch {
          if (localId) {
            await addToSyncQueue({
              type: 'delete',
              entityType: 'folder',
              localId,
            })
          }
        }
      } else if (localId) {
        await addToSyncQueue({
          type: 'delete',
          entityType: 'folder',
          localId,
        })
      }
    },
    onMutate: async (folderId) => {
      await queryClient.cancelQueries({ queryKey: folderKeys.all })
      const previousFolders = queryClient.getQueryData<Folder[]>(folderKeys.all)

      queryClient.setQueryData<Folder[]>(folderKeys.all, (old) =>
        old?.filter((f) => f.id !== folderId)
      )

      return { previousFolders }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(folderKeys.all, context.previousFolders)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
    },
  })
}
