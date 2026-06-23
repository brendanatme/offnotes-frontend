import type { Meta, StoryObj } from '@storybook/react-vite'
import { FolderIcon } from './FolderIcon'

const meta = {
  title: 'Icons/FolderIcon',
  component: FolderIcon,
} satisfies Meta<typeof FolderIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: { className: 'w-3 h-3' },
}

export const Large: Story = {
  args: { className: 'w-12 h-12' },
}
