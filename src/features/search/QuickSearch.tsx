import { useEffect, useId, useState, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { apiFetch } from '../../api/client'
import type { TicketSearchResult } from '../../api/types'
import { useMe } from '../../api/users'
import { Spinner } from '../../components/Spinner'
import { StatusBadge } from '../../components/StatusBadge'

const DEBOUNCE_MS = 200

export function QuickSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TicketSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()
  const { search } = useLocation()
  const listId = useId()
  const { data: me } = useMe()

  const text = query.trim()
  const visibleResults = results.filter((ticket) => !ticket.confidential || me?.canViewConfidential)

  useEffect(() => {
    if (!text) return

    const timeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data = await apiFetch<TicketSearchResult[]>(`/tickets/search?q=${encodeURIComponent(text)}`)
        setResults(data)
        setActiveIndex(0)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [text])

  function open(ticket: TicketSearchResult) {
    navigate({ pathname: `/tickets/${ticket.id}`, search })
    setQuery('')
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, visibleResults.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && visibleResults[activeIndex]) {
      event.preventDefault()
      open(visibleResults[activeIndex])
    } else if (event.key === 'Escape') {
      event.stopPropagation()
      setIsOpen(false)
      event.currentTarget.blur()
    }
  }

  const showDropdown = isOpen && text !== ''

  return (
    <div className="relative w-72">
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      >
        <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
        placeholder="Go to ticket…"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listId}
        aria-autocomplete="list"
        className="h-9 w-full rounded-md border border-slate-300 bg-slate-50 pl-8 pr-8 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      {showDropdown && isLoading && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <Spinner />
        </span>
      )}

      {showDropdown && (
        <ul
          id={listId}
          role="listbox"
          className="absolute right-0 z-40 mt-1 max-h-96 w-[28rem] overflow-y-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg"
        >
          {visibleResults.length === 0 ? (
            <li className="px-3 py-2 text-slate-500">{isLoading ? 'Searching…' : 'No tickets found'}</li>
          ) : (
            visibleResults.map((ticket, index) => (
              <li
                key={ticket.id}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => open(ticket)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${
                  index === activeIndex ? 'bg-brand-50' : ''
                }`}
              >
                <span className="w-20 shrink-0 font-medium text-slate-500">{ticket.id}</span>
                <span className="min-w-0 flex-1 truncate text-slate-900">{ticket.title}</span>
                <StatusBadge status={ticket.status} />
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
