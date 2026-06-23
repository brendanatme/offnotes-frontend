import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import { SidebarContent } from './SidebarContent'
import type { Folder } from '~/interfaces'

type Story = StoryObj<typeof SidebarContent<Folder>>

const mockFolders: Folder[] = [
  {
    id: 1,
    user_id: 1,
    name: 'Work',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    notes_count: 3,
  },
  {
    id: 2,
    user_id: 1,
    name: 'Personal',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    notes_count: 1,
  },
  {
    id: 3,
    user_id: 1,
    name: 'Projects',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    notes_count: 0,
  },
]

const meta = {
  title: 'Components/SidebarContent',
  component: SidebarContent<Folder>,
  args: {
    items: mockFolders,
    selectedItem: null,
    onSelect: () => {},
    getLabel: (f) => f.name,
    getSubtitle: (f) => `(${f.notes_count})`,
  },
} satisfies Meta<typeof SidebarContent<Folder>>

export default meta

export const Default: Story = {}

export const WithSelectedItem: Story = {
  args: {
    selectedItem: mockFolders[0],
  },
}

export const WithEditingItem: Story = {
  render: () => {
    const inputRef = useRef<HTMLInputElement>(null)
    return (
      <SidebarContent<Folder>
        items={mockFolders}
        selectedItem={mockFolders[0]}
        onSelect={() => {}}
        getLabel={(f) => f.name}
        getSubtitle={(f) => `(${f.notes_count})`}
        isEditing={1}
        editValue="Work Renamed"
        setEditValue={() => {}}
        inputRef={inputRef}
        onEditSubmit={() => {}}
        onEditCancel={() => {}}
        onDelete={() => {}}
      />
    )
  },
}

export const WithAddingItem: Story = {
  render: () => {
    const inputRef = useRef<HTMLInputElement>(null)
    return (
      <SidebarContent<Folder>
        items={mockFolders}
        selectedItem={null}
        onSelect={() => {}}
        getLabel={(f) => f.name}
        getSubtitle={(f) => `(${f.notes_count})`}
        isAdding
        editValue=""
        setEditValue={() => {}}
        inputRef={inputRef}
        onAddSubmit={() => {}}
        onAddCancel={() => {}}
      />
    )
  },
}

export const Empty: Story = {
  args: {
    items: [],
    selectedItem: null,
  },
}
