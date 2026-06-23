import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo } from './Logo'
import { SyncContext } from '~/sync'
import { syncOnline, syncOffline } from '~/stories/mocks'

const meta = {
  title: 'Components/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>

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
