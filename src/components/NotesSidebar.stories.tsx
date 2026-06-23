import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText('Meeting Notes')).toBeInTheDocument()
    expect(canvas.getByText('Feature Ideas')).toBeInTheDocument()
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText('Meeting Notes')).toBeInTheDocument()
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
    expect(canvas.getByText('Notes')).toBeInTheDocument()
    expect(
      canvas.queryByRole('button', { name: /Meeting Notes/ })
    ).not.toBeInTheDocument()
  },
}
