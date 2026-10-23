export type TicketStatus = 'todo' | 'in_progress' | 'code_review' | 'done'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketType = 'bug' | 'task' | 'story'

export interface User {
  id: string
  name: string
  initials: string
  avatarColor: string
  canViewConfidential: boolean
}

export interface Ticket {
  id: string
  type: TicketType
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId: string | null
  reporterId: string
  labels: string[]
  estimateMinutes: number | null
  confidential: boolean
  createdAt: string
  updatedAt: string
}

export interface TicketSearchResult {
  id: string
  title: string
  status: TicketStatus
  confidential: boolean
}

export interface Comment {
  id: string
  ticketId: string
  authorId: string
  body: string
  createdAt: string
}

export interface Page<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface TicketFilters {
  status?: TicketStatus
  assignee?: string
  label?: string
  page: number
}

export type TicketPatch = Partial<Pick<Ticket, 'status' | 'assigneeId' | 'labels'>>
