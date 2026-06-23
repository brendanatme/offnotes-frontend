import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Sidebar } from './Sidebar'
import { FolderIcon } from './icons/FolderIcon'
import { PaperIcon } from './icons/PaperIcon'
import { Button } from './Button'
import { PlusIcon } from './icons/PlusIcon'

const SampleContent = () => (
  <ul>
    {['Work', 'Personal', 'Projects'].map((name) => (
      <li
        key={name}
        className="border-b border-neutral-300 dark:border-neutral-500 text-sm"
      >
        <button className="w-full flex justify-between items-center px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left">
          <span>{name}</span>
        </button>
      </li>
    ))}
  </ul>
)

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  args: {
    icon: <FolderIcon className="w-4 h-4" />,
    title: 'Folders',
    section: 'folders',
    contentComponent: <SampleContent />,
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Folders')).toBeInTheDocument()

    await userEvent.click(
      canvas.getByRole('button', { name: /Collapse folders/i })
    )
    expect(canvas.queryByText('Folders')).not.toBeInTheDocument()
  },
}

export const WithActionButton: Story = {
  args: {
    actionButtonComponent: (
      <Button kind="primary" size="sm" className="gap-1">
        <PlusIcon className="w-3 h-3" />
        Add
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('button', { name: /Add/i })).toBeInTheDocument()

    await userEvent.click(
      canvas.getByRole('button', { name: /Collapse folders/i })
    )
    expect(
      canvas.queryByRole('button', { name: /^Add$/i })
    ).not.toBeInTheDocument()
  },
}

export const Notes: Story = {
  args: {
    icon: <PaperIcon className="w-4 h-4" />,
    title: 'Notes',
    section: 'notes',
    contentComponent: (
      <ul>
        {[
          { title: 'Meeting Notes', date: '2024-01-15' },
          { title: 'Feature Ideas', date: '2024-01-10' },
        ].map((note) => (
          <li
            key={note.title}
            className="border-b border-neutral-300 dark:border-neutral-500 text-sm"
          >
            <button className="w-full flex justify-between items-center px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left">
              <span>{note.title}</span>
              <span className="text-neutral-500 text-xs">{note.date}</span>
            </button>
          </li>
        ))}
      </ul>
    ),
    actionButtonComponent: (
      <Button kind="primary" size="sm" className="gap-1">
        <PlusIcon className="w-3 h-3" />
        Add
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Notes')).toBeInTheDocument()
    expect(canvas.getByText('Meeting Notes')).toBeInTheDocument()
  },
}
