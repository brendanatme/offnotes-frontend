import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConflictModal } from './ConflictModal'
import type { SyncableNote } from '~/db'

const localNote: SyncableNote = {
  id: 1,
  user_id: 1,
  folder: 1,
  title: 'Meeting Notes',
  date: '2024-01-15',
  content:
    'Discussed project timeline and deliverables for Q1.\n\nKey action items:\n- Update the roadmap by Friday\n- Schedule follow-up calls with stakeholders',
  created_at: '2024-01-15T09:00:00Z',
  updated_at: '2024-01-15T14:30:00Z',
  latest_commit: 2,
  syncStatus: 'pending',
  localId: 'local-abc',
  serverId: 1,
}

const serverNote = {
  id: 1,
  user_id: 1,
  folder: 1,
  title: 'Meeting Notes',
  date: '2024-01-15',
  content:
    'Discussed Q1 roadmap and deliverables.\n\nDecisions:\n- Launch date pushed to March\n- New hire starting next week',
  created_at: '2024-01-15T09:00:00Z',
  updated_at: '2024-01-15T16:00:00Z',
  latest_commit: 3,
}

const meta = {
  title: 'Components/ConflictModal',
  component: ConflictModal,
  args: {
    conflict: {
      localNote,
      serverNote,
      resolve: () => {},
    },
  },
} satisfies Meta<typeof ConflictModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EmptyContent: Story = {
  args: {
    conflict: {
      localNote: { ...localNote, content: '' },
      serverNote: { ...serverNote, content: '' },
      resolve: () => {},
    },
  },
}
