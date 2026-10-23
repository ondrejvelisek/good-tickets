import type { TicketPriority } from '../api/types'
import { PRIORITY_LABEL } from '../features/tickets/ticketMeta'

const PATHS: Record<TicketPriority, { d: string; color: string }> = {
  critical: { d: 'M3 9l5-5 5 5M3 13l5-5 5 5', color: 'text-red-600' },
  high: { d: 'M3 11l5-5 5 5', color: 'text-orange-500' },
  medium: { d: 'M3 6.5h10M3 10.5h10', color: 'text-amber-500' },
  low: { d: 'M3 6l5 5 5-5', color: 'text-sky-500' },
}

export function PriorityIcon({ priority, withLabel = false }: { priority: TicketPriority; withLabel?: boolean }) {
  const { d, color } = PATHS[priority]

  return (
    <span className="inline-flex items-center gap-1.5" title={PRIORITY_LABEL[priority]}>
      <svg viewBox="0 0 16 16" className={`size-4 shrink-0 ${color}`} aria-hidden>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {withLabel ? (
        <span className={priority === 'critical' ? 'font-semibold text-red-700' : ''}>{PRIORITY_LABEL[priority]}</span>
      ) : (
        <span className="sr-only">{PRIORITY_LABEL[priority]}</span>
      )}
    </span>
  )
}
