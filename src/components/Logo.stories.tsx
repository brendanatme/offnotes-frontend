import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument()
    // Online state: Ø has green color class
    expect(canvas.getByText('Ø')).toHaveClass('text-green-600')
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
    // Offline state: Ø has amber color class
    expect(canvas.getByText('Ø')).toHaveClass('text-amber-600')
  },
}
