import { Link } from 'react-router'
import { useMe } from '../api/users'
import { QuickSearch } from '../features/search/QuickSearch'
import { Avatar } from './Avatar'

export function Header() {
  const { data: me } = useMe()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-6 px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex size-7 items-center justify-center rounded-md bg-brand-600 text-white">
            <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
              <path d="M9 11h14v3a2 2 0 0 0 0 4v3H9v-3a2 2 0 0 0 0-4z" fill="currentColor" />
            </svg>
          </span>
          Good Tickets
        </Link>

        <nav className="hidden text-sm text-slate-500 md:block">
          Projects / <span className="font-medium text-slate-700">PROJ</span>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <QuickSearch />
          {me && (
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <Avatar user={me} size="md" />
              <span className="hidden lg:inline">{me.name}</span>
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
