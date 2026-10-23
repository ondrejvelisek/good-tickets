# Interviewer checklist

Hosted app: https://ondrejvelisek.github.io/good-tickets/
PR preview (feature/bulk-edit): https://ondrejvelisek.github.io/good-tickets/preview/bulk-edit/
Pull request: https://github.com/ondrejvelisek/good-tickets/pull/2

Line numbers are for `main` as committed. If you edit those files, re-check the numbers.

## Before each interview

- Ask the candidate to open the hosted app in a **fresh tab** (or incognito). Data changes live in
  `sessionStorage` per tab, so every new tab starts from the seed.
- The candidate is the user **Candidate** without `canViewConfidential`.
- Critical tickets (top of the list, in order): PROJ-470, 475, 478, 482, 501, 517, 530. Each links to the repo.
- Mock latency: every request 120–450 ms; quick search 1.2–1.8 s for 1 char, 0.6–0.9 s for 2 chars,
  0.15–0.35 s for 3+ chars (`interviewers-only/mocks/latency.ts`).

---

## Phase 1 (main)

### User report 1: search suggests a different ticket (PROJ-475)

- **Where:** `src/components/QuickSearch.tsx:11-14`. Hand-written `useEffect` + `apiFetch` + `useState`, one request
  per keystroke. No cleanup, no abort, no check that the response belongs to the current query, so
  `.then(setResults)` (line 13) applies whatever response comes last.
- **Reproduce:** type `PROJ-482` at a normal pace. After ~1.5 s the list switches to the results for `P`
  (PROJ-470, 475, 478…) while the input still says `PROJ-482`. Clicking the first result opens PROJ-470.
  Measured: 60 and 120 ms per key → wrong results; 200 ms per key → correct. That's why it happens "sometimes".
- **Note on throttling:** the API is served by a service worker, so DevTools network throttling barely changes
  timings (measured: about +50 ms). The race reproduces without throttling.
- **Good fix:** `let ignore = false` + `return () => { ignore = true }`, or `AbortController`.
  **Strong:** `useQuery({ queryKey: ['search', query], ... })`.

### User report 2: Back does not update the list (PROJ-478)

- **Where:** `src/components/TicketListPage.tsx:38` (`useTicketFilters` at the bottom of the file) `useState(() => ({ ...from searchParams }))`. The URL is only read
  on mount. `updateFilters` (lines 43-46) writes both state and URL. The list query uses the state.
- **Reproduce:** pick Status = Done → URL `?status=done`. Press browser Back → URL is `/good-tickets/`, but the
  select and the list still show Done.
- **Good fix:** derive filters from `useSearchParams` (URL is the single source of truth), no `useState`.

### Security: confidential tickets filtered only on the client

- **Where:** `src/components/TicketTable.tsx:9` and `src/components/QuickSearch.tsx:16`
  (`!ticket.confidential || me?.canViewConfidential`). The API never filters.
- **Reproduce:**
  - The list shows 65 tickets, but the Network tab → `tickets` returns 73, including 8 with
    `"confidential": true` (title and description included). Gaps in the ticket keys hint at it too.
  - Open https://ondrejvelisek.github.io/good-tickets/tickets/PROJ-406 → full confidential ticket in the panel,
    with a "CONFIDENTIAL" badge (`GET /tickets/:id` returns it to anyone, ids are guessable).
  - Confidential tickets: PROJ-406, 414, 422, 427, 434, 443, 448, 460.
- **Good answer:** the server must check the permission from the session, not from a client-side flag.

### Duplicated estimate formatting

- **Where:** `src/components/TicketRow.tsx:28` and `src/components/TicketDetailPanel.tsx:74`.
  - Row: `>= 60` → hours with one decimal ("2.5h"), `0`/`null` → empty.
  - Panel: "2h 30m", but `0` → "0m".
- **Reproduce:** PROJ-404 (150 min): list "2.5h", panel "2h 30m". PROJ-433 or PROJ-466 (0 min): list empty,
  panel "0m". PROJ-413 (90 min): list "1.5h", panel "1h 30m".
