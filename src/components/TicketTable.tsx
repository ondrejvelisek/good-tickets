import { useMe, useUsers, type Ticket } from '../api'
import { TicketRow } from './TicketRow'

const COLUMNS = ['Key', 'Title', 'Priority', 'Status', 'Assignee', 'Estimate']

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  const { data: me } = useMe()
  const { data: users = [] } = useUsers()
  const visibleTickets = tickets.filter((ticket) => !ticket.confidential || me?.canViewConfidential)

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
        <tr>
          {COLUMNS.map((column) => (
            <th key={column} className="px-3 py-2 font-medium">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {visibleTickets.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} assignee={users.find((user) => user.id === ticket.assigneeId)} />
        ))}
      </tbody>
    </table>
  )
}
