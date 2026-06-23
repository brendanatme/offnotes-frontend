import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from './Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'Placeholder text' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.type(input, 'Hello world')
    expect(input).toHaveValue('Hello world')
  },
}

export const WithValue: Story = {
  args: { value: 'Some value', readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByDisplayValue('Some value')).toBeInTheDocument()
  },
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Password' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Password')
    expect(input).toHaveAttribute('type', 'password')
    await userEvent.type(input, 'secret123')
    expect(input).toHaveValue('secret123')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('textbox')).toBeDisabled()
  },
}
