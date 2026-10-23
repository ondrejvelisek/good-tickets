import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch, toQueryString } from './client'
import { queryKeys } from './queryKeys'
import type { Page, Ticket, TicketFilters, TicketPatch } from './types'

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: queryKeys.tickets.list(filters),
    queryFn: () => apiFetch<Page<Ticket>>(`/tickets${toQueryString({ ...filters })}`),
    placeholderData: keepPreviousData,
  })
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn: () => apiFetch<Ticket>(`/tickets/${encodeURIComponent(id)}`),
  })
}

export function useUpdateTicket(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: TicketPatch) =>
      apiFetch<Ticket>(`/tickets/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),
    onSuccess: (ticket) => {
      queryClient.setQueryData(queryKeys.tickets.detail(id), ticket)
      return queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists })
    },
  })
}
