# Brief for Claude Code: good-tickets interview app

## What this is

We are building a demo app for a frontend job interview. The full spec is
`interviewers-only/INTERVIEW_SPEC.md`. Read it fully before you plan anything.

The candidate shares their screen during the interview. They read the code in
`src/`, debug the running app on GitHub Pages and review a pull request on
GitHub. They are told not to open `interviewers-only/` and not to look at git
history.

## Repository layout

- `src/` is the candidate-facing app (about 20 TSX/TS files, as listed in the spec).
- `interviewers-only/` holds everything else: this brief, the spec, the MSW mock
  API and seed data, notes on planted problems, the reproduction checklist.
  Anything may go there.
- Root `CLAUDE.md` holds only one line: "Read interviewers-only/CLAUDE_BRIEF.md
  first." No spoilers in it.
- Root `README.md` is neutral and for the candidate: how to run the app, the link
  to the hosted app, and the API document from the spec.

## Rules for candidate-facing code

- Nothing in `src/`, `README.md` or the PR may hint that a problem is planted:
  no comments, file names or variable names like "bug" or "intentional".
- The only allowed misleading comment is the one the spec asks for (problem #8).
- Everything that is not a planted problem must be clean, idiomatic code.

## Stack

- Vite, React, TypeScript (strict), React Router, TanStack Query.
- REST API mocked in the browser with MSW. The mock code and seed data live in
  `interviewers-only/mocks/`. The mock implements exactly the API document from
  the spec, with realistic latency: a small random delay on every request, and
  quick search slower for short queries. No UI control for latency.
- Plain CSS or CSS modules. No UI component library. Tidy, believable, similar to a
  simple Jira.

## Seed data

- The current user is a normal user without `canViewConfidential`.
- Seven Critical tickets as listed in the spec section "Candidate tasks are tickets
  in the app". Their descriptions contain the task texts from the spec, in the
  same voice (user reports, lazy product manager tickets). PROJ-482 is assigned to
  a junior colleague, status "Code review", and links the GitHub pull request.
- About 60 believable filler tickets with priority Low, Medium or High, several
  users and estimates. Several filler tickets are confidential.

## Hosting on GitHub Pages

- Deploy `main` to GitHub Pages with a GitHub Actions workflow on every push.
- Set the Vite `base` to `/good-tickets/`.
- MSW must run in the production build too. Make sure `mockServiceWorker.js` is
  served under the base path and the worker is registered with the right URL and
  scope.
- GitHub Pages has no SPA fallback. Use the 404.html copy of index.html (or another
  working solution) so that deep links with query parameters and the browser Back
  button work. The Back button bug from the spec must still be reproducible.
- Optional: also deploy the `feature/bulk-edit` branch as a preview under a
  subpath, so the PR can be tried in the browser.

## Deliverables

1. `main` branch: the base app with the phase 1 problems (quick search race,
   filters duplicated in useState and URL, confidential filtering only on the
   client, estimate formatting duplicated twice with different behavior, table
   header covering the rounded corners of the table border).
2. `feature/bulk-edit` branch with the bulk edit implementation containing planted
   problems #1 to #10 from the spec. Commits on this branch use a fictional junior
   developer as git author.
3. A GitHub pull request from `feature/bulk-edit` to `main` with the PR
   description from the spec, word for word (use the gh CLI).
4. The app deployed and working on GitHub Pages.
5. `interviewers-only/CHECKLIST.md`: every planted problem, the file and line, and
   how to reproduce it.

## How to work

1. Start in plan mode. Propose the file structure, the data model, the seed data
   outline, the deploy setup and where each planted problem will live. Wait for
   approval.
2. Build the base app correctly first, with no planted problems. Make sure it runs
   locally and on GitHub Pages.
3. Introduce the phase 1 problems one by one. After each one, verify it can be
   reproduced as the spec describes (for the search race: with network throttling
   in DevTools).
4. Build the bulk edit branch the way the junior would, with the planted problems,
   then open the pull request.
5. Write the checklist.
