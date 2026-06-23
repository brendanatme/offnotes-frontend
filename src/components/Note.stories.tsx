import type { Meta, StoryObj } from '@storybook/react-vite'
import Note from './Note'
import {
  AppProviders,
  makeQueryClient,
  WithNoteSelected,
  WithAddNoteActive,
} from '~/stories/mocks'

const meta = {
  title: 'Components/Note',
  component: Note,
} satisfies Meta<typeof Note>

export default meta
type Story = StoryObj<typeof meta>

export const EmptyState: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <div className="flex h-screen">
          <Story />
        </div>
      </AppProviders>
    ),
  ],
}

export const ViewMode: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <WithNoteSelected>
          <div className="flex h-screen">
            <Story />
          </div>
        </WithNoteSelected>
      </AppProviders>
    ),
  ],
}

export const AddMode: Story = {
  decorators: [
    (Story) => (
      <AppProviders queryClient={makeQueryClient()}>
        <WithAddNoteActive>
          <div className="flex h-screen">
            <Story />
          </div>
        </WithAddNoteActive>
      </AppProviders>
    ),
  ],
}
