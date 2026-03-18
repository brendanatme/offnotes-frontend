import { Folder } from '~/interfaces'
import { useNotes } from '~/context/notes'
import {
  useFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
} from '~/queries/folders'
import { SidebarContent } from './SidebarContent'
import { useState, useRef, useEffect } from 'react'

export function FoldersSidebarContent() {
  const { selectedFolderId, selectFolder, isAddingFolder, stopAddFolder } =
    useNotes()

  const { data: folders = [] } = useFolders()
  const createFolder = useCreateFolder()
  const updateFolder = useUpdateFolder()
  const deleteFolder = useDeleteFolder()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedFolder = folders.find((f) => f.id === selectedFolderId) ?? null

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
      await updateFolder.mutateAsync({
        folderId,
        folder: { name: editValue.trim() },
      })
    }
    setEditingId(null)
  }

  const handleAddFolder = async () => {
    if (editValue.trim()) {
      await createFolder.mutateAsync(editValue.trim())
    } else {
      stopAddFolder()
    }
    setEditValue('')
  }

  const handleDelete = async (folderId: number) => {
    await deleteFolder.mutateAsync(folderId)
  }

  const sortFoldersByDate = (items: Folder[]) =>
    [...items].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  return (
    <SidebarContent<Folder>
      items={sortFoldersByDate(folders)}
      selectedItem={selectedFolder}
      onSelect={(folder) => selectFolder(folder.id)}
      onDoubleClick={handleDoubleClick}
      isEditing={editingId}
      editValue={editValue}
      setEditValue={setEditValue}
      inputRef={inputRef}
      onEditSubmit={handleRename}
      onEditCancel={() => setEditingId(null)}
      onDelete={handleDelete}
      isAdding={isAddingFolder}
      onAddSubmit={handleAddFolder}
      onAddCancel={stopAddFolder}
      getLabel={(folder) => folder.name}
      getSubtitle={(folder) => `(${folder.notes_count})`}
    />
  )
}
