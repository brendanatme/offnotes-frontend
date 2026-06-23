import type { Meta, StoryObj } from '@storybook/react-vite'
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
}
