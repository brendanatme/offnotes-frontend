import * as api from '~/api'
import { Note } from '~/interfaces'
import { useNotes } from '~/context/notes'
import { SidebarContent } from './SidebarContent'
import { useQuery } from '@tanstack/react-query'

export function NotesSidebarContent() {
  const { notes, selectedNote, setNotes, selectNote, selectedFolderId } =
    useNotes()

  const { data: notesData } = useQuery({
    queryKey: ['notes', selectedFolderId],
    queryFn: () => api.fetchNotes(selectedFolderId!),
    enabled: selectedFolderId !== null,
  })

  if (notesData) {
    const sortedNotes = [...notesData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    if (JSON.stringify(sortedNotes) !== JSON.stringify(notes)) {
      setNotes(sortedNotes)
    }
  }

  return (
    <SidebarContent<Note>
      items={notes}
      selectedItem={selectedNote}
      setItems={setNotes}
      onSelect={selectNote}
      getLabel={(note) => note.title}
      getSubtitle={(note) => note.date}
    />
  )
}
