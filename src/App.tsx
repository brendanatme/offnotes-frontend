import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '~/api'
import Login from '~/pages/Login'
import Notes from '~/pages/Notes'
import { NotesProvider } from '~/context/notes'
import { ThemeProvider } from '~/context/theme'
import '~/App.css'

const queryClient = new QueryClient()

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
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <NotesProvider>
            <Routes>
              <Route path="/" element={<InitialRouter />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </NotesProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
