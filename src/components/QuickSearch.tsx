import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { apiFetch, useMe, type TicketSearchResult } from '../api'

export function QuickSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TicketSearchResult[]>([])
  const { data: me } = useMe()
  const { search } = useLocation()

  useEffect(() => {
    if (!query) return
    apiFetch<TicketSearchResult[]>(`/tickets/search?q=${encodeURIComponent(query)}`).then(setResults)
  }, [query])

  const visibleResults = results.filter((ticket) => !ticket.confidential || me?.canViewConfidential)

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Go to ticket…"
        className="h-9 w-72 rounded-md border border-slate-300 bg-white px-3 text-sm"
      />
      {query && (
        <ul className="absolute right-0 z-40 mt-1 w-96 rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg">
          {visibleResults.map((ticket) => (
            <li key={ticket.id}>
              <Link
                to={{ pathname: `/tickets/${ticket.id}`, search }}
                onClick={() => setQuery('')}
                className="flex gap-3 px-3 py-2 hover:bg-slate-50"
              >
                <span className="w-20 shrink-0 text-slate-500">{ticket.id}</span>
                <span className="truncate">{ticket.title}</span>
              </Link>
            </li>
          ))}
          {visibleResults.length === 0 && <li className="px-3 py-2 text-slate-500">No tickets found</li>}
        </ul>
      )}
    </div>
  )
}
