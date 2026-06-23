import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from './Button'

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    onAccept: fn(),
    onReject: fn(),
    children: <Button kind="danger">Delete</Button>,
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Delete/i }))

    const body = within(document.body)
    await userEvent.click(body.getByRole('button', { name: 'Yes' }))
    expect(args.onAccept).toHaveBeenCalledOnce()
    expect(args.onReject).not.toHaveBeenCalled()
  },
}

export const CustomText: Story = {
  args: {
    heading: 'Delete this folder?',
    text: 'All notes in this folder will be permanently deleted. This action cannot be undone.',
    children: <Button kind="danger">Delete Folder</Button>,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: /Delete Folder/i })
    )

    const body = within(document.body)
    expect(body.getByText('Delete this folder?')).toBeInTheDocument()
    await userEvent.click(body.getByRole('button', { name: 'No' }))
    expect(args.onReject).toHaveBeenCalledOnce()
    expect(args.onAccept).not.toHaveBeenCalled()
  },
}

export const WrapsAnyTrigger: Story = {
  args: {
    heading: 'Sign out?',
    text: 'You will need to sign in again to access your notes.',
    children: <Button kind="secondary">Sign out</Button>,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Sign out/i }))

    const body = within(document.body)
    expect(body.getByText('Sign out?')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(args.onReject).toHaveBeenCalledOnce()
    expect(args.onAccept).not.toHaveBeenCalled()
  },
}
