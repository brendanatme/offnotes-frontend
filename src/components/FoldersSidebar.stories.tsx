import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText('Work')).toBeInTheDocument()
    expect(canvas.getByText('Personal')).toBeInTheDocument()
    expect(canvas.getByText('Projects')).toBeInTheDocument()
  },
}

export const Offline: Story = {
  decorators: [
    (Story) => (
      <AppProviders syncValue={syncOffline} queryClient={makeQueryClient()}>
        <Story />
      </AppProviders>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText('Work')).toBeInTheDocument()
  },
}

export const Empty: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient([], [])}>
        <Story />
      </AppProviders>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Folders')).toBeInTheDocument()
    expect(
      canvas.queryByRole('button', { name: /Work/ })
    ).not.toBeInTheDocument()
  },
}
