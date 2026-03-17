import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Folder, Note } from '~/interfaces'
import {
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
  updateFolder as apiUpdateFolder,
  createFolder as apiCreateFolder,
  deleteFolder as apiDeleteFolder,
} from '~/api'

export interface NotesContextType {
  folders: Folder[]
  selectedFolder: Folder | null
  selectedFolderId: number | null
  notes: Note[]
  selectedNote: Note | null
  isAddingNote: boolean
  isAddingFolder: boolean

  setFolders: (folders: Folder[]) => void
  selectFolder: (folder: Folder | null) => void
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
  selectNote: (note: Note | null) => void
  createNote: (
    note: Omit<Note, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<Note>
  updateNote: (noteId: number, note: Partial<Note>) => Promise<Note>
  deleteNote: (noteId: number) => Promise<void>
  updateFolder: (folderId: number, folder: Partial<Folder>) => Promise<Folder>
  deleteFolder: (folderId: number) => Promise<void>
  createFolder: (name: string) => Promise<Folder>
  startAddNote: () => void
  stopAddNote: () => void
  startAddFolder: () => void
  stopAddFolder: () => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

const sortNotesByDate = (notes: Note[]): Note[] =>
  [...notes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()
  const [folders, _setFolders] = useState<Folder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isAddingFolder, setIsAddingFolder] = useState(false)

  const setFolders = useCallback(
    (_folders: Folder[]) => {
      const parseDate = (dateStr: string | undefined) => {
        if (!dateStr) return 0
        const parsed = Date.parse(dateStr)
        return isNaN(parsed) ? 0 : parsed
      }
      const sorted = [..._folders].sort(
        (a, b) => parseDate(b.created_at) - parseDate(a.created_at)
      )
      _setFolders(sorted)
      if (sorted.length > 0 && !selectedFolder) {
        setSelectedFolder(sorted[0])
      } else if (selectedFolder) {
        const updatedSelectedFolder = sorted.find(
          (folder) => folder.id === selectedFolder.id
        )
        if (!updatedSelectedFolder) {
          setSelectedFolder(null)
        }
      }
    },
    [selectedFolder]
  )

  const selectFolder = useCallback((folder: Folder | null) => {
    setSelectedFolder(folder)
    setSelectedNote(null)
    if (folder === null) {
      setNotes([])
    }
  }, [])

  const selectNote = useCallback((note: Note | null) => {
    setSelectedNote(note)
    setIsAddingNote(false)
  }, [])

  const createNote = useCallback(
    async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
      const newNote = await apiCreateNote(note)
      setNotes((prev) => sortNotesByDate([...prev, newNote]))
      selectNote(newNote)
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      return newNote
    },
    [queryClient, selectNote]
  )

  const updateNote = useCallback(
    async (noteId: number, note: Partial<Note>) => {
      const updatedNote = await apiUpdateNote(noteId, note)
      setNotes((prev) =>
        sortNotesByDate(prev.map((n) => (n.id === noteId ? updatedNote : n)))
      )
      setSelectedNote(updatedNote)
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      return updatedNote
    },
    [queryClient]
  )

  const deleteNote = useCallback(
    async (noteId: number) => {
      await apiDeleteNote(noteId)
      setNotes((prev) => prev.filter((n) => n.id !== noteId))
      setSelectedNote(null)
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
    [queryClient]
  )

  const updateFolder = useCallback(
    async (folderId: number, folder: Partial<Folder>) => {
      const updatedFolder = await apiUpdateFolder(folderId, folder)
      setFolders(folders.map((f) => (f.id === folderId ? updatedFolder : f)))
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(updatedFolder)
      }
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      return updatedFolder
    },
    [queryClient, selectedFolder, folders, setFolders]
  )

  const startAddNote = useCallback(() => {
    setSelectedNote(null)
    setIsAddingNote(true)
  }, [])

  const stopAddNote = useCallback(() => {
    setIsAddingNote(false)
  }, [])

  const createFolder = useCallback(
    async (name: string) => {
      const newFolder = await apiCreateFolder({ name })
      setFolders([...folders, newFolder])
      setIsAddingFolder(false)
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      return newFolder
    },
    [folders, queryClient, setFolders]
  )

  const startAddFolder = useCallback(() => {
    setIsAddingFolder(true)
  }, [])

  const stopAddFolder = useCallback(() => {
    setIsAddingFolder(false)
  }, [])

  const deleteFolder = useCallback(
    async (folderId: number) => {
      await apiDeleteFolder(folderId)
      setFolders(folders.filter((f) => f.id !== folderId))
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null)
        setSelectedNote(null)
      }
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
    [folders, queryClient, selectedFolder, setFolders]
  )

  const setNotesSorted = useCallback((action: React.SetStateAction<Note[]>) => {
    setNotes((prev) => {
      const next = typeof action === 'function' ? action(prev) : action
      return sortNotesByDate(next)
    })
  }, [])

  return (
    <NotesContext.Provider
      value={{
        folders,
        isAddingNote,
        isAddingFolder,
        selectedFolder,
        selectedFolderId: selectedFolder?.id ?? null,
        notes,
        selectedNote,
        setFolders,
        selectFolder,
        setNotes: setNotesSorted,
        selectNote,
        createNote,
        updateNote,
        deleteNote,
        updateFolder,
        deleteFolder,
        createFolder,
        startAddNote,
        stopAddNote,
        startAddFolder,
        stopAddFolder,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider')
  }
  return context
}
