import type { TicketType } from '../api/types'
import { TYPE_LABEL } from '../features/tickets/ticketMeta'

const STYLES: Record<TicketType, { bg: string; path: string }> = {
  bug: { bg: 'bg-red-500', path: 'M8 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z' },
  task: { bg: 'bg-sky-500', path: 'M4.5 8.5l2.5 2.5 4.5-5' },
  story: { bg: 'bg-emerald-500', path: 'M5 3.5h6v9l-3-2-3 2z' },
}

export function TypeIcon({ type }: { type: TicketType }) {
  const { bg, path } = STYLES[type]

  return (
    <span className={`inline-flex size-4 shrink-0 items-center justify-center rounded-sm ${bg}`} title={TYPE_LABEL[type]}>
      <svg viewBox="0 0 16 16" className="size-3 text-white" aria-hidden>
        <path
          d={path}
          fill={type === 'task' ? 'none' : 'currentColor'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">{TYPE_LABEL[type]}</span>
    </span>
  )
}
