import type { Meta, StoryObj } from '@storybook/react-vite'
import { WifiIcon, WifiOffIcon, RefreshIcon } from './WifiIcon'

const meta = {
  title: 'Icons/WifiIcon',
  component: WifiIcon,
} satisfies Meta<typeof WifiIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Online: Story = {}

export const Offline: Story = {
  render: (args) => <WifiOffIcon {...args} />,
}

export const Refresh: Story = {
  render: (args) => <RefreshIcon {...args} />,
}

export const RefreshSpinning: Story = {
  render: (args) => <RefreshIcon {...args} className="w-4 h-4 animate-spin" />,
}

export const Large: Story = {
  args: { className: 'w-12 h-12' },
}
