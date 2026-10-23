import type { Ticket } from '../../src/api'

export type TicketType = 'bug' | 'task' | 'story'

/** The API returns a few more fields than the app uses. */
export type StoredTicket = Ticket & { type: TicketType; reporterId: string; updatedAt: string }
