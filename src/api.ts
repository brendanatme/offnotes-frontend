import axios from 'axios'
import { Folder, Note } from '~/interfaces'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers['Authorization'] = `Token ${token}`
  }
  return config
})

export async function login(values: { username: string; password: string }) {
  const response = await axios.post(`${API_BASE_URL}/api/users/login/`, values)

  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }

  return response.data
}

export async function fetchFolders(): Promise<Folder[]> {
  const response = await axios.get<Folder[]>(
    `${API_BASE_URL}/api/notes/folders/`
  )
  return response.data
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await axios.get<Note[]>(`${API_BASE_URL}/api/notes/notes/`)
  return response.data
}

export async function createNote(
  note: Omit<Note, 'id' | 'created_at' | 'updated_at'>
): Promise<Note> {
  const response = await axios.post<Note>(
    `${API_BASE_URL}/api/notes/notes/`,
    note
  )
  return response.data
}

export async function updateNote(
  noteId: number,
  note: Partial<Note>
): Promise<Note> {
  const response = await axios.patch<Note>(
    `${API_BASE_URL}/api/notes/notes/${noteId}/`,
    note
  )
  return response.data
}

export async function deleteNote(noteId: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api/notes/notes/${noteId}/`)
}

export async function logout() {
  localStorage.removeItem('authToken')
  window.location.href = '/'
}

export function isLoggedIn() {
  return !!localStorage.getItem('authToken')
}
