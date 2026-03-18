import { Link } from 'react-router-dom'
import * as api from '~/api'
import { FoldersSidebar } from '~/components/FoldersSidebar'
import { NotesSidebar } from '~/components/NotesSidebar'
import Note from '~/components/Note'
import { useTheme } from '~/context/theme'

function Notes() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200">
        <div className="flex flex-1 overflow-hidden">
          <FoldersSidebar />
          <NotesSidebar />
          <main className="flex-1 flex min-h-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <Note />
          </main>
        </div>
        <header className="h-14 shrink-0 flex items-center justify-between px-6 border-t border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-800">
          <h1 className="text-lg font-semibold">&Oslash;ffNotes</h1>
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
            {/* <Link to="#" className="hover:underline">
              Import
            </Link>
            <Link to="#" className="hover:underline">
              Export
            </Link> */}
            <button
              className="cursor-pointer hover:underline"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </nav>
        </header>
      </div>
    </>
  )
}

export default Notes
