import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@personas': path.resolve(here, '../docs/plan/personas'),
      '@wallet': path.resolve(here, 'src/wallet'),
      '@mocks': path.resolve(here, 'src/mocks'),
    },
  },
})
