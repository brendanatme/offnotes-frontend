import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { SyncStatus } from './SyncStatus'
import { SyncContext } from '~/sync'
import {
  syncOnline,
  syncOffline,
  syncSyncing,
  syncPending,
} from '~/stories/mocks'

const meta = {
  title: 'Components/SyncStatus',
  component: SyncStatus,
} satisfies Meta<typeof SyncStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Online: Story = {
  decorators: [
    (Story) => (
      <SyncContext.Provider value={syncOnline}>
        <Story />
      </SyncContext.Provider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByTitle('Online')).toBeInTheDocument()
  },
}

export const Offline: Story = {
  decorators: [
    (Story) => (
      <SyncContext.Provider value={syncOffline}>
        <Story />
      </SyncContext.Provider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByTitle('Offline')).toBeInTheDocument()
  },
}

export const Syncing: Story = {
  decorators: [
    (Story) => (
      <SyncContext.Provider value={syncSyncing}>
        <Story />
      </SyncContext.Provider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('.animate-spin')).not.toBeNull()
    })
  },
}

export const WithPendingOperations: Story = {
  decorators: [
    (Story) => (
      <SyncContext.Provider value={syncPending}>
        <Story />
      </SyncContext.Provider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('(3 pending)')).toBeInTheDocument()
  },
}
