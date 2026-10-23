import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { apiFetch, type Ticket, type TicketPatch } from '../api'

export function useBulkActions(queryKey: QueryKey) {
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TicketPatch }) =>
      apiFetch<Ticket>(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
    onMutate: ({ id, patch }) => {
      // optimistic update, rollback handled by react-query
      queryClient.setQueryData<Ticket[]>(queryKey, (tickets) =>
        tickets?.map((ticket) => (ticket.id === id ? { ...ticket, ...patch } : ticket)),
      )
    },
  })

  const updateTickets = (tickets: Ticket[], patch: TicketPatch) => {
    tickets.forEach(async (ticket) => {
      await mutateAsync({ id: ticket.id, patch })
    })
    alert('Done ✅')
  }

  return { updateTickets }
}
