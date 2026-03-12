export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface Folder {
  id: number
  user: number | null
  name: string
  created_at: string
  updated_at: string
  notes_count: number
}

export interface Note {
  id: number
  user: number | null
  folder: number
  title: string
  date: string
  content: string
  created_at: string
  updated_at: string
}