- The PR adds a third copy (see #11).

### Visual bug: table corners lose their border

- **Where:** `src/components/TicketListPage.tsx:21` — the table container has `rounded-lg border bg-white` but no
  `overflow-hidden`, so its children are not clipped to the rounded corners. `src/components/TicketTable.tsx:13` — the
  header row (`thead … bg-slate-50`) paints a square background over the inner part of the curved border at the
  top-left and top-right corners. `bg-slate-50` is also the page background, so the corners look cut off.
- **Reproduce:** zoom in on the top corners of the table and compare them with the bottom corners, which are crisp
  (they sit over white rows). Not mentioned in any ticket; it tests an eye for visual detail. Nobody planned it, but
  keep it.
- **Where it is not:** the border and radius on the container are fine. The bottom corners prove it.
- **Good answer:** `overflow-hidden` on the container, or round the first and last header cells.

---

## Phase 2 (feature/bulk-edit, PR #2)

3 commits by James Goodman, +150 lines in 5 files. New: `src/components/BulkToolbar.tsx` and
`src/components/useBulkActions.ts`. Changed: `src/components/{TicketListPage, TicketTable, TicketRow}.tsx`. Line numbers
below are for `feature/bulk-edit`. Try it on the preview URL.

| # | Problem | Where | How to reproduce |
| :-- | :-- | :-- | :-- |
| 1 | **Blocker.** Selection stores row indexes, not ids | `TicketListPage.tsx:14` (`useState<number[]>`), `TicketTable.tsx:35` (index of the *visible* row), `BulkToolbar.tsx:41` (`selectedRows.map(i => tickets[i])` against the full API list) | Hidden confidential tickets shift the indexes. Select **PROJ-411** (first row after the critical ones) and assign it to anyone → **PROJ-406 (confidential, hidden)** changes, PROJ-411 doesn't. The toolbar's total estimate also counts the wrong tickets: PROJ-417 (4h) alone shows "3h total", because it resolves to PROJ-404. |
| 2 | No max-50 limit | nowhere | Read the code. |
| 3 | No confirmation at all | `BulkToolbar.tsx:44-52` (`changeStatus` / `changeAssignee` run immediately) | Select rows, pick a status or an assignee → applied at once. The ticket says "always ask before doing it", and the PR description claims a confirmation dialog. |
| 4 | **Blocker.** `forEach(async …)` without await; "Done" at once; failures lost; no summary | `useBulkActions.ts:19-22` | Select a few rows and pick an assignee → the "Done ✅" alert opens before a single PATCH request has been sent (measured: 0 started). Rejections become unhandled promise rejections; there is no summary of what happened. The mock never fails a PATCH, so failures are only visible in code. Discuss `Promise.allSettled` + limited concurrency or a bulk endpoint. |
| 5 | `selectedCount` kept in state, synced by an effect | `BulkToolbar.tsx:20, 30-32` | Read the code; should be `selectedRows.length`. `npm run lint` on the branch flags it (`react-hooks/set-state-in-effect`). |
| 6 | Effect that clears selection on filter change also runs on mount → double fetch | `TicketListPage.tsx:16-20` (`resetQueries` in the effect) | Fresh load → Network shows `tickets` twice (production build; three times in the dev server because of StrictMode). Every filter change also requests twice and drops the cached list (blank "Loading…"). Lint flags the `setSelectedRows([])` in the effect too. |
| 7 | Esc listener without cleanup; handlers pile up | `BulkToolbar.tsx:34-39` | `onClearSelection` is a new function on every render of the page, so the effect re-runs and adds another listener each time, e.g. when the detail panel opens or closes. In Chrome console: `getEventListeners(window).keydown.length` grows (measured: +30 listeners, 0 removed, over 3 open/close cycles). |
| 8 | Misleading comment: no rollback | `useBulkActions.ts:10-12` | `// optimistic update, rollback handled by react-query` in `onMutate`, but no snapshot, no `onError`, no invalidation. |
| 9 | Filters read from `window.location` instead of `useSearchParams` | `BulkToolbar.tsx:22-26` | `useMemo(…, [])` reads the URL once, when the toolbar mounts (it stays mounted, `TicketListPage.tsx:39`). Load the list, set Status = To do, select PROJ-475, change its status to Done → the API has "done", but the row still shows "To do": the optimistic write went into the query key of the unfiltered list and nothing invalidates. |
| 10 | Third estimate format | `BulkToolbar.tsx:14-16` (`Math.round(m / 60) + 'h'`), used at `:59` | Select PROJ-413 (90 min) → toolbar "2h total", list "1.5h", panel "1h 30m". |
| 11 | Description vs code | PR body | Claims a confirmation dialog for all destructive actions, automatic rollback and graceful error handling. None of it is in the code. No tests. |

Extra things a strong candidate may notice:
- After an action, nothing invalidates the list or detail queries.
- Bulk actions change confidential tickets (see #1), which ties back to phase 1.
- `alert()` blocks the page; the toolbar disappears right away, so the user cannot see what was changed.
- The commit author is James Goodman, but the PR on GitHub shows the repo owner as the author.

---

## Infrastructure notes

- The mock lives in `interviewers-only/mocks/` and is wired in by `interviewers-only/vite-plugin-api.ts`. It
  replaces the `/src/main.tsx` entry in `index.html` with `mocks/start.ts`, which starts MSW and then imports
  the app. `src/` has no reference to the mock.
- GitHub Pages: workflow `.github/workflows/pages.yml` builds `main` to `/good-tickets/` and `feature/bulk-edit`
  to `/good-tickets/preview/bulk-edit/` on every push to either branch. `404.html` is a copy of `index.html`
  (deep links keep their URL and history, so the Back bug stays reproducible). Deep links into the preview are
  redirected by a small script in the root `404.html`; `mocks/start.ts` restores the URL.
- The `github-pages` environment allows deployments from `main` and `feature/bulk-edit`.
- Don't enable auto-fix or bots on PR #2. They would "fix" the planted problems.
- PR #1 is an older, closed version of the same PR (GitHub closed it during a history rewrite and it cannot be
  reopened). Ignore it; candidates should only get the link to PR #2.
