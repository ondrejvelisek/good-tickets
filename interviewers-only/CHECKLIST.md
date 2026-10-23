# Interviewer checklist

Hosted app: https://ondrejvelisek.github.io/good-tickets/
PR preview (feature/bulk-edit): https://ondrejvelisek.github.io/good-tickets/preview/bulk-edit/
Pull request: https://github.com/ondrejvelisek/good-tickets/pull/1

Line numbers are for `main` (phase 1) and `feature/bulk-edit` (phase 2) as committed.
If you edit those files, re-check the numbers.

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

- **Where:** `src/features/search/QuickSearch.tsx:26-42`. Hand-written `useEffect` + 200 ms debounce +
  `apiFetch` + `useState`. The cleanup only clears the debounce timer (line 41). It does not abort the request
  and does not ignore stale responses, so `setResults(data)` (line 32) is applied for whatever response comes last.
- **Reproduce:** type `P`, pause ~0.3 s, then type `ROJ-482` normally. After ~1.5 s the list shows the results
  for `P` (PROJ-470, 475, 478…) while the input says `PROJ-482`. Pressing Enter opens PROJ-470.
  Also: type `4`, pause, `8`, pause, `2` → results for `4`.
- **Note on throttling:** the API is served by a service worker, so DevTools network throttling barely changes
  timings (measured: about +50 ms). The race reproduces without throttling, as long as the candidate pauses
  for ≥200 ms after the first one or two characters. Typing the whole key quickly in one go sends one request
  and hides the race. That's why it happens "sometimes".
- **Good fix:** `let ignore = false` + `ignore = true` in cleanup, or `AbortController`.
  **Strong:** `useQuery({ queryKey: ['search', debouncedText], ... })`.

### User report 2: Back does not update the list (PROJ-478)

- **Where:** `src/features/tickets/useTicketFilters.ts:29` `useState(() => parseFilters(searchParams))`. The URL
  is only read on mount. `updateFilters` (lines 31-34) writes both state and URL. The list query uses the state.
- **Reproduce:** pick Status = Done → URL `?status=done`. Press browser Back → URL is `/good-tickets/`, but the
  select and the list still show Done. Clicking the "Good Tickets" logo does not reset the filters either.
- **Good fix:** derive filters from `useSearchParams` (URL is the single source of truth), no `useState`.

### Security: confidential tickets filtered only on the client

- **Where:** `src/features/tickets/TicketTable.tsx:12` and `src/features/search/QuickSearch.tsx:23`
  (`!ticket.confidential || me?.canViewConfidential`). The API never filters.
- **Reproduce:**
  - Page 1 shows 17 rows, but the pager says `1–20 of 73`. Network tab → `tickets?page=1` contains
    PROJ-406, 414, 434 with `"confidential": true` (title and description included).
  - Open https://ondrejvelisek.github.io/good-tickets/tickets/PROJ-406 → full confidential ticket in the panel,
    with a "Confidential" badge (`GET /tickets/:id` returns it to anyone, ids are guessable).
  - Confidential tickets: PROJ-406, 414, 422, 427, 434, 443, 448, 460.
- **Good answer:** the server must check the permission from the session, not from a client-side flag.

### Duplicated estimate formatting

- **Where:** `src/features/tickets/TicketRow.tsx:72` and `src/features/ticket-detail/TicketDetailPanel.tsx:107`.
  - Row: `>= 60` → hours with one decimal ("2.5h"), `0`/`null` → empty.
  - Panel: "2h 30m", but `0` → "0m".
- **Reproduce:** PROJ-404 (150 min): list "2.5h", panel "2h 30m". PROJ-433 or PROJ-466 (0 min): list empty,
  panel "0m". PROJ-413 (90 min): list "1.5h", panel "1h 30m".
