import { useUsers, type TicketFilters } from '../api'
import { StatusSelect } from './StatusBadge'

interface FiltersBarProps {
  filters: TicketFilters
  onChange: (name: 'status' | 'assignee', value: string) => void
}

const selectClass = 'h-9 rounded-md border border-slate-300 bg-white px-2 text-sm'

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  const { data: users = [] } = useUsers()

  return (
    <div className="flex gap-3">
      <StatusSelect
        value={filters.status ?? ''}
        onChange={(status) => onChange('status', status)}
        placeholder="All statuses"
        className={selectClass}
      />

      <select value={filters.assignee ?? ''} onChange={(e) => onChange('assignee', e.target.value)} className={selectClass}>
        <option value="">Anyone</option>
        <option value="unassigned">Unassigned</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  )
}
