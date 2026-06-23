import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'Placeholder text' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { value: 'Some value', readOnly: true },
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Password' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
