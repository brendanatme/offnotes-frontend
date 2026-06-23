import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { PlusIcon } from './PlusIcon'

const meta = {
  title: 'Icons/PlusIcon',
  component: PlusIcon,
} satisfies Meta<typeof PlusIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('svg')).not.toBeNull()
  },
}

export const Small: Story = {
  args: { className: 'w-3 h-3' },
}

export const Large: Story = {
  args: { className: 'w-12 h-12' },
}
