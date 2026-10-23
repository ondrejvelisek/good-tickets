import { useParams } from 'react-router'
import type { Ticket } from '../../api/types'
import { useMe, useUserMap } from '../../api/users'
import { TicketRow } from './TicketRow'

const COLUMNS = ['Key', 'Title', 'Priority', 'Status', 'Assignee', 'Labels', 'Estimate', 'Age']

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  const { ticketId } = useParams()
  const users = useUserMap()
  const { data: me } = useMe()
  const visibleTickets = tickets.filter((ticket) => !ticket.confidential || me?.canViewConfidential)

  if (visibleTickets.length === 0) {
    return <p className="px-4 py-16 text-center text-sm text-slate-500">No tickets match these filters.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="whitespace-nowrap px-3 py-2.5 font-medium first:pl-4 last:pr-4">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {visibleTickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              assignee={ticket.assigneeId ? users.get(ticket.assigneeId) : undefined}
              isOpen={ticket.id === ticketId}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
