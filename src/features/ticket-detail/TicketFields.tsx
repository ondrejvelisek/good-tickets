import type { ReactNode } from 'react'
import { useUpdateTicket } from '../../api/tickets'
import type { Ticket, TicketPatch } from '../../api/types'
import { useUsers } from '../../api/users'
import { Avatar } from '../../components/Avatar'
import { isTicketStatus, STATUSES } from '../tickets/ticketMeta'

export function TicketFields({ ticket }: { ticket: Ticket }) {
  const { data: users = [] } = useUsers()
  const updateTicket = useUpdateTicket(ticket.id)
  const assignee = users.find((user) => user.id === ticket.assigneeId)
  const sortedUsers = users.toSorted((a, b) => a.name.localeCompare(b.name))

  function update(patch: TicketPatch) {
    updateTicket.mutate(patch)
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <Field label="Status">
        <select
          className={selectClass}
          value={ticket.status}
          disabled={updateTicket.isPending}
          onChange={(event) => {
            const status = event.target.value
            if (isTicketStatus(status)) update({ status })
          }}
        >
          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Assignee">
        <span className="relative flex items-center">
          <span className="pointer-events-none absolute left-2">
            <Avatar user={assignee} />
          </span>
          <select
            className={`${selectClass} pl-10`}
            value={ticket.assigneeId ?? ''}
            disabled={updateTicket.isPending}
            onChange={(event) => update({ assigneeId: event.target.value || null })}
          >
            <option value="">Unassigned</option>
            {sortedUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </span>
      </Field>

      {updateTicket.isError && (
        <p className="col-span-2 text-sm text-red-600">Could not save the change: {updateTicket.error.message}</p>
      )}
    </div>
  )
}

const selectClass =
  'h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  )
}
