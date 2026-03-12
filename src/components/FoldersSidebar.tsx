import { FoldersSidebarContent } from './FoldersSidebarContent'
import { Sidebar } from './Sidebar'
import { FolderIcon } from './icons/FolderIcon'

export function FoldersSidebar() {
  return (
    <Sidebar
      icon={<FolderIcon className="w-4 h-4" />}
      title="Folders"
      section="folders"
      contentComponent={<FoldersSidebarContent />}
    />
  )
}

export default FoldersSidebar
