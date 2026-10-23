import { delay } from 'msw'

function between(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/** Small random delay on every request. */
export function networkDelay() {
  return delay(between(120, 450))
}

/**
 * Quick search is slower for short queries, because they match more tickets.
 * 1 char ~1.2-1.8 s, 2 chars ~0.6-0.9 s, 3+ chars ~0.15-0.35 s.
 */
export function searchDelay(query: string) {
  if (query.length <= 1) return delay(between(1200, 1800))
  if (query.length === 2) return delay(between(600, 900))
  return delay(between(150, 350))
}
