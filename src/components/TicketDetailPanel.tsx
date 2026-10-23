import { Link, useLocation, useParams } from 'react-router'
import { useTicket, useUpdateTicket, useUsers } from '../api'
import { StatusSelect } from './StatusBadge'

const selectClass = 'mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm'

export function TicketDetailPanel() {
  const { ticketId = '' } = useParams()
  const { search } = useLocation()
  const { data: ticket, isPending, isError } = useTicket(ticketId)
  const { data: users = [] } = useUsers()
  const updateTicket = useUpdateTicket(ticketId)

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto border-l border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>
          {ticketId}
          {ticket?.confidential && (
            <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
              CONFIDENTIAL
            </span>
          )}
        </span>
        <Link to={{ pathname: '/', search }} className="hover:text-slate-900">
          Close
        </Link>
      </div>

      {isPending ? (
        <p className="text-slate-500">Loading…</p>
      ) : isError ? (
        <p className="text-red-600">Could not load the ticket.</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold">{ticket.title}</h2>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
            <label>
              Status
              <StatusSelect
                value={ticket.status}
                onChange={(status) => updateTicket.mutate({ status })}
                className={selectClass}
              />
            </label>
            <label>
              Assignee
              <select
                value={ticket.assigneeId ?? ''}
                onChange={(e) => updateTicket.mutate({ assigneeId: e.target.value || null })}
                className={selectClass}
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-4 text-sm">
            <span className="text-slate-500">Estimate:</span> {formatEstimate(ticket.estimateMinutes)}
          </p>
          <p className="mt-4 whitespace-pre-line text-sm leading-6">{linkify(ticket.description)}</p>
        </>
      )}
    </aside>
  )
}

function formatEstimate(minutes: number | null) {
  if (minutes === null) return ''
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest}m`
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

function linkify(text: string) {
  return text.split(/(https?:\/\/\S+)/).map((part, index) =>
    index % 2 ? (
      <a key={index} href={part} target="_blank" rel="noreferrer" className="break-all text-blue-600 underline">
        {part}
      </a>
    ) : (
      part
    ),
  )
}
