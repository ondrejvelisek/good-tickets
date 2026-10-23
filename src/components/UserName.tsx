import type { User } from '../api/types'
import { Avatar } from './Avatar'

export function UserName({ user }: { user: User | undefined }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Avatar user={user} />
      <span className={`truncate ${user ? '' : 'text-slate-400'}`}>{user?.name ?? 'Unassigned'}</span>
    </span>
  )
}
