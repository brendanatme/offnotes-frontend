import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText('Work')).toBeInTheDocument()
    expect(canvas.getByText('Personal')).toBeInTheDocument()
    expect(canvas.getByText('Projects')).toBeInTheDocument()
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
    expect(
      canvas.queryByRole('button', { name: /Work/ })
    ).not.toBeInTheDocument()
  },
}
