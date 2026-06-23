import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotesSidebar } from './NotesSidebar'
import {
  AppProviders,
  makeQueryClient,
  WithFolderSelected,
  syncOffline,
} from '~/stories/mocks'

const meta = {
  title: 'Components/NotesSidebar',
  component: NotesSidebar,
} satisfies Meta<typeof NotesSidebar>

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

export const Offline: Story = {
  decorators: [
    (Story) => (
      <AppProviders syncValue={syncOffline} queryClient={makeQueryClient()}>
        <WithFolderSelected>
          <Story />
        </WithFolderSelected>
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
