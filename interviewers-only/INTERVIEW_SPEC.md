# **Frontend interview exercise: ticket system**

## **Overview**

A practical interview for frontend developers, about 30 minutes. The candidate does not write code. We check that the candidate can:

> * read complex code and explain what it does  
> * find bugs in code  
> * spot architecture problems  
> * review a pull request and give useful feedback  
> * debug a running application  
> * discuss a change request and design the frontend architecture for it

| Phase | Time |
| :---- | :---- |
| 1\. Read the app and explain what it does | 5 min |
| 2\. Debug a user report | 5 min |
| 3\. Review the pull request | 10 min |
| 4\. Discuss one change request | 10 min |

## 

## **The application**

A simple ticket system similar to Jira. The main page is a list of tickets with filters (status, assignee, label) and paging. Columns: key (PROJ-123), title, status, assignee, labels, estimate (2h 30m) and age. The header has a quick search box, "Go to ticket". Clicking a ticket opens a detail side panel, where the user can change status and assignee and read and add comments. Confidential tickets may be seen only by users with canViewConfidential.

## **Candidate tasks are tickets in the app**

The demo app also holds the tasks for the candidate. They are tickets in the app data, and all of them have priority Critical. Tickets have a priority field (Low, Medium, High, Critical), shown as a column in the list. The candidate is logged in as a normal user, opens the app, finds the critical tickets and works through them in order. So the candidate uses the app as a user before reading its code. Each ticket description holds the task text from the phase sections below: the user reports, the vague Jira tickets from the product manager, and the change requests.

| Order | Key | Title | Status | Assignee |
| :---- | :---- | :---- | :---- | :---- |
| 1 | PROJ-470 | Onboarding: read the code and describe what the app does | To do | Candidate |
| 2 | PROJ-475 | Search suggests a different ticket (user report 1\) | To do | Candidate |
| 3 | PROJ-478 | Back button does not update the list (user report 2\) | To do | Candidate |
| 4 | PROJ-482 | Bulk edit | code review | Junior colleague, with the pull request linked |
| 5 | PROJ-501 | Tickets in customer portal (change request A) | To do | Unassigned |
| 6 | PROJ-517 | Undo (change request B) | To do | Unassigned |
| 7 | PROJ-530 | AI assistant (change request C) | To do | Unassigned |

All other tickets are filler with priority Low, Medium or High, so the critical ones stand out. Filler tickets look real: bugs, tasks and stories with believable titles, assignees, labels and comments. Some filler tickets are confidential. The candidate's user does not have canViewConfidential, so the list hides them, but they are visible in the Network tab. This supports the security problem in phase 1\.

## 

## **Technical setup**

> * React single-page app with React Router (filters live in the URL through useSearchParams) and TanStack Query.  
> * About 20 TSX and TS files.  
> * The backend is a REST API. In practice it is a mock running in the browser. The candidate does not see its code and gets only the API document below.  
> * The API has realistic, uneven latency. Quick search is slower for short queries, because short queries match more tickets. There is a small random delay on every request. Nothing in the UI hints at this. To reproduce timing bugs, the candidate has to use network throttling in DevTools on their own.

## 

## **API document (given to the candidate)**

| Endpoint | Description |
| :---- | :---- |
| GET /me | Current user. Includes the flag canViewConfidential. |
| GET /users | All users (for the assignee picker). |
| GET /tickets?status=\&assignee=\&label=\&page= | Paged list of tickets. Every ticket has the field confidential (true or false). |
| GET /tickets/search?q= | Quick search by ticket key or title. Returns up to 10 results. |
| GET /tickets/:id | One ticket. |
| PATCH /tickets/:id | Change status, assignee or labels of one ticket. |
| GET /tickets/:id/comments | Comments of a ticket. |
| POST /tickets/:id/comments | Add a comment. |

There is no bulk endpoint on purpose.

## 

## **Phase 1: Reading and debugging**

First the candidate reads the code and explains what the app does. Then the candidate gets two bug reports, written the way a user would write them.

### **User report 1**

