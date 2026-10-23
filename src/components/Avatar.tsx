import type { User } from '../api/types'

const SIZES = {
  sm: 'size-6 text-[10px]',
  md: 'size-8 text-xs',
}

interface AvatarProps {
  user: User | undefined
  size?: keyof typeof SIZES
}

export function Avatar({ user, size = 'sm' }: AvatarProps) {
  if (!user) {
    return (
      <span
        className={`${SIZES[size]} inline-flex shrink-0 rounded-full border border-dashed border-slate-300 bg-white`}
        aria-hidden
      />
    )
  }

  return (
    <span
      className={`${SIZES[size]} inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white`}
      style={{ backgroundColor: user.avatarColor }}
      title={user.name}
      aria-hidden
    >
      {user.initials}
    </span>
  )
}
