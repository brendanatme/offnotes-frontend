import * as api from '~/api'
import { Folder } from '~/interfaces'
import { useNotes } from '~/context/notes'
import { SidebarContent } from './SidebarContent'

export function FoldersSidebarContent() {
  const { folders, selectedFolder, setFolders, selectFolder } = useNotes()

  return (
    <SidebarContent<Folder>
      queryKey={['folders']}
      queryFn={api.fetchFolders}
      items={folders}
      selectedItem={selectedFolder}
      setItems={setFolders}
      onSelect={selectFolder}
      getLabel={(folder) => folder.name}
      getSubtitle={(folder) => `(${folder.notes_count})`}
    />
  )
}
