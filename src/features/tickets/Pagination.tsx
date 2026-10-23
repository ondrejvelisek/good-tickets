import type { ReactNode } from 'react'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <nav className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm" aria-label="Pagination">
      <p className="text-slate-500">
        {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1">
        <PageButton disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </PageButton>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <PageButton key={number} active={number === page} onClick={() => onPageChange(number)}>
            {number}
          </PageButton>
        ))}
        <PageButton disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next
        </PageButton>
      </div>
    </nav>
  )
}

interface PageButtonProps {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}

function PageButton({ active, disabled, onClick, children }: PageButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`h-8 min-w-8 rounded-md px-2.5 font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}
