import type { User } from '../../src/api'
import { buildTickets } from './seed/tickets'
import { CURRENT_USER_ID, users } from './seed/users'
import type { StoredTicket } from './types'

// Changes survive a reload of the tab but every new tab (and every interview) starts from the seed.
const STORAGE_KEY = 'good-tickets-data-v2'

interface Data {
  tickets: StoredTicket[]
}

function load(): Data {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Data
  } catch {
    // ignore and fall back to the seed
  }
  const now = Date.now()
  return { tickets: buildTickets(now) }
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
  tickets(): StoredTicket[] {
    return data.tickets
  },
  ticket(id: string): StoredTicket | undefined {
    return data.tickets.find((ticket) => ticket.id.toLowerCase() === id.toLowerCase())
  },
  updateTicket(id: string, patch: Partial<StoredTicket>): StoredTicket | undefined {
    const ticket = db.ticket(id)
    if (!ticket) return undefined
    Object.assign(ticket, patch, { updatedAt: new Date().toISOString() })
    save()
    return ticket
  },
}
