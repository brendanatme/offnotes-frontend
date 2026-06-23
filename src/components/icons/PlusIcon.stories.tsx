import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon } from './PlusIcon'

const meta = {
  title: 'Icons/PlusIcon',
  component: PlusIcon,
} satisfies Meta<typeof PlusIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: { className: 'w-3 h-3' },
}

export const Large: Story = {
  args: { className: 'w-12 h-12' },
}
