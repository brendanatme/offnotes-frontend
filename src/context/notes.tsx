import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Folder, Note } from '~/interfaces'
import { createNote as apiCreateNote, updateNote as apiUpdateNote } from '~/api'

export interface NotesContextType {
  folders: Folder[]
  selectedFolder: Folder | null
  notes: Note[]
  selectedNote: Note | null
  isAddingNote: boolean

  setFolders: (folders: Folder[]) => void
  selectFolder: (folder: Folder | null) => void
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
  selectNote: (note: Note | null) => void
  createNote: (
    note: Omit<Note, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<Note>
  updateNote: (noteId: number, note: Partial<Note>) => Promise<Note>
  startAddNote: () => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()
  const [folders, _setFolders] = useState<Folder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)

  const setFolders = useCallback(
    (_folders: Folder[]) => {
      _setFolders(_folders)
      if (_folders.length > 0 && !selectedFolder) {
        setSelectedFolder(_folders[0])
      } else if (selectedFolder) {
        const updatedSelectedFolder = _folders.find(
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
    if (folder === null) {
      setNotes([])
      setSelectedNote(null)
    } else {
      // setNotes
    }
  }, [])

  const selectNote = useCallback((note: Note | null) => {
    setSelectedNote(note)
    setIsAddingNote(false)
  }, [])

  const createNote = useCallback(
    async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
      const newNote = await apiCreateNote(note)
      setNotes((prev) => [...prev, newNote])
      selectNote(newNote)
      // Refetch folders to update notes_count
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      return newNote
    },
    [queryClient]
  )

  const updateNote = useCallback(
    async (noteId: number, note: Partial<Note>) => {
      const updatedNote = await apiUpdateNote(noteId, note)
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updatedNote : n)))
      setSelectedNote(updatedNote)
      return updatedNote
    },
    []
  )

  const startAddNote = useCallback(() => {
    setSelectedNote(null)
    setIsAddingNote(true)
  }, [])

  return (
    <NotesContext.Provider
      value={{
        folders,
        isAddingNote,
        selectedFolder,
        notes,
        selectedNote,
        setFolders,
        selectFolder,
        setNotes,
        selectNote,
        createNote,
        updateNote,
        startAddNote,
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
