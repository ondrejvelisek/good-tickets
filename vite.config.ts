import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { apiPlugin } from './interviewers-only/vite-plugin-api.ts'

const DEFAULT_BASE = '/good-tickets/'
const base = process.env.BASE_PATH ?? DEFAULT_BASE

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), apiPlugin({ isPreview: base !== DEFAULT_BASE })],
})
