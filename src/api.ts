import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export type TicketStatus = 'todo' | 'in_progress' | 'code_review' | 'done'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export interface User {
  id: string
  name: string
  canViewConfidential: boolean
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId: string | null
  estimateMinutes: number | null
  confidential: boolean
  createdAt: string
}

export interface TicketSearchResult {
  id: string
  title: string
  confidential: boolean
}

export type TicketFilters = {
  status?: string
  assignee?: string
}

export type TicketPatch = Partial<Pick<Ticket, 'status' | 'assigneeId'>>

const API_URL = `${import.meta.env.BASE_URL}api`

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(API_URL + path, { ...init, headers: { 'Content-Type': 'application/json' } })
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  return response.json()
}

export function toSearchParams(values: Record<string, string | undefined>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, String(value))
  }
  return params
}

export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: () => apiFetch<User>('/me') })
}

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: () => apiFetch<User[]>('/users') })
}

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => apiFetch<Ticket[]>(`/tickets?${toSearchParams(filters)}`),
    placeholderData: keepPreviousData,
  })
}

export function useTicket(id: string) {
  return useQuery({ queryKey: ['ticket', id], queryFn: () => apiFetch<Ticket>(`/tickets/${id}`) })
}

export function useUpdateTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: TicketPatch) =>
      apiFetch<Ticket>(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
    onSuccess: (ticket) => {
      queryClient.setQueryData(['ticket', id], ticket)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
