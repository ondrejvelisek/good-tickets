import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useTicket } from '../../api/tickets'
import { useUserMap } from '../../api/users'
import { LabelChip } from '../../components/LabelChip'
import { PriorityIcon } from '../../components/PriorityIcon'
import { Spinner } from '../../components/Spinner'
import { TypeIcon } from '../../components/TypeIcon'
import { UserName } from '../../components/UserName'
import { formatDateTime } from '../../utils/date'
import { RichText } from '../../utils/RichText'
import { Comments } from './Comments'
import { TicketFields } from './TicketFields'

export function TicketDetailPanel() {
  const { ticketId = '' } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()
  const { data: ticket, isPending, isError, error } = useTicket(ticketId)
  const users = useUserMap()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') navigate({ pathname: '/', search })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, search])

  return (
    <aside
      className="fixed inset-y-0 right-0 top-14 z-20 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-xl"
      aria-label="Ticket detail"
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-5">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
          {ticket && <TypeIcon type={ticket.type} />}
          {ticketId}
          {ticket?.confidential && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
              Confidential
            </span>
          )}
        </span>
        <Link
          to={{ pathname: '/', search }}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {isPending ? (
          <div className="flex justify-center py-16">
            <Spinner className="size-6" />
          </div>
        ) : isError ? (
          <p className="py-16 text-center text-sm text-red-600">{error.message}</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold leading-snug text-slate-900">{ticket.title}</h2>

            <TicketFields key={ticket.id} ticket={ticket} />

            <dl className="mt-5 grid grid-cols-[8rem_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-slate-500">Priority</dt>
              <dd>
                <PriorityIcon priority={ticket.priority} withLabel />
              </dd>
              <dt className="text-slate-500">Reporter</dt>
              <dd>
                <UserName user={users.get(ticket.reporterId)} />
              </dd>
              <dt className="text-slate-500">Labels</dt>
              <dd className="flex flex-wrap gap-1">
                {ticket.labels.length ? (
                  ticket.labels.map((label) => <LabelChip key={label} label={label} />)
                ) : (
                  <span className="text-slate-400">None</span>
                )}
              </dd>
              <dt className="text-slate-500">Estimate</dt>
              <dd className="tabular-nums">{formatEstimate(ticket.estimateMinutes)}</dd>
              <dt className="text-slate-500">Created</dt>
              <dd>{formatDateTime(ticket.createdAt)}</dd>
              <dt className="text-slate-500">Updated</dt>
              <dd>{formatDateTime(ticket.updatedAt)}</dd>
            </dl>

            <section className="mt-6">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Description</h3>
              <RichText text={ticket.description} />
            </section>

            <Comments ticketId={ticket.id} />
          </>
        )}
      </div>
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
