import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Folder } from '~/interfaces'
import {
  fetchFolders,
  createFolder as apiCreateFolder,
  updateFolder as apiUpdateFolder,
  deleteFolder as apiDeleteFolder,
} from '~/api'

export const folderKeys = {
  all: ['folders'] as const,
}

export function useFolders() {
  return useQuery({
    queryKey: folderKeys.all,
    queryFn: fetchFolders,
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => apiCreateFolder({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
    },
  })
}

export function useUpdateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      folderId,
      folder,
    }: {
      folderId: number
      folder: Partial<Folder>
    }) => apiUpdateFolder(folderId, folder),
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

  return useMutation({
    mutationFn: (folderId: number) => apiDeleteFolder(folderId),
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
