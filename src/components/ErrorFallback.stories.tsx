import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Error')).toBeInTheDocument()
    expect(canvas.getByText(/There was an error loading/)).toBeInTheDocument()
  },
}

export const WithSection: Story = {
  args: { section: 'the notes sidebar' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText(/the notes sidebar/)).toBeInTheDocument()
  },
}
