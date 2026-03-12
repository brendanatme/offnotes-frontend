import { Link } from 'react-router-dom'
import * as api from '~/api'
import { FoldersSidebar } from '~/components/FoldersSidebar'
import { NotesSidebar } from '~/components/NotesSidebar'
import Note from '~/components/Note'
import { useNotes } from '~/context/notes'

function Notes() {
  const { folders, selectedFolder, notes, selectedNote } = useNotes()

  // context values are available for rendering or logic

  return (
    <>
      {/* debug info: could be replaced once UI is built */}
      <div className="sr-only">
        Folders: {folders.length}, notes: {notes.length}, selected-folder:{' '}
        {selectedFolder?.name ?? 'none'}, selected-note:{' '}
        {selectedNote?.title ?? 'none'}
      </div>
      <div className="flex flex-col h-screen w-screen bg-neutral-800 text-neutral-200">
        <header className="h-14 shrink-0 bg-neutral-800 flex items-center justify-between px-6 border-b border-neutral-500">
          <h1 className="text-lg font-semibold">Offnotes</h1>
          <nav className="flex gap-4">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <button
              className="cursor-pointer hover:underline"
              onClick={api.logout}
            >
              Logout
            </button>
            <Link to="#" className="hover:underline">
              Import
            </Link>
            <Link to="#" className="hover:underline">
              Export
            </Link>
          </nav>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <FoldersSidebar />
          <NotesSidebar />
          <main className="flex-1 bg-neutral-800 flex min-h-0 overflow-hidden">
            <Note />
          </main>
        </div>
      </div>
    </>
  )
}

export default Notes
