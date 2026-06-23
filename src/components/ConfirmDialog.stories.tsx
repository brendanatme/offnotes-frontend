import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from './Button'

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    onAccept: () => {},
    onReject: () => {},
    children: <Button kind="danger">Delete</Button>,
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomText: Story = {
  args: {
    heading: 'Delete this folder?',
    text: 'All notes in this folder will be permanently deleted. This action cannot be undone.',
    children: <Button kind="danger">Delete Folder</Button>,
  },
}

export const WrapsAnyTrigger: Story = {
  args: {
    heading: 'Sign out?',
    text: 'You will need to sign in again to access your notes.',
    children: <Button kind="secondary">Sign out</Button>,
  },
}
