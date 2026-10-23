import { useEffect, useMemo, useState } from 'react'
import { queryKeys } from '../../api/queryKeys'
import type { Ticket, TicketFilters, TicketStatus } from '../../api/types'
import { useUsers } from '../../api/users'
import { Toast } from '../../components/Toast'
import { STATUSES } from '../tickets/ticketMeta'
import { BulkSummaryDialog } from './BulkSummaryDialog'
import { useBulkActions } from './useBulkActions'

interface BulkToolbarProps {
  tickets: Ticket[]
  selectedRows: number[]
  onClearSelection: () => void
}

export function BulkToolbar({ tickets, selectedRows, onClearSelection }: BulkToolbarProps) {
  const { data: users = [] } = useUsers()
  const [selectedCount, setSelectedCount] = useState(0)
  const [pendingStatus, setPendingStatus] = useState<TicketStatus | null>(null)
  const [label, setLabel] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  // get current filters so we update the correct query in the cache
  const filters = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      status: params.get('status') || undefined,
      assignee: params.get('assignee') || undefined,
      label: params.get('label') || undefined,
      page: Number(params.get('page')) || 1,
    } as TicketFilters
  }, [])

  const { changeStatus, changeAssignee, addLabel } = useBulkActions(queryKeys.tickets.list(filters), setToast)

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  const selectedTickets = selectedRows.map((index) => tickets[index])

  const handleConfirmStatus = () => {
    changeStatus(selectedTickets, pendingStatus!)
    setPendingStatus(null)
    onClearSelection()
  }

  const handleAssigneeChange = (assigneeId: string) => {
    changeAssignee(selectedTickets, assigneeId || null)
    onClearSelection()
  }

  const handleAddLabel = () => {
    if (!label) return
    addLabel(selectedTickets, label)
    setLabel('')
    onClearSelection()
  }

  return (
    <>
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-brand-100 bg-brand-50 px-4 py-2.5 text-sm">
          <span className="font-medium text-brand-700">{selectedCount} selected</span>

          <select
            value=""
            onChange={(e) => setPendingStatus(e.target.value as TicketStatus)}
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
          >
            <option value="" disabled>
              Change status…
            </option>
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value="none"
            onChange={(e) => handleAssigneeChange(e.target.value)}
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
          >
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

          <span className="flex items-center gap-1">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
              placeholder="Add label…"
              className="h-8 w-32 rounded-md border border-slate-300 bg-white px-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAddLabel}
              className="h-8 rounded-md bg-white px-2.5 font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
            >
              Add
            </button>
          </span>

          <button
            type="button"
            onClick={onClearSelection}
            className="ml-auto h-8 rounded-md px-2.5 font-medium text-slate-600 hover:bg-white"
          >
            Clear selection
          </button>
        </div>
      )}

      {pendingStatus && (
        <BulkSummaryDialog
          tickets={selectedTickets}
          status={pendingStatus}
          onConfirm={handleConfirmStatus}
          onCancel={() => setPendingStatus(null)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
