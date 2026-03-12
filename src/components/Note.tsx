import { useRef, useEffect, useState, useCallback } from 'react'
import { useNotes } from '~/context/notes'
import { Note as NoteInterface } from '~/interfaces'
import { PlusIcon } from './icons/PlusIcon'
import { Button } from './Button'

export default function Note() {
  const {
    selectedNote,
    selectedFolder,
    selectNote,
    createNote,
    updateNote,
    isAddingNote,
    startAddNote,
  } = useNotes()
  const [isEditing, setIsEditing] = useState(false)
  const [editedNote, setEditedNote] = useState<Partial<NoteInterface> | null>(
    null
  )
  const [isSaving, setIsSaving] = useState(false)

  const titleRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAddingNote) {
      const today = new Date()
      const formattedDate = formatDateToYYYYMMDD(today)

      setEditedNote({
        title: '',
        date: formattedDate,
        content: '',
        folder: selectedFolder?.id || 1,
      })
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddingNote])

  // Reset to view state when selected note changes
  useEffect(() => {
    setIsEditing(false)
    setEditedNote(null)
  }, [selectedNote?.id])

  // Set contentEditable text content when editing state changes
  useEffect(() => {
    if (isEditing && editedNote) {
      if (titleRef.current) {
        titleRef.current.textContent = editedNote.title || ''
      }
      if (dateRef.current) {
        dateRef.current.textContent = editedNote.date || ''
      }
      if (contentRef.current) {
        contentRef.current.innerText = editedNote.content || ''
      }

      // Focus title when creating a new note
      if (!selectedNote && titleRef.current) {
        titleRef.current.focus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, selectedNote])

  const formatDateToYYYYMMDD = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }

  const handleAddNote = () => {
    const today = new Date()
    const formattedDate = formatDateToYYYYMMDD(today)

    setEditedNote({
      title: '',
      date: formattedDate,
      content: '',
      folder: selectedFolder?.id || 1,
    })
    startAddNote()
  }

  const handleEditStart = () => {
    if (selectedNote) {
      setEditedNote(selectedNote)
      setIsEditing(true)
    }
  }

  const handleSave = useCallback(async () => {
    if (!editedNote) return
    setIsSaving(true)

    try {
      if (selectedNote) {
        // Update existing note
        await updateNote(selectedNote.id, {
          title: editedNote.title || '',
          date: editedNote.date || '',
          content: editedNote.content || '',
        })
      } else {
        // Create new note
        const newNote = await createNote({
          title: editedNote.title || '',
          date: editedNote.date || '',
          content: editedNote.content || '',
          folder: editedNote.folder || selectedFolder?.id || 1,
          user: null,
        })
        selectNote(newNote)
      }
      setIsEditing(false)
      setEditedNote(null)
    } catch (error) {
      console.error('Failed to save note:', error)
    } finally {
      setIsSaving(false)
    }
  }, [
    editedNote,
    selectedNote,
    updateNote,
    createNote,
    selectNote,
    selectedFolder,
  ])

  const handleCancel = () => {
    setIsEditing(false)
    setEditedNote(null)
  }

  // attach keyboard shortcut while editing
  useEffect(() => {
    if (!isEditing) return

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isEditing, handleSave])

  const handleFieldChange = (field: string, value: string) => {
    setEditedNote((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!selectedNote && !isEditing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-800 px-8">
        <Button
          onClick={handleAddNote}
          kind="secondary"
          className="w-full flex-col gap-4 px-8 py-6 rounded-lg"
        >
          <PlusIcon className="w-16 h-16 text-neutral-400" />
          <span className="text-2xl font-semibold text-neutral-200">
            Add a Note
          </span>
        </Button>
      </div>
    )
  }

  if (!isEditing && selectedNote) {
    return (
      <div className="flex-1 flex flex-col bg-neutral-800 p-8 overflow-auto min-h-0">
        <h1 className="text-4xl font-bold text-neutral-100 my-4 text-left">
          {selectedNote.title}
        </h1>
        <p className="text-xl text-neutral-400 mb-8 text-left">
          {new Date(selectedNote.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        <p className="text-base text-neutral-300 flex-1 whitespace-pre-wrap text-left">
          {selectedNote.content}
        </p>
        <div className="flex justify-end gap-3 mt-8">
          <Button onClick={handleEditStart}>Edit</Button>
        </div>
      </div>
    )
  }

  // Editing view
  return (
    <div className="flex-1 flex flex-col bg-neutral-800 p-8 min-h-0">
      <div
        ref={titleRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) =>
          handleFieldChange('title', e.currentTarget.textContent || '')
        }
        className="text-4xl font-bold text-neutral-100 my-4 outline-none border-b-2 border-transparent hover:border-neutral-600 focus:border-gray-500 pb-2 cursor-text text-left shrink-0"
      />

      <div
        ref={dateRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) =>
          handleFieldChange('date', e.currentTarget.textContent || '')
        }
        className="text-xl text-neutral-400 mb-8 outline-none border-b-2 border-transparent hover:border-neutral-600 focus:border-gray-500 pb-2 cursor-text text-left shrink-0"
      />

      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) =>
          handleFieldChange('content', e.currentTarget.innerText || '')
        }
        className="text-base text-neutral-300 flex-1 outline-none border-b-2 border-transparent hover:border-neutral-600 focus:border-gray-500 pb-2 cursor-text whitespace-pre-wrap text-left overflow-y-auto min-h-0"
      />

      <div className="flex justify-end gap-3 mt-8 shrink-0">
        <Button key="Cancel" onClick={handleCancel} kind="secondary">
          Cancel
        </Button>
        <Button key="Save" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
