import * as api from '~/api'
import { Folder } from '~/interfaces'
import { useNotes } from '~/context/notes'
import { SidebarContent } from './SidebarContent'
import { useState, useRef, useEffect } from 'react'

export function FoldersSidebarContent() {
  const {
    folders,
    selectedFolder,
    setFolders,
    selectFolder,
    updateFolder,
    isAddingFolder,
    createFolder,
    stopAddFolder,
  } = useNotes()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingId])

  useEffect(() => {
    if (isAddingFolder && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAddingFolder])

  const handleDoubleClick = (folder: Folder) => {
    setEditingId(folder.id)
    setEditValue(folder.name)
  }

  const handleRename = async (folderId: number) => {
    if (editValue.trim()) {
      await updateFolder(folderId, { name: editValue.trim() })
    }
    setEditingId(null)
  }

  const handleAddFolder = async () => {
    if (editValue.trim()) {
      await createFolder(editValue.trim())
    } else {
      stopAddFolder()
    }
    setEditValue('')
  }

  return (
    <SidebarContent<Folder>
      queryKey={['folders']}
      queryFn={api.fetchFolders}
      items={folders}
      selectedItem={selectedFolder}
      setItems={setFolders}
      onSelect={selectFolder}
      onDoubleClick={handleDoubleClick}
      isEditing={editingId}
      editValue={editValue}
      setEditValue={setEditValue}
      inputRef={inputRef}
      onEditSubmit={handleRename}
      onEditCancel={() => setEditingId(null)}
      isAdding={isAddingFolder}
      onAddSubmit={handleAddFolder}
      onAddCancel={stopAddFolder}
      getLabel={(folder) => folder.name}
      getSubtitle={(folder) => `(${folder.notes_count})`}
    />
  )
}
