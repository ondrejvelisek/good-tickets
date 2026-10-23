import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { queryKeys } from '../../api/queryKeys'
import { useTickets } from '../../api/tickets'
import { Spinner } from '../../components/Spinner'
import { BulkToolbar } from '../bulk-edit/BulkToolbar'
import { FiltersBar } from './FiltersBar'
import { Pagination } from './Pagination'
import { TicketTable } from './TicketTable'
import { useTicketFilters } from './useTicketFilters'

export function TicketListPage() {
  const { filters, hasFilters, setFilter, setPage, clearFilters } = useTicketFilters()
  const { data, isPending, isError, error, isFetching } = useTickets(filters)
  const queryClient = useQueryClient()
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // reset selection and reload tickets when filters change
  useEffect(() => {
    setSelectedRows([])
    queryClient.resetQueries({ queryKey: queryKeys.tickets.lists })
  }, [filters.status, filters.assignee, filters.label, queryClient])

  const toggleRow = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index))
    } else {
      setSelectedRows([...selectedRows, index])
    }
  }

  const toggleAll = () => {
    if (selectedRows.length > 0) {
      setSelectedRows([])
    } else {
      setSelectedRows(data!.items.map((_, i) => i))
    }
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900">Tickets</h1>
          {isFetching && !isPending && <Spinner />}
        </div>

        <FiltersBar filters={filters} hasFilters={hasFilters} onChange={setFilter} onClear={clearFilters} />

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {isPending ? (
            <div className="flex justify-center py-16">
              <Spinner className="size-6" />
            </div>
          ) : isError ? (
            <p className="px-4 py-16 text-center text-sm text-red-600">Could not load tickets: {error.message}</p>
          ) : (
            <>
              <BulkToolbar
                tickets={data.items}
                selectedRows={selectedRows}
                onClearSelection={() => setSelectedRows([])}
              />
              <TicketTable
                tickets={data.items}
                selectedRows={selectedRows}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
              />
              <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>

      <Outlet />
    </>
  )
}