*"When I search, sometimes it suggests a totally different ticket than the one I am looking for."*  
**Interviewer notes.** QuickSearch is written by hand with useEffect, fetch and useState, not with TanStack Query. It has no AbortController and does not ignore old responses. A slow response to an older query overwrites the newer results. Good answer: the candidate reproduces it with throttling, explains the race, and fixes it with an abort or an "ignore" flag in the effect cleanup. Strong answer: also suggests rewriting the component to useQuery with the query text in the query key.

### **User report 2**

*"When I click Back button in browser, the list stays the same."*  
**Interviewer notes.** Filters are stored twice, in useState and in useSearchParams. State is written to the URL, but the URL is never read back into state. Good answer: the URL is the single source of truth and the filters are derived from it.

### **Problems to find while reading**

> * **Security.** The API returns confidential tickets to everybody. TicketTable hides them based on canViewConfidential. GET /tickets/:id also returns a confidential ticket to anyone who knows the id. The candidate can find this in the code, in the API document, or in the Network tab. Good answer: this check belongs on the server and must come from the session, not from a flag the client sends.  
> * **Duplicated code.** Formatting of the estimate (150 to "2h 30m") is written twice, in TicketRow and TicketDetailPanel. Each copy behaves differently: one shows "2.5h", the other shows "0m" for zero instead of nothing. The pull request adds a third copy.

## 

## **Phase 2: Pull request review**

The candidate gets the Jira ticket and the pull request. The pull request was made by a junior developer who clearly asked a chatbot to write the code and the description.

### **The Jira ticket**

| PROJ-482 Bulk edit users want to change more tickets at once. like select a few and change status or assignee or add labels. should be simple. not too many at once, limit the feature to max 50\. always ask before doing it, people get scared. show what happened after. when i change filters the selection should go away i think. esc to cancel would be nice jira does this, check how they do it. thx |
| :---- |

### **The pull request description**

| feat: add bulk actions 🚀 Summary This PR introduces a robust and scalable bulk actions system for the ticket list, enabling users to efficiently manage multiple tickets at once. Key features ✅ Multi-select tickets with checkboxes ✅ Bulk status change, assignee change and label assignment ✅ Confirmation dialog for all destructive actions ✅ Optimistic updates with automatic rollback on failure ✅ Graceful error handling ✅ Keyboard shortcut (Esc) to clear selection Testing Tested manually. Everything works as expected. This implementation follows React best practices and is production-ready. Let me know if you would like me to add any further improvements\! |
| :---- |

### 

### **Planted problems (interviewer only)**

| \# | Type | Problem |
| :---- | :---- | :---- |
| 1 | Bug (blocker) | The selection stores row indexes, not ticket ids. After a page change, the action runs on different tickets. |
| 2 | Against the ticket | No limit of 50\. |
| 3 | Against the ticket | The confirmation dialog appears only for status change, not for assignee or labels. |
| 4 | Async | items.forEach(async ...) without await. The "Done" toast shows at once, and partial failures are lost. There is no summary of what happened. |
| 5 | useEffect | selectedCount is kept as state and synced by an effect, instead of being derived from the selection. |
| 6 | useEffect | The effect that clears the selection on filter change also runs on mount and causes a double fetch. |
| 7 | useEffect | The Esc listener is added with addEventListener and has no cleanup. Handlers pile up after the detail panel opens and closes. |
| 8 | Misleading comment | onMutate calls setQueryData with the comment "// optimistic update, rollback handled by react-query". There is no onError and no rollback. |
| 9 | URL | The new BulkToolbar reads filters from window.location instead of useSearchParams, so it does not re-render when filters change. |
| 10 | Needless complexity | useBulkActions calls useBulkOperation, which calls useMutationWrapper, which calls useMutation. The two middle hooks only rename parameters. |
| 11 | Duplicated code | The summary dialog has a third copy of the estimate formatting, again with different rounding. |
| 12 | Description vs code | The description claims confirmation for all actions, automatic rollback and graceful error handling. None of it is in the code. |

**Calibration.** Easy: 2, 3, 4, 10, 12\. Medium: 1, 5, 6, 9, 11\. Hard: 7, 8\.  
**What to look for:**

