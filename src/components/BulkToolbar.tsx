import { useEffect, useMemo, useState } from 'react'
import { useUsers, type Ticket, type TicketStatus } from '../api'
import { StatusSelect } from './StatusBadge'
import { useBulkActions } from './useBulkActions'

interface BulkToolbarProps {
  tickets: Ticket[]
  selectedRows: number[]
  onClearSelection: () => void
}

const selectClass = 'h-8 rounded-md border border-slate-300 bg-white px-2 text-sm'

const formatEstimate = (minutes: number) => {
  return Math.round(minutes / 60) + 'h'
}

export function BulkToolbar({ tickets, selectedRows, onClearSelection }: BulkToolbarProps) {
  const { data: users = [] } = useUsers()
  const [selectedCount, setSelectedCount] = useState(0)

  // get current filters so we update the correct query in the cache
  const filters = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return { status: params.get('status') ?? undefined, assignee: params.get('assignee') ?? undefined }
  }, [])

  const { updateTickets } = useBulkActions(['tickets', filters])

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  const selectedTickets = selectedRows.map((index) => tickets[index])
  const totalEstimate = selectedTickets.reduce((sum, ticket) => sum + (ticket.estimateMinutes || 0), 0)

  const changeStatus = (status: TicketStatus) => {
    updateTickets(selectedTickets, { status })
    onClearSelection()
  }

  const changeAssignee = (assigneeId: string) => {
    updateTickets(selectedTickets, { assigneeId: assigneeId || null })
    onClearSelection()
  }

  if (selectedCount === 0) return null

  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm">
      <span className="font-medium">
        {selectedCount} selected · {formatEstimate(totalEstimate)} total
      </span>
      <StatusSelect value="" onChange={changeStatus} placeholder="Change status…" className={selectClass} />
      <select value="none" onChange={(e) => changeAssignee(e.target.value)} className={selectClass}>
        <option value="none" disabled>
          Assign to…
        </option>
        <option value="">Unassigned</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  )
}
