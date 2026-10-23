import { http, HttpResponse } from 'msw'
import type {
  Page,
  Ticket,
  TicketPatch,
  TicketPriority,
  TicketSearchResult,
  TicketStatus,
} from '../../src/api/types'
import { db } from './db'
import { networkDelay, searchDelay } from './latency'

const API = `${import.meta.env.BASE_URL}api`
const PAGE_SIZE = 20

const PRIORITY_RANK: Record<TicketPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
const STATUSES: TicketStatus[] = ['todo', 'in_progress', 'code_review', 'done']

function keyNumber(ticket: Ticket) {
  return Number(ticket.id.split('-')[1])
}

function byPriorityThenKey(a: Ticket, b: Ticket) {
  return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || keyNumber(a) - keyNumber(b)
}

function notFound() {
  return HttpResponse.json({ message: 'Ticket not found' }, { status: 404 })
}

export const handlers = [
  http.get(`${API}/me`, async () => {
    await networkDelay()
    return HttpResponse.json(db.currentUser())
  }),

  http.get(`${API}/users`, async () => {
    await networkDelay()
    return HttpResponse.json(db.users())
  }),

  // Must be registered before /tickets/:id.
  http.get(`${API}/tickets/search`, async ({ request }) => {
    const query = (new URL(request.url).searchParams.get('q') ?? '').trim().toLowerCase()
    await searchDelay(query)
    if (!query) return HttpResponse.json([])

    const results: TicketSearchResult[] = db
      .tickets()
      .filter((ticket) => ticket.id.toLowerCase().includes(query) || ticket.title.toLowerCase().includes(query))
      .sort((a, b) => {
        const aKey = a.id.toLowerCase().startsWith(query) ? 0 : 1
        const bKey = b.id.toLowerCase().startsWith(query) ? 0 : 1
        return aKey - bKey || byPriorityThenKey(a, b)
      })
      .slice(0, 10)
      .map(({ id, title, status, confidential }) => ({ id, title, status, confidential }))

    return HttpResponse.json(results)
  }),

  http.get(`${API}/tickets`, async ({ request }) => {
    await networkDelay()
    const params = new URL(request.url).searchParams
    const status = params.get('status')
    const assignee = params.get('assignee')
    const label = params.get('label')
    const page = Math.max(1, Number(params.get('page')) || 1)

    const matching = db
      .tickets()
      .filter((ticket) => !status || ticket.status === status)
      .filter((ticket) => {
        if (!assignee) return true
        if (assignee === 'unassigned') return ticket.assigneeId === null
        return ticket.assigneeId === assignee
      })
      .filter((ticket) => !label || ticket.labels.includes(label))
      .sort(byPriorityThenKey)

    const body: Page<Ticket> = {
      items: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      page,
      pageSize: PAGE_SIZE,
      total: matching.length,
    }
    return HttpResponse.json(body)
  }),

  http.get(`${API}/tickets/:id`, async ({ params }) => {
    await networkDelay()
    const ticket = db.ticket(String(params.id))
    return ticket ? HttpResponse.json(ticket) : notFound()
  }),

  http.patch(`${API}/tickets/:id`, async ({ params, request }) => {
    await networkDelay()
    const id = String(params.id)
    if (!db.ticket(id)) return notFound()

    const body = (await request.json()) as TicketPatch
    const patch: TicketPatch = {}

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) {
        return HttpResponse.json({ message: `Unknown status "${body.status}"` }, { status: 400 })
      }
      patch.status = body.status
    }
    if (body.assigneeId !== undefined) {
      if (body.assigneeId !== null && !db.users().some((user) => user.id === body.assigneeId)) {
        return HttpResponse.json({ message: `Unknown user "${body.assigneeId}"` }, { status: 400 })
      }
      patch.assigneeId = body.assigneeId
    }
    if (body.labels !== undefined) {
      if (!Array.isArray(body.labels) || body.labels.some((label) => typeof label !== 'string')) {
        return HttpResponse.json({ message: 'labels must be an array of strings' }, { status: 400 })
      }
      patch.labels = [...new Set(body.labels.map((label) => label.trim()).filter(Boolean))]
    }

    return HttpResponse.json(db.updateTicket(id, patch))
  }),

  http.get(`${API}/tickets/:id/comments`, async ({ params }) => {
    await networkDelay()
    const ticket = db.ticket(String(params.id))
    return ticket ? HttpResponse.json(db.comments(ticket.id)) : notFound()
  }),

  http.post(`${API}/tickets/:id/comments`, async ({ params, request }) => {
    await networkDelay()
    const ticket = db.ticket(String(params.id))
    if (!ticket) return notFound()

    const { body } = (await request.json()) as { body?: unknown }
    if (typeof body !== 'string' || !body.trim()) {
      return HttpResponse.json({ message: 'Comment body is required' }, { status: 400 })
    }
    return HttpResponse.json(db.addComment(ticket.id, body.trim()), { status: 201 })
  }),

  http.all(`${API}/*`, async () => {
    await networkDelay()
    return HttpResponse.json({ message: 'Not found' }, { status: 404 })
  }),
]
