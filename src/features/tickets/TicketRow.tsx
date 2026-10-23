import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import type { Ticket, User } from '../../api/types'
import { LabelChip } from '../../components/LabelChip'
import { PriorityIcon } from '../../components/PriorityIcon'
import { StatusBadge } from '../../components/StatusBadge'
import { TypeIcon } from '../../components/TypeIcon'
import { UserName } from '../../components/UserName'
import { formatAge, formatDateTime } from '../../utils/date'

interface TicketRowProps {
  ticket: Ticket
  assignee: User | undefined
  isOpen: boolean
}

export function TicketRow({ ticket, assignee, isOpen }: TicketRowProps) {
  const navigate = useNavigate()
  const { search } = useLocation()
  const target = { pathname: `/tickets/${ticket.id}`, search }

  function handleClick(event: MouseEvent<HTMLTableRowElement>) {
    if ((event.target as HTMLElement).closest('a')) return
    navigate(target)
  }

  return (
    <tr
      onClick={handleClick}
      className={`cursor-pointer ${isOpen ? 'bg-brand-50' : 'hover:bg-slate-50'}`}
      aria-current={isOpen || undefined}
    >
      <td className="whitespace-nowrap py-2.5 pl-4 pr-3">
        <span className="flex items-center gap-2">
          <TypeIcon type={ticket.type} />
          <Link to={target} className="font-medium text-slate-500 hover:text-brand-600 hover:underline">
            {ticket.id}
          </Link>
        </span>
      </td>
      <td className="max-w-md px-3 py-2.5">
        <Link to={target} className="line-clamp-1 font-medium text-slate-900 hover:text-brand-600">
          {ticket.title}
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-2.5">
        <PriorityIcon priority={ticket.priority} withLabel />
      </td>
      <td className="px-3 py-2.5">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="max-w-44 px-3 py-2.5">
        <UserName user={assignee} />
      </td>
      <td className="px-3 py-2.5">
        <span className="flex flex-wrap gap-1">
          {ticket.labels.map((label) => (
            <LabelChip key={label} label={label} />
          ))}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-slate-600">
        {formatEstimate(ticket.estimateMinutes)}
      </td>
      <td className="whitespace-nowrap py-2.5 pl-3 pr-4 tabular-nums text-slate-500" title={formatDateTime(ticket.createdAt)}>
        {formatAge(ticket.createdAt)}
      </td>
    </tr>
  )
}

function formatEstimate(minutes: number | null) {
  if (!minutes) return ''
  if (minutes < 60) return `${minutes}m`
  return `${Number((minutes / 60).toFixed(1))}h`
}
