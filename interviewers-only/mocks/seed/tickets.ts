import type { TicketPriority, TicketStatus } from '../../../src/api'
import type { StoredTicket, TicketType } from '../types'

export const REPOSITORY_URL = 'https://github.com/ondrejvelisek/good-tickets'
export const PULL_REQUEST_URL = `${REPOSITORY_URL}/pull/2`

const DAY = 24 * 60 * 60 * 1000

export function daysAgo(days: number, now = Date.now()): string {
  return new Date(now - days * DAY).toISOString()
}

interface SeedTicket {
  key: number
  type: TicketType
  title: string
  status: TicketStatus
  priority: TicketPriority
  assignee: string | null
  reporter: string
  estimate: number | null
  created: number
  updated?: number
  confidential?: boolean
  description: string
}

/* ------------------------------------------------------------------ */
/* Candidate tasks (all Critical)                                      */
/* ------------------------------------------------------------------ */

const criticalTasks: SeedTicket[] = [
  {
    key: 470,
    type: 'task',
    title: 'Onboarding: read the code and describe what the app does',
    status: 'todo',
    priority: 'critical',
    assignee: 'u-candidate',
    reporter: 'u-martin',
    estimate: 60,
    created: 1,
    description:
      'Welcome to the team!\n\n' +
      'Before you pick up anything else, open the code of this app (the src folder) and walk us through it. ' +
      'What does the app do, what are the main parts, and how does data get from the API to the screen? ' +
      'Tell us about anything that surprises you on the way.\n\n' +
      'The API document is in the README. Then continue with the other critical tickets, in order.',
  },
  {
    key: 475,
    type: 'bug',
    title: 'Search suggests a different ticket (user report 1)',
    status: 'todo',
    priority: 'critical',
    assignee: 'u-candidate',
    reporter: 'u-lucie',
    estimate: 120,
    created: 2,
    description:
      'Reported by a customer through support:\n\n' +
      '"When I search, sometimes it suggests a totally different ticket than the one I am looking for."\n\n' +
      'I could not reproduce it on my machine every time. It happens only sometimes.',
  },
  {
    key: 478,
    type: 'bug',
    title: 'Back button does not update the list (user report 2)',
    status: 'todo',
    priority: 'critical',
    assignee: 'u-candidate',
    reporter: 'u-lucie',
    estimate: 120,
    created: 2,
    description:
      'Reported by a customer through support:\n\n' +
      '"When I click Back button in browser, the list stays the same."',
  },
  {
    key: 482,
    type: 'story',
    title: 'Bulk edit',
    status: 'code_review',
    priority: 'critical',
    assignee: 'u-james',
    reporter: 'u-petra',
    estimate: 480,
    created: 9,
    updated: 1,
    description:
      'users want to change more tickets at once. like select a few and change status or assignee. ' +
      'should be simple. not too many at once, limit the feature to max 50. always ask before doing it, people get scared. ' +
      'show what happened after. when i change filters the selection should go away i think. ' +
      'esc to cancel would be nice jira does this, check how they do it. thx\n\n' +
      `Pull request: ${PULL_REQUEST_URL}`,
  },
  {
    key: 501,
    type: 'story',
    title: 'Tickets in customer portal (change request A)',
    status: 'todo',
    priority: 'critical',
    assignee: null,
    reporter: 'u-petra',
    estimate: null,
    created: 3,
    description:
      'big customer (ACME) wants our ticket list inside their portal. their devs will put it in their app, ' +
      'its React i think, maybe Angular, not sure. should look like their app not like ours. ' +
      'their users should only see their own tickets. we need it for Q1. can we do it?',
  },
  {
    key: 517,
    type: 'story',
    title: 'Undo (change request B)',
    status: 'todo',
    priority: 'critical',
    assignee: null,
    reporter: 'u-petra',
    estimate: null,
    created: 3,
    description:
      'people do bulk edits by mistake and then cry in support. add undo like gmail has. should work for everything.',
  },
  {
    key: 530,
    type: 'story',
    title: 'AI assistant (change request C)',
    status: 'todo',
    priority: 'critical',
    assignee: null,
    reporter: 'u-petra',
    estimate: null,
    created: 3,
    description:
      'we need AI. chat on the side where the user can ask about tickets and tell it to do stuff, ' +
      'like "move all my bugs to next sprint" or "what is blocking the release". should feel instant. ' +
      'when AI changes something the user should see it right away in the list. like ChatGPT but for tickets.',
  },
]