> * Marks 1 and 4 as blockers and separates them from small comments.  
> * Writes feedback that is kind and specific, with a suggested fix, and suitable for a junior.  
> * Notices that the ticket is vague and says which questions they would ask the product manager, for example "what happens when 3 of 50 updates fail?"  
> * Notices the missing bulk endpoint and suggests one, or at least Promise.allSettled with limited concurrency.  
> * Connects it to phase 1: bulk actions may let a user change confidential tickets.  
> * Comments on the process: no tests, an AI-written description that does not match the code.

## 

## **Phase 3: Change request discussion**

Pick one ticket. The candidate does not write code. We want to hear what they think about, which questions they ask, and which trade-offs they see. Good sign: they start with questions and say what they give up with each option. Bad sign: they jump straight to a library name.

### **Change request A: Embed tickets in a customer portal**

| PROJ-501 Tickets in customer portal big customer (ACME) wants our ticket list inside their portal. their devs will put it in their app, its React i think, maybe Angular, not sure. should look like their app not like ours. their users should only see their own tickets. we need it for Q1. can we do it? |
| :---- |

**What to listen for:**

> * Delivery: iframe vs web component vs npm package. The main trade-off is isolation against deep integration.  
> * Auth: a short-lived token issued by the customer's backend. Never a long-lived API key in the browser.  
> * Security: Content Security Policy, frame-ancestors, and how confidential tickets behave in someone else's app.  
> * Styling: theming, and CSS isolation in both directions (Shadow DOM, prefixes, iframe).  
> * Communication: how the host passes filters in and learns about events such as a ticket click (postMessage, component props, events).  
> * Bundle: size impact on the host app, shared React vs our own copy, and React vs Angular hosts.  
> * Long-term: versioning and backward compatibility, because the widget lives in customer apps for years.

### **Change request B: Undo**

| PROJ-517 Undo people do bulk edits by mistake and then cry in support. add undo like gmail has. should work for everything. |
| :---- |

**What to listen for:**

> * Approach: delay the request until the undo window ends, or send it at once and undo with a reverse action. Each behaves differently when the user closes the tab.  
> * Where it lives: only in the client, or as change history on the server, so undo also works from another device.  
> * Conflicts: someone else changed the ticket in between. Overwrite their change or refuse the undo?  
> * Bulk undo: some tickets can no longer be reverted.  
> * Cache: how TanStack Query cache and optimistic updates work together with reverting.  
> * Scope: "everything" is not possible. A sent email notification cannot be undone. Does the candidate push back on the ticket?

### **Change request C: AI assistant**

| PROJ-530 AI assistant we need AI. chat on the side where the user can ask about tickets and tell it to do stuff, like "move all my bugs to next sprint" or "what is blocking the release". should feel instant. when AI changes something the user should see it right away in the list. like ChatGPT but for tickets. |
| :---- |

**What to listen for (frontend architecture):**

> * **Where the component lives.** In the Layout, so the chat survives route changes, or inside each page, so it is simpler but loses state on navigation. Is it a lazy-loaded chunk? Is it part of the app or a separate module that other apps could reuse?  
> * **How it knows what the user is looking at.** Current filters, open ticket and selection. Options: read the URL, a shared context or store that pages write to, or a "page context" API that each page registers. Trade-off: loose coupling vs knowing too much about every page.  
> * **Reading data: local state or backend.** Local TanStack Query cache is instant and shows exactly what the user sees, but it holds only the current page and may be stale. The backend sees all data and the true current state, and checks permissions, but it is slower. A common answer: the cache for "this ticket" or "what I see", the backend for questions about all tickets.  
> * **How changes are sent.** Option 1: the assistant returns proposed actions, and the frontend runs them through the same mutation hooks and bulk action layer as the UI, so the user can confirm them. Option 2: the backend runs the actions itself during the AI call, and the frontend only learns what changed. Trade-off: one code path and user control vs speed and simpler client.  
> * **How the list updates right away.** Use one shared QueryClient. After a change, invalidate the affected query keys or write the results with setQueryData. The assistant response can list the changed ticket ids, so the frontend knows what to refresh. For changes done on the server, a push channel (SSE or WebSocket) or a refetch after each tool call. Optimistic updates while the change is running, and what happens on failure.  
> * **The assistant changing the UI.** Can it change filters or open a ticket? Through the router (URL as the interface) rather than by reaching into component state.  
> * **Chat state.** Streaming messages, cancel, chat history kept locally or on the server, and what happens on page reload.