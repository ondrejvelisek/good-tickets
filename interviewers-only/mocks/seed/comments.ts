import type { Comment } from '../../../src/api/types'
import { PULL_REQUEST_URL, daysAgo } from './tickets'

type SeedComment = [ticketKey: number, author: string, created: number, body: string]

const seed: SeedComment[] = [
  [470, 'u-martin', 0.9, 'Ping me when you are done, we will go through it together.'],

  [475, 'u-lucie', 1.8, 'Second customer reported the same thing today. Both were typing quite fast.'],

  [482, 'u-james', 1.1, `PR is ready for review 🚀 ${PULL_REQUEST_URL}`],
  [482, 'u-martin', 1, 'Thanks James. Can somebody else from the team review it? I am busy with the release.'],

  [517, 'u-lucie', 2.5, '+1, three support tickets about this last week.'],

  [400, 'u-petra', 149, 'ACME and two smaller customers asked for this.'],
  [400, 'u-daniel', 132, 'Released. Max 10,000 rows per export for now.'],
  [403, 'u-james', 129, 'Fixed, we now use Intl.DateTimeFormat everywhere.'],
  [404, 'u-sara', 137, 'Can we reuse the select style from the status filter?'],
  [404, 'u-martin', 121, 'Done. Multi-select can come later if people ask.'],
  [406, 'u-omar', 29, 'Report attached in the security channel. Severity high.'],
  [406, 'u-daniel', 3, 'Fix is in review. Checking tenant id on every attachment read now.'],
  [408, 'u-james', 113, 'The old tracker used DD.MM.YYYY. Normalized on import.'],
  [411, 'u-petra', 40, 'Can we have this before the ACME QBR?'],
  [411, 'u-daniel', 5, 'Upload works, virus scanning is the last missing piece.'],
  [416, 'u-daniel', 30, 'Index helps, 4 s down to 900 ms. Still looking at the count query.'],
  [416, 'u-lucie', 2, 'Customer says it is better but still slow on the first page.'],
  [417, 'u-martin', 48, 'Please make sure we do not send personal data in breadcrumbs.'],
  [419, 'u-petra', 60, 'Nice to have. Not this quarter.'],
  [421, 'u-martin', 89, 'We keep the original URL in a query parameter now.'],
  [424, 'u-james', 80, 'Button is disabled while the mutation is pending.'],
  [426, 'u-daniel', 77, 'Search is case-insensitive now.'],
  [428, 'u-sara', 70, 'Email template is in Figma.'],
  [428, 'u-daniel', 62, 'Released behind a flag, on for everybody since Monday.'],
  [429, 'u-sara', 12, 'I will propose new colors for all four statuses.'],
  [430, 'u-omar', 20, 'Frontend and tickets service are migrated. Notifications next.'],
  [431, 'u-james', 69, 'Added "Unassigned" option, API accepts assignee=unassigned.'],
  [432, 'u-sara', 55, 'Should saved filters be shared with the team or private?'],
  [432, 'u-petra', 54, 'private first'],
  [434, 'u-daniel', 2, 'Hotfix deployed, request bodies are no longer in the emails. Cleanup of old emails in progress.'],
  [437, 'u-daniel', 45, 'How do we handle users in the CSV that do not exist yet?'],
  [439, 'u-james', 58, 'Form is keyed by ticket id now, so it resets.'],
  [442, 'u-james', 3, 'Picker works, notifications are still missing.'],
  [442, 'u-sara', 2, 'Mention chips should use the same style as labels.'],
  [443, 'u-martin', 15, 'Board summary sent. Follow-ups are PROJ-463 and the monitoring alert.'],
  [446, 'u-sara', 1, 'Moving the close button to the bottom on small screens.'],
  [453, 'u-martin', 10, 'First measurement attached. The date library is 30% of the chunk.'],
  [455, 'u-omar', 9, 'Let us start with 20 requests per second per token.'],
  [458, 'u-martin', 28, 'Upgraded, no issues so far.'],
  [462, 'u-james', 31, 'We invalidate the list query after the mutation now.'],
  [463, 'u-omar', 1, 'Draft is in the wiki, will test it on staging on Thursday.'],
  [465, 'u-lucie', 1.5, 'Customers noticed, two reports already.'],
]

export function buildComments(now = Date.now()): Comment[] {
  return seed.map(([ticketKey, authorId, created, body], index) => ({
    id: `c-${index + 1}`,
    ticketId: `PROJ-${ticketKey}`,
    authorId,
    body,
    createdAt: daysAgo(created, now),
  }))
}
