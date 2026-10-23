import { Link, useLocation } from 'react-router'
import type { Ticket, User } from '../api'
import { StatusBadge } from './StatusBadge'

export function TicketRow({ ticket, assignee }: { ticket: Ticket; assignee: User | undefined }) {
  const { search } = useLocation()

  return (
    <tr className="hover:bg-slate-50">
      <td className="whitespace-nowrap px-3 py-2 text-slate-500">{ticket.id}</td>
      <td className="px-3 py-2">
        <Link to={{ pathname: `/tickets/${ticket.id}`, search }} className="font-medium hover:text-blue-600">
          {ticket.title}
        </Link>
      </td>
      <td className={`px-3 py-2 capitalize ${ticket.priority === 'critical' ? 'font-semibold text-red-600' : ''}`}>
        {ticket.priority}
      </td>
      <td className="px-3 py-2">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="whitespace-nowrap px-3 py-2">{assignee?.name ?? <span className="text-slate-400">Unassigned</span>}</td>
      <td className="whitespace-nowrap px-3 py-2">{formatEstimate(ticket.estimateMinutes)}</td>
    </tr>
  )
}

function formatEstimate(minutes: number | null) {
  if (!minutes) return ''
  if (minutes < 60) return `${minutes}m`
  return `${Number((minutes / 60).toFixed(1))}h`
}