// Every candidate task links to the source code.
const critical = criticalTasks.map((seed) => ({
  ...seed,
  description: `${seed.description}\n\nSource code: ${REPOSITORY_URL}`,
}))

/* ------------------------------------------------------------------ */
/* Filler                                                              */
/* ------------------------------------------------------------------ */

const filler: SeedTicket[] = [
  { key: 400, type: 'story', title: 'Export ticket list to CSV', status: 'done', priority: 'medium', assignee: 'u-daniel', reporter: 'u-petra', estimate: 480, created: 150, updated: 131,
    description: 'Customers want to export the filtered list to CSV so they can build their own reports in Excel. Export should respect the current filters.' },
  { key: 401, type: 'bug', title: 'Avatar initials missing for users with one-word names', status: 'done', priority: 'low', assignee: 'u-james', reporter: 'u-lucie', estimate: 30, created: 148, updated: 140,
    description: 'Users like "Cher" get an empty avatar circle. We should fall back to the first two letters.' },
  { key: 402, type: 'task', title: 'Upgrade Node to 22 on CI runners', status: 'done', priority: 'medium', assignee: 'u-omar', reporter: 'u-martin', estimate: 60, created: 146, updated: 139,
    description: 'Node 18 is end of life. Update the runner image and the engines field in package.json.' },
  { key: 403, type: 'bug', title: 'Ticket dates shown in UTC instead of local time', status: 'done', priority: 'medium', assignee: 'u-james', reporter: 'u-lucie', estimate: 90, created: 140, updated: 128,
    description: 'Tickets created at 9:00 in Prague show 7:00. Format dates in the browser time zone.' },
  { key: 404, type: 'story', title: 'Filter tickets by status', status: 'done', priority: 'medium', assignee: 'u-martin', reporter: 'u-petra', estimate: 150, created: 138, updated: 120,
    description: 'Add a status filter above the ticket list.' },
  { key: 405, type: 'task', title: 'Add request logging to tickets service', status: 'done', priority: 'low', assignee: 'u-daniel', reporter: 'u-daniel', estimate: 120, created: 135, updated: 126,
    description: 'Log method, path, status and duration for every request. No request bodies, they may contain personal data.' },
  { key: 406, type: 'bug', title: 'Pen-test: IDOR in attachments API', status: 'in_progress', priority: 'high', assignee: 'u-daniel', reporter: 'u-omar', estimate: 480, created: 30, updated: 2, confidential: true,
    description: 'External pen-test found that GET /attachments/:id returns files of other tenants when the id is guessed. Do not discuss outside the security channel until fixed.' },
  { key: 407, type: 'story', title: 'Keyboard shortcut to open quick search', status: 'todo', priority: 'low', assignee: null, reporter: 'u-petra', estimate: 120, created: 40,
    description: 'Power users want to press "/" to jump to the search box, like on GitHub.' },
  { key: 408, type: 'bug', title: 'Ticket age shows "NaN days" for imported tickets', status: 'done', priority: 'medium', assignee: 'u-james', reporter: 'u-lucie', estimate: 45, created: 120, updated: 112,
    description: 'Tickets imported from the old tracker have createdAt in a different format. Age column shows NaN.' },
  { key: 409, type: 'task', title: 'Document PATCH /tickets payload', status: 'done', priority: 'low', assignee: 'u-daniel', reporter: 'u-martin', estimate: 60, created: 118, updated: 110,
    description: 'The API document does not say which fields PATCH accepts. Add status and assignee with examples.' },
  { key: 410, type: 'bug', title: 'Assignee picker list is not sorted', status: 'done', priority: 'low', assignee: 'u-james', reporter: 'u-lucie', estimate: 30, created: 115, updated: 109,
    description: 'Names appear in the order they were created. Sort them alphabetically.' },
  { key: 411, type: 'story', title: 'Customers can attach screenshots to bug reports', status: 'in_progress', priority: 'high', assignee: 'u-daniel', reporter: 'u-petra', estimate: 960, created: 60, updated: 4,
    description: 'Allow PNG and JPG up to 10 MB. Files are stored in the object storage, not in the database.' },
  { key: 412, type: 'task', title: 'Remove unused moment.js dependency', status: 'done', priority: 'low', assignee: 'u-martin', reporter: 'u-martin', estimate: 60, created: 110, updated: 104,
    description: 'Nothing imports moment anymore, but it is still in package.json and adds 70 kB to the vendor chunk.' },
  { key: 413, type: 'bug', title: 'Ticket list flickers after changing a filter', status: 'done', priority: 'medium', assignee: 'u-martin', reporter: 'u-lucie', estimate: 90, created: 108, updated: 100,
    description: 'The list goes blank for a moment before the new results appear. Keep the old rows until the new ones arrive.' },
  { key: 414, type: 'task', title: 'Security audit findings for ACME SSO', status: 'todo', priority: 'high', assignee: 'u-omar', reporter: 'u-petra', estimate: 0, created: 25, updated: 3, confidential: true,
    description: 'ACME security team sent their audit report. Two findings about SAML assertion lifetime. Report is in the shared drive, restricted folder.' },
  { key: 415, type: 'story', title: 'Show ticket estimate in list', status: 'done', priority: 'low', assignee: 'u-james', reporter: 'u-petra', estimate: 120, created: 100, updated: 93,
    description: 'Add an Estimate column to the ticket list so team leads can see the size of the work at a glance.' },
  { key: 416, type: 'bug', title: 'Slow ticket list for projects with 10k tickets', status: 'in_progress', priority: 'high', assignee: 'u-daniel', reporter: 'u-lucie', estimate: 600, created: 45, updated: 1,
    description: 'GET /tickets takes 4 seconds for the biggest customer. Missing index on (project_id, status) is the first suspect.' },
  { key: 417, type: 'task', title: 'Set up error tracking for frontend', status: 'todo', priority: 'medium', assignee: 'u-omar', reporter: 'u-martin', estimate: 240, created: 50,
    description: 'We find out about frontend errors from customers. Send unhandled errors and rejections to our error tracker with release tags.' },
  { key: 418, type: 'bug', title: 'Long assignee names overflow the table cell', status: 'todo', priority: 'low', assignee: null, reporter: 'u-lucie', estimate: 45, created: 20,
    description: 'Names longer than 25 characters push the Estimate column out of the screen on a 13" laptop.' },
  { key: 419, type: 'story', title: 'Dark mode', status: 'todo', priority: 'low', assignee: null, reporter: 'u-sara', estimate: null, created: 90,
    description: 'Follow the system setting. Needs a pass over all colors, the status badges especially.' },
  { key: 420, type: 'task', title: 'Design review: ticket detail side panel', status: 'done', priority: 'medium', assignee: 'u-sara', reporter: 'u-petra', estimate: 180, created: 95, updated: 85,
    description: 'Review the side panel with two customers and collect feedback before we build it.' },
  { key: 421, type: 'bug', title: 'Login redirect loses the page the user came from', status: 'done', priority: 'high', assignee: 'u-martin', reporter: 'u-lucie', estimate: 120, created: 92, updated: 88,
    description: 'After the session expires and the user logs in again, they always land on the home page.' },
  { key: 422, type: 'task', title: 'Salary band export for HR integration', status: 'in_progress', priority: 'medium', assignee: 'u-daniel', reporter: 'u-petra', estimate: 300, created: 18, updated: 2, confidential: true,
    description: 'HR wants a monthly export of salary bands per role for the new payroll tool. Contains personal data, restricted access only.' },
  { key: 423, type: 'story', title: 'Mobile layout for ticket detail', status: 'todo', priority: 'medium', assignee: null, reporter: 'u-sara', estimate: 480, created: 70,
    description: 'On phones the side panel should take the full screen and have a clear close button.' },
  { key: 424, type: 'bug', title: 'Ticket key copied with a trailing space', status: 'done', priority: 'medium', assignee: 'u-james', reporter: 'u-lucie', estimate: 150, created: 85, updated: 79,
    description: 'Double clicking the key to copy it also selects the space after it.' },
  { key: 425, type: 'task', title: 'Write onboarding guide for new developers', status: 'todo', priority: 'low', assignee: 'u-martin', reporter: 'u-martin', estimate: 240, created: 33,
    description: 'How to run the app, where the API document is, how we review pull requests.' },
  { key: 426, type: 'bug', title: 'Search does not find tickets by lowercase key', status: 'done', priority: 'medium', assignee: 'u-daniel', reporter: 'u-lucie', estimate: 30, created: 80, updated: 77,
    description: 'Searching "proj-412" returns nothing, "PROJ-412" works.' },
  { key: 427, type: 'task', title: 'Rotate API keys for staging', status: 'done', priority: 'medium', assignee: 'u-omar', reporter: 'u-omar', estimate: 60, created: 78, updated: 77, confidential: true,
    description: 'Staging keys were pasted into a public chat by mistake. Rotate all of them and check the access logs.' },
  { key: 428, type: 'story', title: 'Email notification when a ticket is assigned to me', status: 'done', priority: 'medium', assignee: 'u-daniel', reporter: 'u-petra', estimate: 360, created: 76, updated: 61,
    description: 'Send one email per assignment. No email when users assign a ticket to themselves.' },
  { key: 429, type: 'bug', title: 'Status badge colors fail contrast check', status: 'todo', priority: 'medium', assignee: 'u-sara', reporter: 'u-lucie', estimate: 60, created: 15,
    description: 'The "In progress" badge has a contrast ratio of 2.9:1. WCAG AA needs 4.5:1 for small text.' },
  { key: 430, type: 'task', title: 'Migrate CI from Jenkins to GitHub Actions', status: 'in_progress', priority: 'medium', assignee: 'u-omar', reporter: 'u-martin', estimate: 960, created: 40, updated: 3,
    description: 'Jenkins is down every other week. Move build, test and deploy to GitHub Actions, one service at a time.' },
  { key: 431, type: 'bug', title: 'Unassigned tickets missing from assignee filter', status: 'done', priority: 'medium', assignee: 'u-james', reporter: 'u-lucie', estimate: 45, created: 72, updated: 68,
    description: 'There is no way to list tickets without an assignee. Add an "Unassigned" option.' },
  { key: 432, type: 'story', title: 'Saved filters', status: 'todo', priority: 'medium', assignee: null, reporter: 'u-petra', estimate: 600, created: 65,
    description: 'Users want to save a filter combination under a name and open it from a menu.' },
  { key: 433, type: 'task', title: 'Spike: push updates to the ticket list', status: 'todo', priority: 'low', assignee: 'u-martin', reporter: 'u-martin', estimate: 0, created: 28,
    description: 'Compare SSE and WebSocket for pushing ticket changes to open browsers. Time-boxed, no estimate.' },
  { key: 434, type: 'bug', title: 'Customer data visible in error report emails', status: 'in_progress', priority: 'high', assignee: 'u-daniel', reporter: 'u-lucie', estimate: 180, created: 10, updated: 1, confidential: true,
    description: 'Error report emails include the full request body, with customer names and emails. Strip it and notify the DPO.' },
  { key: 435, type: 'task', title: 'Clean up feature flags from Q2', status: 'todo', priority: 'low', assignee: null, reporter: 'u-martin', estimate: 120, created: 55,
    description: 'Eleven flags are at 100% for more than two months. Remove them and the dead code paths.' },
  { key: 436, type: 'bug', title: 'Tooltip flickers on ticket key hover', status: 'done', priority: 'low', assignee: 'u-james', reporter: 'u-lucie', estimate: 15, created: 66, updated: 64,
    description: 'Moving the mouse slowly over the key makes the tooltip blink.' },
  { key: 437, type: 'story', title: 'Bulk import tickets from CSV', status: 'todo', priority: 'medium', assignee: null, reporter: 'u-petra', estimate: 720, created: 50,
    description: 'New customers move from spreadsheets. Let them upload a CSV and map columns to ticket fields.' },
  { key: 438, type: 'task', title: 'Cache GET /users response', status: 'todo', priority: 'low', assignee: 'u-daniel', reporter: 'u-daniel', estimate: 90, created: 35,
    description: 'The biggest tenant has 4,000 users. The endpoint is slow and the app calls it on every page load.' },
  { key: 439, type: 'bug', title: 'Favicon missing on Windows', status: 'done', priority: 'medium', assignee: 'u-james', reporter: 'u-lucie', estimate: 30, created: 60, updated: 57,
    description: 'The tab icon is blank in Edge on Windows. The SVG favicon needs a PNG fallback.' },
  { key: 440, type: 'task', title: 'Update privacy policy link in footer', status: 'done', priority: 'low', assignee: 'u-sara', reporter: 'u-petra', estimate: 15, created: 58, updated: 58,
    description: 'Legal published a new version. The old link redirects, but it should point to the new page directly.' },
  { key: 441, type: 'bug', title: 'Ticket list jumps when avatars load', status: 'todo', priority: 'low', assignee: null, reporter: 'u-lucie', estimate: 60, created: 22,
    description: 'Rows change height for a moment while avatars load. Reserve the space.' },
  { key: 442, type: 'story', title: 'Mention users in ticket descriptions with @', status: 'in_progress', priority: 'medium', assignee: 'u-james', reporter: 'u-petra', estimate: 480, created: 30, updated: 2,
    description: 'Typing @ opens a user picker. Mentioned users get a notification.' },
  { key: 443, type: 'task', title: 'Incident review: outage on 2 October', status: 'done', priority: 'medium', assignee: 'u-omar', reporter: 'u-martin', estimate: 120, created: 20, updated: 14, confidential: true,
    description: 'Database failover took 40 minutes instead of 2. Timeline, root cause and follow-up actions for the board.' },
  { key: 444, type: 'bug', title: 'Assignee filter ignores deactivated users', status: 'todo', priority: 'low', assignee: 'u-daniel', reporter: 'u-lucie', estimate: 45, created: 12,
    description: 'Tickets assigned to people who left the company cannot be filtered.' },
  { key: 445, type: 'task', title: 'Add Storybook for shared components', status: 'todo', priority: 'low', assignee: null, reporter: 'u-martin', estimate: 480, created: 44,
    description: 'Badges, avatars and chips are copied between projects. A Storybook would help us share them.' },
  { key: 446, type: 'bug', title: 'Ticket detail panel does not close on mobile', status: 'in_progress', priority: 'medium', assignee: 'u-sara', reporter: 'u-lucie', estimate: 90, created: 9, updated: 1,
    description: 'On iPhone SE the close button is hidden under the browser toolbar.' },
  { key: 447, type: 'story', title: 'Customer-facing status page for incidents', status: 'todo', priority: 'medium', assignee: null, reporter: 'u-petra', estimate: 960, created: 38,
    description: 'Customers ask support during every outage. A public status page would save us a lot of tickets.' },
  { key: 448, type: 'task', title: 'Contract renewal terms for ACME', status: 'todo', priority: 'medium', assignee: 'u-petra', reporter: 'u-petra', estimate: null, created: 7, confidential: true,
    description: 'ACME asks for 18% discount on renewal. Board approved up to 12%. Prepare the counter offer.' },
  { key: 449, type: 'bug', title: 'Wrong reporter shown on tickets created via API', status: 'done', priority: 'medium', assignee: 'u-daniel', reporter: 'u-lucie', estimate: 60, created: 42, updated: 36,
    description: 'Tickets created with an API token show the token owner as reporter, not the user in the payload.' },
  { key: 450, type: 'task', title: 'Accessibility audit of ticket list', status: 'todo', priority: 'medium', assignee: 'u-sara', reporter: 'u-sara', estimate: 360, created: 26,
    description: 'Keyboard navigation, focus states, screen reader labels for the filters and the table.' },
  { key: 451, type: 'bug', title: 'Assignee avatar has no tooltip', status: 'todo', priority: 'low', assignee: 'u-james', reporter: 'u-lucie', estimate: 30, created: 6,
    description: 'Hovering the avatar in the detail panel should show the full name.' },
  { key: 452, type: 'story', title: 'Due dates on tickets', status: 'todo', priority: 'low', assignee: null, reporter: 'u-petra', estimate: 600, created: 20,
    description: 'Optional due date, shown in the list and highlighted when it is in the past.' },
  { key: 453, type: 'task', title: 'Reduce bundle size of ticket list page', status: 'todo', priority: 'medium', assignee: 'u-martin', reporter: 'u-martin', estimate: 240, created: 16,
    description: 'The main chunk is 410 kB gzipped. Look at the date library and the icon set first.' },
  { key: 454, type: 'bug', title: 'Time zone offset wrong in exported CSV', status: 'in_progress', priority: 'low', assignee: 'u-daniel', reporter: 'u-lucie', estimate: 60, created: 14, updated: 3,
    description: 'Exported dates are shifted by one hour since the change to winter time.' },
  { key: 455, type: 'task', title: 'Add rate limiting to public API', status: 'todo', priority: 'high', assignee: 'u-daniel', reporter: 'u-omar', estimate: 480, created: 11,
    description: 'One integration sends 300 requests per second at night. Limit per token and return 429 with Retry-After.' },
  { key: 456, type: 'story', title: 'Ticket templates for bug reports', status: 'todo', priority: 'low', assignee: null, reporter: 'u-sara', estimate: 300, created: 8,
    description: 'Prefill the description with "Steps to reproduce", "Expected" and "Actual".' },
  { key: 457, type: 'bug', title: 'Long titles break the detail panel header', status: 'todo', priority: 'low', assignee: 'u-james', reporter: 'u-lucie', estimate: 30, created: 5,
    description: 'Titles over 120 characters overflow the panel. Wrap them.' },
  { key: 458, type: 'task', title: 'Upgrade TanStack Query to v5', status: 'done', priority: 'medium', assignee: 'u-martin', reporter: 'u-martin', estimate: 180, created: 34, updated: 27,
    description: 'Follow the migration guide. cacheTime is now gcTime, and the loading status was renamed to pending.' },
  { key: 459, type: 'bug', title: 'Session expires while editing a ticket', status: 'todo', priority: 'medium', assignee: null, reporter: 'u-lucie', estimate: 150, created: 4,
    description: 'Changes are lost when the session expires before the request is sent.' },
  { key: 460, type: 'task', title: 'Quarterly access review', status: 'todo', priority: 'medium', assignee: 'u-omar', reporter: 'u-omar', estimate: 120, created: 3, confidential: true,
    description: 'Review who has admin and canViewConfidential. List of people leaving the company is attached.' },
  { key: 461, type: 'story', title: 'Watch a ticket and get notified on changes', status: 'todo', priority: 'low', assignee: null, reporter: 'u-petra', estimate: 480, created: 3,
    description: 'A "Watch" button in the detail panel. Watchers get an email when status or assignee changes.' },
  { key: 462, type: 'bug', title: 'Assignee change not shown until page refresh', status: 'done', priority: 'medium', assignee: 'u-james', reporter: 'u-lucie', estimate: 45, created: 32, updated: 30,
    description: 'Changing the assignee in the detail panel does not update the row in the list.' },
  { key: 463, type: 'task', title: 'Write runbook for database failover', status: 'in_progress', priority: 'medium', assignee: 'u-omar', reporter: 'u-omar', estimate: 240, created: 6, updated: 1,
    description: 'Step by step, with the commands, so that anybody on call can do it at 3 am.' },
  { key: 465, type: 'bug', title: 'Release notes page returns 500', status: 'todo', priority: 'high', assignee: 'u-daniel', reporter: 'u-lucie', estimate: 90, created: 2,
    description: 'Since the last deploy, /release-notes returns 500. Logs show a null pointer in the markdown renderer.' },
  { key: 466, type: 'task', title: 'Prepare demo data for sales', status: 'todo', priority: 'low', assignee: 'u-petra', reporter: 'u-petra', estimate: 0, created: 2,
    description: 'Sales needs a demo tenant with believable tickets for the trade fair.' },
]

export function buildTickets(now = Date.now()): StoredTicket[] {
  return [...critical, ...filler].map((seed) => ({
    id: `PROJ-${seed.key}`,
    type: seed.type,
    title: seed.title,
    description: seed.description,
    status: seed.status,
    priority: seed.priority,
    assigneeId: seed.assignee,
    reporterId: seed.reporter,
    estimateMinutes: seed.estimate,
    confidential: seed.confidential ?? false,
    createdAt: daysAgo(seed.created, now),
    updatedAt: daysAgo(seed.updated ?? Math.max(0.2, seed.created / 3), now),
  }))
}
