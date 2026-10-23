import type { Comment, Ticket, User } from '../../src/api/types'
import { buildComments } from './seed/comments'
import { buildTickets } from './seed/tickets'
import { CURRENT_USER_ID, users } from './seed/users'

// Changes survive a reload of the tab but every new tab (and every interview) starts from the seed.
const STORAGE_KEY = 'good-tickets-data-v1'

interface Data {
  tickets: Ticket[]
  comments: Comment[]
}

function load(): Data {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Data
  } catch {
    // ignore and fall back to the seed
  }
  const now = Date.now()
  return { tickets: buildTickets(now), comments: buildComments(now) }
}

const data = load()

function save() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage full or disabled, keep the data in memory only
  }
}

export const db = {
  currentUser(): User {
    return users.find((user) => user.id === CURRENT_USER_ID)!
  },
  users(): User[] {
    return users
  },
  tickets(): Ticket[] {
    return data.tickets
  },
  ticket(id: string): Ticket | undefined {
    return data.tickets.find((ticket) => ticket.id.toLowerCase() === id.toLowerCase())
  },
  updateTicket(id: string, patch: Partial<Ticket>): Ticket | undefined {
    const ticket = db.ticket(id)
    if (!ticket) return undefined
    Object.assign(ticket, patch, { updatedAt: new Date().toISOString() })
    save()
    return ticket
  },
  comments(ticketId: string): Comment[] {
    return data.comments
      .filter((comment) => comment.ticketId === ticketId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  },
  addComment(ticketId: string, body: string): Comment {
    const comment: Comment = {
      id: `c-${crypto.randomUUID()}`,
      ticketId,
      authorId: CURRENT_USER_ID,
      body,
      createdAt: new Date().toISOString(),
    }
    data.comments.push(comment)
    save()
    return comment
  },
}
