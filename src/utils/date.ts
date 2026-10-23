const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** Short relative age like "5m", "3h", "12d", "4mo". */
export function formatAge(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime())
  if (diff < HOUR) return `${Math.max(1, Math.floor(diff / MINUTE))}m`
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`
  const days = Math.floor(diff / DAY)
  if (days < 60) return `${days}d`
  return `${Math.floor(days / 30)}mo`
}

const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso))
}
