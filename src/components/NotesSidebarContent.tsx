import * as api from '~/api'
import { Note } from '~/interfaces'
import { useNotes } from '~/context/notes'
import { SidebarContent } from './SidebarContent'

export function NotesSidebarContent() {
  const { notes, selectedNote, setNotes, selectNote } = useNotes()

  return (
    <SidebarContent<Note>
      queryKey={['notes']}
      queryFn={api.fetchNotes}
      items={notes}
      selectedItem={selectedNote}
      setItems={setNotes}
      onSelect={selectNote}
      getLabel={(note) => note.title}
      getSubtitle={(note) => note.date}
    />
  )
}
