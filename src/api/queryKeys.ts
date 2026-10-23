import type { TicketFilters } from './types'

export const queryKeys = {
  me: ['me'] as const,
  users: ['users'] as const,
  tickets: {
    all: ['tickets'] as const,
    lists: ['tickets', 'list'] as const,
    list: (filters: TicketFilters) => ['tickets', 'list', filters] as const,
    detail: (id: string) => ['tickets', 'detail', id] as const,
    comments: (id: string) => ['tickets', 'detail', id, 'comments'] as const,
  },
}
