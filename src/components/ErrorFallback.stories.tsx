import type { Meta, StoryObj } from '@storybook/react-vite'
import ErrorFallback from './ErrorFallback'

const meta = {
  title: 'Components/ErrorFallback',
  component: ErrorFallback,
  args: {
    error: new Error('Something went wrong'),
    resetErrorBoundary: () => {},
  },
} satisfies Meta<typeof ErrorFallback>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSection: Story = {
  args: { section: 'the notes sidebar' },
}
