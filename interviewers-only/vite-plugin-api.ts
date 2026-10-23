import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'

/*
 * Wires the in-browser mock API (MSW) into the app without any reference from src/:
 *  - replaces the /src/main.tsx entry in index.html with interviewers-only/mocks/start.ts,
 *    which starts the worker and then imports /src/main.tsx,
 *  - serves mockServiceWorker.js under the base path in dev and emits it into the build,
 *  - writes dist/404.html (GitHub Pages SPA fallback) as a copy of index.html. For the main
 *    build it also redirects deep links of preview builds (see PREVIEW_PATHS) to their root.
 */

const APP_ENTRY = '/src/main.tsx'
const MOCK_ENTRY = '/interviewers-only/mocks/start.ts'
const WORKER_FILE = 'mockServiceWorker.js'

/** Sub-paths (relative to the main base) where preview builds of other branches are deployed. */
const PREVIEW_PATHS = ['preview/bulk-edit/']

const require = createRequire(import.meta.url)
const workerSource = () => readFileSync(require.resolve(`msw/${WORKER_FILE}`), 'utf8')

function previewRedirectScript(base: string) {
  const prefixes = JSON.stringify(PREVIEW_PATHS.map((p) => base + p))
  return `<script>(function(){var p=${prefixes},l=location;for(var i=0;i<p.length;i++){if(l.pathname.indexOf(p[i])===0&&l.pathname!==p[i]){l.replace(p[i]+'?redirect='+encodeURIComponent(l.pathname.slice(p[i].length)+l.search+l.hash));return}}})()</script>`
}

export function apiPlugin(options: { isPreview: boolean }): Plugin {
  let config: ResolvedConfig

  return {
    name: 'api',
    configResolved(resolved) {
      config = resolved
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(`src="${APP_ENTRY}"`, `src="${MOCK_ENTRY}"`)
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== config.base + WORKER_FILE) return next()
        res.setHeader('Content-Type', 'application/javascript')
        res.end(workerSource())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: WORKER_FILE, source: workerSource() })
    },
    closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir)
      const index = path.join(outDir, 'index.html')
      const notFound = path.join(outDir, '404.html')
      if (!existsSync(index)) return
      if (options.isPreview) {
        copyFileSync(index, notFound)
        return
      }
      const html = readFileSync(index, 'utf8')
      writeFileSync(notFound, html.replace('<head>', `<head>${previewRedirectScript(config.base)}`))
    },
  }
}
