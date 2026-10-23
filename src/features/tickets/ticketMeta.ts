import type { TicketPriority, TicketStatus, TicketType } from '../../api/types'

export const STATUSES: { value: TicketStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'code_review', label: 'Code review' },
  { value: 'done', label: 'Done' },
]

export const STATUS_LABEL = Object.fromEntries(STATUSES.map((s) => [s.value, s.label])) as Record<
  TicketStatus,
  string
>

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const TYPE_LABEL: Record<TicketType, string> = {
  bug: 'Bug',
  task: 'Task',
  story: 'Story',
}

export const LABELS = [
  'api',
  'backend',
  'customer',
  'devops',
  'docs',
  'frontend',
  'mobile',
  'performance',
  'security',
  'tech-debt',
  'ux',
]

export function isTicketStatus(value: string | null): value is TicketStatus {
  return STATUSES.some((status) => status.value === value)
}
