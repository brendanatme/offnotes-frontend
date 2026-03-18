import { Note } from '~/interfaces'
import { useNotes } from '~/context/notes'
import { useNotes as useNotesQuery } from '~/queries/notes'
import { SidebarContent } from './SidebarContent'

export function NotesSidebarContent() {
  const { selectedFolderId, selectedNoteId, selectNote } = useNotes()

  const { data: notes = [] } = useNotesQuery(selectedFolderId ?? undefined)

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const selectedNote = sortedNotes.find((n) => n.id === selectedNoteId) ?? null

  return (
    <SidebarContent<Note>
      items={sortedNotes}
      selectedItem={selectedNote}
      onSelect={(note) => selectNote(note.id)}
      getLabel={(note) => note.title}
      getSubtitle={(note) => note.date}
    />
  )
}
