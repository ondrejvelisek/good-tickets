# Good Tickets

A simple ticket tracker for our team. The main page lists tickets with filters and paging.
Click a ticket to open its detail panel, where you can change the status and assignee and add comments.
Use "Go to ticket" in the header to jump to a ticket by its key or title.

**Hosted app:** https://ondrejvelisek.github.io/good-tickets/

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173/good-tickets/.

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm run typecheck`.

## Tech stack

React, TypeScript, React Router, TanStack Query, Tailwind CSS, Vite.

## API

The app talks to a REST API under `/good-tickets/api`.

| Endpoint | Description |
| :-- | :-- |
| `GET /me` | Current user. Includes the flag `canViewConfidential`. |
| `GET /users` | All users (for the assignee picker). |
| `GET /tickets?status=&assignee=&label=&page=` | Paged list of tickets. Every ticket has the field `confidential` (true or false). |
| `GET /tickets/search?q=` | Quick search by ticket key or title. Returns up to 10 results. |
| `GET /tickets/:id` | One ticket. |
| `PATCH /tickets/:id` | Change status, assignee or labels of one ticket. |
| `GET /tickets/:id/comments` | Comments of a ticket. |
| `POST /tickets/:id/comments` | Add a comment. |

There is no bulk endpoint.