- The PR adds a third copy (see #11).

---

## Phase 2 (feature/bulk-edit, PR #1)

Files added: `src/features/bulk-edit/{BulkToolbar.tsx, BulkSummaryDialog.tsx, useBulkActions.ts,
useBulkOperation.ts, useMutationWrapper.ts}`, `src/components/Toast.tsx`.
Changed: `TicketListPage.tsx`, `TicketTable.tsx`, `TicketRow.tsx`. Try it on the preview URL.

| # | Problem | Where | How to reproduce |
| :-- | :-- | :-- | :-- |
| 1 | **Blocker.** Selection stores row indexes, not ids | `TicketListPage.tsx:17` (`useState<number[]>`), `TicketTable.tsx:53` (index of *visible* row), `BulkToolbar.tsx:50` (`selectedRows.map(i => tickets[i])` against `data.items`) | (a) Select PROJ-470 on page 1, go to page 2 → PROJ-413 is checked; the action runs on PROJ-413. (b) Without changing pages: select **PROJ-411** (row after the critical ones) and assign to anyone → **PROJ-406 (confidential, hidden)** changes, PROJ-411 doesn't. Visible indexes skip hidden confidential rows, `data.items` doesn't. (c) Header "select all" (`TicketListPage.tsx:37`) selects all 20 indexes of `data.items` → toolbar says "20 selected" with 17 rows visible, and the 3 hidden confidential tickets get changed too. |
| 2 | No max-50 limit | nowhere | Read the code. (Index-based, page-only selection caps it at 20 anyway, which is worth discussing.) |
| 3 | Confirmation only for status | `BulkToolbar.tsx:78` opens the dialog; `:93` assignee and `:63-67` labels run immediately | Select rows, pick an assignee → applied at once, no dialog. |
| 4 | **Blocker.** `forEach(async …)` without await; toast at once; failures lost; no summary | `useBulkActions.ts:36-39` | Change status of a few tickets → "Done ✅" appears before requests finish (Network tab). Rejections become unhandled promise rejections; there is no result summary. The mock never fails a PATCH, so failures are only visible in code. Discuss `Promise.allSettled` + limited concurrency or a bulk endpoint. |
| 5 | `selectedCount` kept in state, synced by an effect | `BulkToolbar.tsx:18, 36-38` | Read the code; should be `selectedRows.length`. `npm run lint` on the branch flags it (`react-hooks/set-state-in-effect`). |
| 6 | Effect that clears selection on filter change also runs on mount → double fetch | `TicketListPage.tsx:19-23` (`resetQueries` in the effect) | Fresh load → Network shows `tickets?page=1` twice. Every filter change also wipes all list caches (spinner instead of the previous data). `page` is not in the deps, so the selection survives paging (feeds #1). Lint flags it too. |
| 7 | Esc listener without cleanup; handlers pile up | `BulkToolbar.tsx:40-48` | `onClearSelection` is a new function on every render of the page, so the effect re-runs and adds another listener each time, e.g. when the detail panel opens/closes. In Chrome console: `getEventListeners(window).keydown.length` grows after each open/close (measured: 12 adds vs 6 removes over 3 open/close cycles). |
| 8 | Misleading comment: no rollback | `useBulkActions.ts:24-25` | `// optimistic update, rollback handled by react-query` but no snapshot, no `onError`, no invalidation. |
| 9 | Filters read from `window.location` (once) | `BulkToolbar.tsx:24-32` | `useMemo(…, [])` reads the URL once, when the toolbar mounts. Go to page 2, select a row, assign it to someone → the API has the new assignee, but the list still shows the old one: the optimistic write went into the page-1 query key and nothing invalidates. (A status/assignee/label filter change remounts the toolbar through #6's `resetQueries`, which hides the bug there; paging does not.) With the phase-1 Back bug, URL and state disagree anyway. |
| 10 | Needless hook layers | `useBulkActions.ts:17` → `useBulkOperation.ts:15` → `useMutationWrapper.ts:12` → `useMutation` | The middle two hooks only rename `operation/onBeforeOperation` → `fn/beforeFn` → `mutationFn/onMutate`. |
| 11 | Third estimate format | `BulkSummaryDialog.tsx:11-13` (`Math.round(m / 60) + 'h'`) | Select PROJ-413 (90 min) and pick a status: dialog says "2h", list "1.5h", panel "1h 30m". 45 min shows "1h", 0 shows "0h". |
| 12 | Description vs code | PR body | Claims confirmation for all destructive actions, automatic rollback and graceful error handling. None of it is in the code. No tests. |

Extra things a strong candidate may notice:
- After an action, nothing invalidates the list or detail queries.
- Bulk actions also change confidential tickets (see #1b/#1c), which ties back to phase 1.
- Labels are free text with no trimming or validation; adding an existing label duplicates it (the server dedupes).
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
- Don't enable auto-fix or bots on PR #1. They would "fix" the planted problems.
