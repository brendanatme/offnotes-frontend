import { NotesSidebarContent } from './NotesSidebarContent'
import { Sidebar } from './Sidebar'
import { PlusIcon } from './icons/PlusIcon'
import { PaperIcon } from './icons/PaperIcon'
import { useNotes } from '~/context/notes'
import { Button } from './Button'

export function NotesSidebar() {
  const { startAddNote } = useNotes()

  return (
    <Sidebar
      icon={<PaperIcon className="w-4 h-4" />}
      title="Notes"
      section="notes"
      contentComponent={<NotesSidebarContent />}
      actionButtonComponent={
        <Button
          className="gap-1"
          onClick={startAddNote}
          kind="primary"
          size="sm"
        >
          <PlusIcon className="w-3 h-3" />
          Add
        </Button>
      }
    />
  )
}

export default NotesSidebar
