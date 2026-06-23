import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { WifiIcon, WifiOffIcon, RefreshIcon } from './WifiIcon'

const meta = {
  title: 'Icons/WifiIcon',
  component: WifiIcon,
} satisfies Meta<typeof WifiIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Online: Story = {
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('svg')).not.toBeNull()
  },
}

export const Offline: Story = {
  render: (args) => <WifiOffIcon {...args} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('svg')).not.toBeNull()
  },
}

export const Refresh: Story = {
  render: (args) => <RefreshIcon {...args} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('svg')).not.toBeNull()
  },
}

export const RefreshSpinning: Story = {
  render: (args) => <RefreshIcon {...args} className="w-4 h-4 animate-spin" />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.animate-spin')).not.toBeNull()
  },
}

export const Large: Story = {
  args: { className: 'w-12 h-12' },
}
