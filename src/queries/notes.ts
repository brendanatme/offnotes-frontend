import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Note } from '~/interfaces'
import {
  fetchNotes,
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
} from '~/api'
import { folderKeys } from './folders'

export const noteKeys = {
  all: ['notes'] as const,
  byFolder: (folderId: number | undefined) => ['notes', folderId] as const,
}

export function useNotes(folderId?: number) {
  return useQuery({
    queryKey: noteKeys.byFolder(folderId),
    queryFn: () => fetchNotes(folderId),
    enabled: folderId !== undefined,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) =>
      apiCreateNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all })
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
    },
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, note }: { noteId: number; note: Partial<Note> }) =>
      apiUpdateNote(noteId, note),
    onMutate: async ({ noteId, note }) => {
      const folderId = note.folder
      await queryClient.cancelQueries({ queryKey: noteKeys.all })
      await queryClient.cancelQueries({ queryKey: noteKeys.byFolder(folderId) })

      const previousNotes = queryClient.getQueryData<Note[]>(
        noteKeys.byFolder(folderId)
      )

      queryClient.setQueryData<Note[]>(noteKeys.byFolder(folderId), (old) =>
        old?.map((n) => (n.id === noteId ? { ...n, ...note } : n))
      )

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

  return useMutation({
    mutationFn: (noteId: number) => apiDeleteNote(noteId),
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
