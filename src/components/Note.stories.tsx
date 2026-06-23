import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import Note from './Note'
import {
  AppProviders,
  makeQueryClient,
  WithNoteSelected,
  WithAddNoteActive,
} from '~/stories/mocks'

const meta = {
  title: 'Components/Note',
  component: Note,
} satisfies Meta<typeof Note>

export default meta
type Story = StoryObj<typeof meta>

export const EmptyState: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <div className="flex h-screen">
          <Story />
        </div>
      </AppProviders>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const addButton = await canvas.findByRole('button', { name: /Add a Note/i })
    expect(addButton).toBeInTheDocument()

    await userEvent.click(addButton)
    expect(
      await canvas.findByRole('button', { name: 'Save' })
    ).toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  },
}

export const ViewMode: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <WithNoteSelected>
          <div className="flex h-screen">
            <Story />
          </div>
        </WithNoteSelected>
      </AppProviders>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      await canvas.findByRole('heading', { name: 'Meeting Notes', level: 1 })
    ).toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'Edit' })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Edit' }))
    expect(
      await canvas.findByRole('button', { name: 'Save' })
    ).toBeInTheDocument()
  },
}

export const AddMode: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <WithAddNoteActive>
          <div className="flex h-screen">
            <Story />
          </div>
        </WithAddNoteActive>
      </AppProviders>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      await canvas.findByRole('button', { name: 'Save' })
    ).toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    expect(
      await canvas.findByRole('button', { name: /Add a Note/i })
    ).toBeInTheDocument()
  },
}
