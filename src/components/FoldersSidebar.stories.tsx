import type { Meta, StoryObj } from '@storybook/react-vite'
import { FoldersSidebar } from './FoldersSidebar'
import { AppProviders, makeQueryClient, syncOffline } from '~/stories/mocks'

const meta = {
  title: 'Components/FoldersSidebar',
  component: FoldersSidebar,
} satisfies Meta<typeof FoldersSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <Story />
      </AppProviders>
    ),
  ],
}

export const Offline: Story = {
  decorators: [
    (Story) => (
      <AppProviders syncValue={syncOffline} queryClient={makeQueryClient()}>
        <Story />
      </AppProviders>
    ),
  ],
}

export const Empty: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient([], [])}>
        <Story />
      </AppProviders>
    ),
  ],
}
