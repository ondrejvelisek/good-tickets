import { useState } from 'react'
import { useSearchParams } from 'react-router'
import type { TicketFilters } from '../../api/types'
import { isTicketStatus } from './ticketMeta'

type FilterName = 'status' | 'assignee' | 'label'

function parseFilters(params: URLSearchParams): TicketFilters {
  const status = params.get('status')
  return {
    status: isTicketStatus(status) ? status : undefined,
    assignee: params.get('assignee') || undefined,
    label: params.get('label') || undefined,
    page: Math.max(1, Number(params.get('page')) || 1),
  }
}

function toSearchParams(filters: TicketFilters) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.assignee) params.set('assignee', filters.assignee)
  if (filters.label) params.set('label', filters.label)
  if (filters.page > 1) params.set('page', String(filters.page))
  return params
}

export function useTicketFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => parseFilters(searchParams))

  function updateFilters(next: TicketFilters) {
    setFilters(next)
    setSearchParams(toSearchParams(next))
  }

  function setFilter(name: FilterName, value: string | undefined) {
    updateFilters({ ...filters, [name]: value, page: 1 })
  }

  function setPage(page: number) {
    updateFilters({ ...filters, page })
  }

  function clearFilters() {
    updateFilters({ page: 1 })
  }

  const hasFilters = Boolean(filters.status || filters.assignee || filters.label)

  return { filters, hasFilters, setFilter, setPage, clearFilters }
}
