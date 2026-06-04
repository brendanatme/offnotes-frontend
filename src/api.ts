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

function storeAuthData(data: {
  token?: string
  user_id?: number
  user?: { id: number }
}) {
  if (data.token) {
    localStorage.setItem('authToken', data.token)
  }
  const userId = data.user_id ?? data.user?.id
  if (userId !== undefined) {
    localStorage.setItem('userId', String(userId))
  }
}

export function getUserId(): number | null {
  const id = localStorage.getItem('userId')
  return id ? Number(id) : null
}

export async function signup(values: { email: string; password: string }) {
  const response = await axios.post(`${API_BASE_URL}/api/users/signup/`, {
    ...values,
    username: values.email,
  })

  storeAuthData(response.data)

  return response.data
}

export async function login(values: { username: string; password: string }) {
  const response = await axios.post(`${API_BASE_URL}/api/users/login/`, values)

  storeAuthData(response.data)

  return response.data
}

export async function fetchFolders(): Promise<Folder[]> {
  const response = await axios.get<Folder[]>(
    `${API_BASE_URL}/api/notes/folders/`
  )
  return response.data
}

export async function updateFolder(
  folderId: number,
  folder: Partial<Folder>
): Promise<Folder> {
  const response = await axios.patch<Folder>(
    `${API_BASE_URL}/api/notes/folders/${folderId}/`,
    folder
  )
  return response.data
}

export async function createFolder(folder: { name: string }): Promise<Folder> {
  const response = await axios.post<Folder>(
    `${API_BASE_URL}/api/notes/folders/`,
    folder
  )
  return response.data
}

export async function deleteFolder(folderId: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api/notes/folders/${folderId}/`)
}

export async function fetchNotes(folderId?: number): Promise<Note[]> {
  if (folderId === undefined) {
    return []
  }
  const url = `${API_BASE_URL}/api/notes/notes/?folder=${folderId}`
  const response = await axios.get<Note[]>(url)
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
  localStorage.removeItem('userId')
  window.location.href = '/'
}

export function isLoggedIn() {
  return !!localStorage.getItem('authToken')
}
