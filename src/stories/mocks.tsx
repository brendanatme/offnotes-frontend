/* eslint-disable react-refresh/only-export-components */
import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotesProvider, useNotes } from '~/context/notes'
import { SyncContext, type SyncContextType } from '~/sync'
import type { Folder, Note } from '~/interfaces'
import { folderKeys } from '~/queries/folders'
import { noteKeys } from '~/queries/notes'

export const MOCK_FOLDER_ID = 1
export const MOCK_NOTE_ID = 1

export const mockFolders: Folder[] = [
  {
    id: 1,
    user_id: 1,
    name: 'Work',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    notes_count: 2,
  },
  {
    id: 2,
    user_id: 1,
    name: 'Personal',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    notes_count: 1,
  },
  {
    id: 3,
    user_id: 1,
    name: 'Projects',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    notes_count: 0,
  },
]

export const mockNotes: Note[] = [
  {
    id: 1,
    user_id: 1,
    folder: 1,
    title: 'Meeting Notes',
    date: '2024-01-15',
    content:
      'Discussed project timeline and deliverables for Q1. Key action items:\n- Update the roadmap\n- Schedule follow-up calls',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    latest_commit: 0,
  },
  {
    id: 2,
    user_id: 1,
    folder: 1,
    title: 'Feature Ideas',
    date: '2024-01-10',
    content: 'Dark mode toggle, offline-first sync, keyboard shortcuts.',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    latest_commit: 0,
  },
]

export const syncOnline: SyncContextType = {
  isOnline: true,
  isSyncing: false,
  pendingOperations: 0,
  lastSyncTime: Date.now(),
  addToSyncQueue: async () => {},
  forceSync: async () => {},
}

export const syncOffline: SyncContextType = {
  ...syncOnline,
  isOnline: false,
}

export const syncSyncing: SyncContextType = {
  ...syncOnline,
  isSyncing: true,
}

export const syncPending: SyncContextType = {
  ...syncOnline,
  pendingOperations: 3,
}

export function makeQueryClient(
  folders = mockFolders,
  notes = mockNotes,
  folderId = MOCK_FOLDER_ID
) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  })
  client.setQueryData(folderKeys.all, folders)
  client.setQueryData(noteKeys.byFolder(folderId), notes)
  return client
}

interface AppProvidersProps {
  children: ReactNode
  syncValue?: SyncContextType
  queryClient?: QueryClient
}

export function AppProviders({
  children,
  syncValue = syncOnline,
  queryClient,
}: AppProvidersProps) {
  const client = queryClient ?? makeQueryClient()
  return (
    <QueryClientProvider client={client}>
      <SyncContext.Provider value={syncValue}>
        <NotesProvider>{children}</NotesProvider>
      </SyncContext.Provider>
    </QueryClientProvider>
  )
}

export function WithFolderSelected({ children }: { children: ReactNode }) {
  const { selectFolder } = useNotes()
  useEffect(() => {
    selectFolder(MOCK_FOLDER_ID)
  }, [selectFolder])
  return <>{children}</>
}

export function WithNoteSelected({ children }: { children: ReactNode }) {
  const { selectFolder, selectNote } = useNotes()
  useEffect(() => {
    selectFolder(MOCK_FOLDER_ID)
    selectNote(MOCK_NOTE_ID)
  }, [selectFolder, selectNote])
  return <>{children}</>
}

export function WithAddNoteActive({ children }: { children: ReactNode }) {
  const { selectFolder, startAddNote } = useNotes()
  useEffect(() => {
    selectFolder(MOCK_FOLDER_ID)
    startAddNote()
  }, [selectFolder, startAddNote])
  return <>{children}</>
}
