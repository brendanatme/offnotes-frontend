import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { kind: 'primary' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Secondary: Story = {
  args: { kind: 'secondary' },
}

export const Danger: Story = {
  args: { kind: 'danger' },
}

export const Success: Story = {
  args: { kind: 'success' },
}

export const Warning: Story = {
  args: { kind: 'warning' },
}

export const Invisible: Story = {
  args: { kind: 'invisible' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Medium: Story = {
  args: { size: 'md' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span className="mr-1">+</span> Add Folder
      </>
    ),
    kind: 'primary',
    size: 'sm',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    expect(args.onClick).toHaveBeenCalledOnce()
  },
}
