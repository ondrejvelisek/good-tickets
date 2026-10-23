import { useParams } from 'react-router'
import type { Ticket } from '../../api/types'
import { useMe, useUserMap } from '../../api/users'
import { TicketRow } from './TicketRow'

const COLUMNS = ['Key', 'Title', 'Priority', 'Status', 'Assignee', 'Labels', 'Estimate', 'Age']

interface TicketTableProps {
  tickets: Ticket[]
  selectedRows: number[]
  onToggleRow: (index: number) => void
  onToggleAll: () => void
}

export function TicketTable({ tickets, selectedRows, onToggleRow, onToggleAll }: TicketTableProps) {
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
            <th scope="col" className="w-10 py-2.5 pl-4">
              <input
                type="checkbox"
                aria-label="Select all"
                checked={selectedRows.length > 0 && selectedRows.length === tickets.length}
                onChange={onToggleAll}
                className="size-4 rounded border-slate-300 accent-brand-600"
              />
            </th>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="whitespace-nowrap px-3 py-2.5 font-medium last:pr-4">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {visibleTickets.map((ticket, index) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              assignee={ticket.assigneeId ? users.get(ticket.assigneeId) : undefined}
              isOpen={ticket.id === ticketId}
              isSelected={selectedRows.includes(index)}
              onToggle={() => onToggleRow(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
