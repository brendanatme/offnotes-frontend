import { FoldersSidebarContent } from './FoldersSidebarContent'
import { Sidebar } from './Sidebar'
import { FolderIcon } from './icons/FolderIcon'
import { PlusIcon } from './icons/PlusIcon'
import { useNotes } from '~/context/notes'
import { Button } from './Button'

export function FoldersSidebar() {
  const { startAddFolder } = useNotes()

  return (
    <Sidebar
      icon={<FolderIcon className="w-4 h-4" />}
      title="Folders"
      section="folders"
      contentComponent={<FoldersSidebarContent />}
      actionButtonComponent={
        <Button
          className="gap-1"
          onClick={startAddFolder}
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

export default FoldersSidebar
