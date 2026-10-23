import type { Ticket, TicketStatus } from '../../api/types'
import { StatusBadge } from '../../components/StatusBadge'

interface BulkSummaryDialogProps {
  tickets: Ticket[]
  status: TicketStatus
  onConfirm: () => void
  onCancel: () => void
}

const formatEstimate = (minutes: number) => {
  return Math.round(minutes / 60) + 'h'
}

export function BulkSummaryDialog({ tickets, status, onConfirm, onCancel }: BulkSummaryDialogProps) {
  const totalEstimate = tickets.reduce((sum, ticket) => sum + (ticket.estimateMinutes || 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Change status of {tickets.length} tickets to <StatusBadge status={status} />?
          </h2>
        </div>

        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto px-5">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="flex items-center gap-3 py-2 text-sm">
              <span className="w-20 shrink-0 font-medium text-slate-500">{ticket.id}</span>
              <span className="min-w-0 flex-1 truncate">{ticket.title}</span>
              <span className="tabular-nums text-slate-500">{formatEstimate(ticket.estimateMinutes || 0)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
          <p className="text-sm text-slate-500">
            Total estimate: <span className="font-medium text-slate-900">{formatEstimate(totalEstimate)}</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="h-9 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="h-9 rounded-md bg-brand-600 px-3 text-sm font-medium text-white hover:bg-brand-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
