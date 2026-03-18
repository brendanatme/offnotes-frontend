import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'

export interface NotesContextType {
  selectedFolderId: number | null
  selectedNoteId: number | null
  isAddingNote: boolean
  isAddingFolder: boolean
  selectFolder: (folderId: number | null) => void
  selectNote: (noteId: number | null) => void
  startAddNote: () => void
  stopAddNote: () => void
  startAddFolder: () => void
  stopAddFolder: () => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isAddingFolder, setIsAddingFolder] = useState(false)

  const selectFolder = useCallback((folderId: number | null) => {
    setSelectedFolderId(folderId)
    setSelectedNoteId(null)
  }, [])

  const selectNote = useCallback((noteId: number | null) => {
    setSelectedNoteId(noteId)
    setIsAddingNote(false)
  }, [])

  const startAddNote = useCallback(() => {
    setSelectedNoteId(null)
    setIsAddingNote(true)
  }, [])

  const stopAddNote = useCallback(() => {
    setIsAddingNote(false)
  }, [])

  const startAddFolder = useCallback(() => {
    setIsAddingFolder(true)
  }, [])

  const stopAddFolder = useCallback(() => {
    setIsAddingFolder(false)
  }, [])

  return (
    <NotesContext.Provider
      value={{
        selectedFolderId,
        selectedNoteId,
        isAddingNote,
        isAddingFolder,
        selectFolder,
        selectNote,
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
