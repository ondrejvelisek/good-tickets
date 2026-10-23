import type { TicketStatus } from '../api/types'
import { STATUS_LABEL } from '../features/tickets/ticketMeta'

const STYLES: Record<TicketStatus, string> = {
  todo: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-blue-100 text-blue-800',
  code_review: 'bg-violet-100 text-violet-800',
  done: 'bg-emerald-100 text-emerald-800',
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
