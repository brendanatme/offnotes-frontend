import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
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
    onSelect: fn(),
    getLabel: (f) => f.name,
    getSubtitle: (f) => `(${f.notes_count})`,
  },
} satisfies Meta<typeof SidebarContent<Folder>>

export default meta

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Work/ }))
    expect(args.onSelect).toHaveBeenCalledWith(mockFolders[0])
  },
}

export const WithSelectedItem: Story = {
  args: {
    selectedItem: mockFolders[0],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('button', { name: /Work/ })).toHaveClass(
      'bg-neutral-200'
    )

    await userEvent.click(canvas.getByRole('button', { name: /Personal/ }))
    expect(args.onSelect).toHaveBeenCalledWith(mockFolders[1])
  },
}

export const WithEditingItem: Story = {
  args: {
    onEditSubmit: fn(),
    onEditCancel: fn(),
    onDelete: fn(),
  },
  render: (args) => {
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
        onEditSubmit={args.onEditSubmit}
        onEditCancel={args.onEditCancel}
        onDelete={args.onDelete}
      />
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    expect(input).toHaveValue('Work Renamed')
    await userEvent.click(input)
    await userEvent.keyboard('{Enter}')
    expect(args.onEditSubmit).toHaveBeenCalledWith(1)
  },
}

export const WithAddingItem: Story = {
  args: {
    onAddSubmit: fn(),
    onAddCancel: fn(),
  },
  render: (args) => {
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
        onAddSubmit={args.onAddSubmit}
        onAddCancel={args.onAddCancel}
      />
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const addInput = canvas.getByPlaceholderText('New folder name')
    expect(addInput).toBeInTheDocument()
    await userEvent.click(addInput)
    await userEvent.keyboard('{Escape}')
    expect(args.onAddCancel).toHaveBeenCalledOnce()
  },
}

export const Empty: Story = {
  args: {
    items: [],
    selectedItem: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}
