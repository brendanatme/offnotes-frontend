import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { NotesSidebarContent } from './NotesSidebarContent'
import {
  AppProviders,
  makeQueryClient,
  WithFolderSelected,
  WithNoteSelected,
} from '~/stories/mocks'

const meta = {
  title: 'Components/NotesSidebarContent',
  component: NotesSidebarContent,
} satisfies Meta<typeof NotesSidebarContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <WithFolderSelected>
          <Story />
        </WithFolderSelected>
      </AppProviders>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText('Meeting Notes')).toBeInTheDocument()
    expect(canvas.getByText('Feature Ideas')).toBeInTheDocument()
  },
}

export const WithSelectedNote: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <WithNoteSelected>
          <Story />
        </WithNoteSelected>
      </AppProviders>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const meetingNotesButton = await canvas.findByRole('button', {
      name: /Meeting Notes/,
    })
    expect(meetingNotesButton).toHaveClass('bg-neutral-200')
  },
}

export const Empty: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient([], [])}>
        <WithFolderSelected>
          <Story />
        </WithFolderSelected>
      </AppProviders>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      canvas.queryByRole('button', { name: /Meeting Notes/ })
    ).not.toBeInTheDocument()
  },
}
