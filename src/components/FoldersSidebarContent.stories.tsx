import type { Meta, StoryObj } from '@storybook/react-vite'
import { FoldersSidebarContent } from './FoldersSidebarContent'
import { AppProviders, makeQueryClient } from '~/stories/mocks'

const meta = {
  title: 'Components/FoldersSidebarContent',
  component: FoldersSidebarContent,
} satisfies Meta<typeof FoldersSidebarContent>

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

export const Empty: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient([], [])}>
        <Story />
      </AppProviders>
    ),
  ],
}
