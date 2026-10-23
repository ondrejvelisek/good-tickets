import type { ReactNode } from 'react'
import type { TicketFilters } from '../../api/types'
import { useUsers } from '../../api/users'
import { LABELS, STATUSES } from './ticketMeta'

interface FiltersBarProps {
  filters: TicketFilters
  hasFilters: boolean
  onChange: (name: 'status' | 'assignee' | 'label', value: string | undefined) => void
  onClear: () => void
}

export function FiltersBar({ filters, hasFilters, onChange, onClear }: FiltersBarProps) {
  const { data: users = [] } = useUsers()
  const sortedUsers = users.toSorted((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Filter label="Status">
        <select
          className={selectClass}
          value={filters.status ?? ''}
          onChange={(event) => onChange('status', event.target.value || undefined)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </Filter>

      <Filter label="Assignee">
        <select
          className={selectClass}
          value={filters.assignee ?? ''}
          onChange={(event) => onChange('assignee', event.target.value || undefined)}
        >
          <option value="">Anyone</option>
          <option value="unassigned">Unassigned</option>
          {sortedUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </Filter>

      <Filter label="Label">
        <select
          className={selectClass}
          value={filters.label ?? ''}
          onChange={(event) => onChange('label', event.target.value || undefined)}
        >
          <option value="">All labels</option>
          {LABELS.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </Filter>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="h-9 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

const selectClass =
  'h-9 min-w-40 rounded-md border border-slate-300 bg-white px-2.5 text-sm shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'

function Filter({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  )
}
