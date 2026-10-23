import { createElement } from 'react'
import type { TicketStatus } from '../api'

const STATUSES: Record<TicketStatus, { label: string; color: string }> = {
  todo: { label: 'To do', color: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'In progress', color: 'bg-blue-100 text-blue-800' },
  code_review: { label: 'Code review', color: 'bg-violet-100 text-violet-800' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-800' },
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, color } = STATUSES[status]
  return <span className={`whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold uppercase ${color}`}>{label}</span>
}

interface StatusSelectProps {
  value: string
  onChange: (status: TicketStatus) => void
  placeholder?: string
  className?: string
}

export function StatusSelect({ value, onChange, placeholder, className }: StatusSelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as TicketStatus)} className={className}>
      {/* Shows the selected option's badge. React has no JSX type for <selectedcontent> yet. */}
      <button>{createElement('selectedcontent')}</button>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {(Object.keys(STATUSES) as TicketStatus[]).map((status) => (
        <option key={status} value={status}>
          <StatusBadge status={status} />
        </option>
      ))}
    </select>
  )
}
