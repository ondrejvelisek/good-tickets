import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { apiFetch } from '../../api/client'
import type { Page, Ticket, TicketPatch, TicketStatus } from '../../api/types'
import { useBulkOperation } from './useBulkOperation'

interface TicketUpdate {
  id: string
  patch: TicketPatch
}

/**
 * Hook that provides all bulk actions for the ticket list.
 */
export function useBulkActions(queryKey: QueryKey, onDone: (message: string) => void) {
  const queryClient = useQueryClient()

  const { mutateAsync } = useBulkOperation({
    operation: ({ id, patch }: TicketUpdate) =>
      apiFetch<Ticket>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),
    onBeforeOperation: ({ id, patch }: TicketUpdate) => {
      // optimistic update, rollback handled by react-query
      queryClient.setQueryData<Page<Ticket>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((ticket) => (ticket.id === id ? { ...ticket, ...patch } : ticket)),
        }
      })
    },
  })

  const runBulkAction = (tickets: Ticket[], getPatch: (ticket: Ticket) => TicketPatch) => {
    tickets.forEach(async (ticket) => {
      await mutateAsync({ id: ticket.id, patch: getPatch(ticket) })
    })
    onDone('Done ✅')
  }

  const changeStatus = (tickets: Ticket[], status: TicketStatus) => {
    runBulkAction(tickets, () => ({ status }))
  }

  const changeAssignee = (tickets: Ticket[], assigneeId: string | null) => {
    runBulkAction(tickets, () => ({ assigneeId }))
  }

  const addLabel = (tickets: Ticket[], label: string) => {
    runBulkAction(tickets, (ticket) => ({ labels: [...ticket.labels, label] }))
  }

  return { changeStatus, changeAssignee, addLabel }
}
