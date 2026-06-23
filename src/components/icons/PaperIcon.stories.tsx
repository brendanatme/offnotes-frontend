import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { PaperIcon } from './PaperIcon'

const meta = {
  title: 'Icons/PaperIcon',
  component: PaperIcon,
} satisfies Meta<typeof PaperIcon>

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
