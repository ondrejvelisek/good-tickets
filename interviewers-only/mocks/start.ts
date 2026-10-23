// Entry point injected by vite-plugin-api.ts in place of /src/main.tsx.
// Starts the mock API first, so the app never sends a request before the worker is ready.
import { worker } from './browser'

const base = import.meta.env.BASE_URL

// Deep links into a preview build arrive through the root 404.html, which redirects to
// <preview>/?redirect=<path>. Restore the original URL before the router reads it.
const redirect = new URLSearchParams(location.search).get('redirect')
if (redirect !== null) {
  history.replaceState(null, '', base + redirect.replace(/^\//, ''))
}

await worker.start({
  serviceWorker: {
    url: `${base}mockServiceWorker.js`,
    options: { scope: base },
  },
  onUnhandledRequest: 'bypass',
  quiet: true,
})

await import('../../src/main.tsx')
