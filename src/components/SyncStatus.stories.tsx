import type { Meta, StoryObj } from '@storybook/react-vite'
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
}

export const Offline: Story = {
  decorators: [
    (Story) => (
      <SyncContext.Provider value={syncOffline}>
        <Story />
      </SyncContext.Provider>
    ),
  ],
}

export const Syncing: Story = {
  decorators: [
    (Story) => (
      <SyncContext.Provider value={syncSyncing}>
        <Story />
      </SyncContext.Provider>
    ),
  ],
}

export const WithPendingOperations: Story = {
  decorators: [
    (Story) => (
      <SyncContext.Provider value={syncPending}>
        <Story />
      </SyncContext.Provider>
    ),
  ],
}
