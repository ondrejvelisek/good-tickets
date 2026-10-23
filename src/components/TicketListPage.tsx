import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router'
import { toSearchParams, useTickets, type TicketFilters } from '../api'
import { BulkToolbar } from './BulkToolbar'
import { FiltersBar } from './FiltersBar'
import { QuickSearch } from './QuickSearch'
import { TicketTable } from './TicketTable'

export function TicketListPage() {
  const { filters, setFilter } = useTicketFilters()
  const { data, isPending, isError } = useTickets(filters)
  const queryClient = useQueryClient()
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // reset selection and reload tickets when filters change
  useEffect(() => {
    setSelectedRows([])
    queryClient.resetQueries({ queryKey: ['tickets'] })
  }, [filters.status, filters.assignee, queryClient])

  const toggleRow = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index))
    } else {
      setSelectedRows([...selectedRows, index])
    }
  }

  return (
    <div className="grid grid-cols-3">
      <main className="col-span-2 p-6">
        <h1 className="mb-4 text-xl font-semibold">Good Tickets</h1>
        <div className="flex gap-3">
          <FiltersBar filters={filters} onChange={setFilter} />
          <QuickSearch />
        </div>

        <BulkToolbar tickets={data ?? []} selectedRows={selectedRows} onClearSelection={() => setSelectedRows([])} />

        <div className="mt-4 rounded-lg border border-slate-200 bg-white">
          {isPending ? (
            <p className="p-8 text-center text-slate-500">Loading…</p>
          ) : isError ? (
            <p className="p-8 text-center text-red-600">Could not load tickets.</p>
          ) : (
            <TicketTable tickets={data} selectedRows={selectedRows} onToggleRow={toggleRow} />
          )}
        </div>
      </main>
      <Outlet />
    </div>
  )
}

function useTicketFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<TicketFilters>(() => ({
    status: searchParams.get('status') ?? undefined,
    assignee: searchParams.get('assignee') ?? undefined,
  }))

  function updateFilters(next: TicketFilters) {
    setFilters(next)
    setSearchParams(toSearchParams(next))
  }

  function setFilter(name: 'status' | 'assignee', value: string) {
    updateFilters({ ...filters, [name]: value || undefined })
  }

  return { filters, setFilter }
}
