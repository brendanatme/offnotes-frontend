import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '~/api'
import Login from '~/pages/Login'
import Notes from '~/pages/Notes'
import { NotesProvider } from '~/context/notes'
import { ThemeProvider } from '~/context/theme'
import { SyncProvider } from '~/sync'
import { initializeDatabase } from '~/db'
import '~/App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { networkMode: 'always' },
    mutations: { networkMode: 'always' },
  },
})

function InitialRouter() {
  const navigate = useNavigate()

  useEffect(() => {
    if (api.isLoggedIn()) {
      navigate('/notes')
    } else {
      navigate('/login')
    }
  }, [navigate])

  return <div />
}

function App() {
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    initializeDatabase()
      .then(() => setDbReady(true))
      .catch(console.error)
  }, [])

  if (!dbReady) {
    return <div />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <SyncProvider>
            <NotesProvider>
              <Routes>
                <Route path="/" element={<InitialRouter />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </NotesProvider>
          </SyncProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
