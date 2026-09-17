import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'

// Level 3 component tests run in pure Node: the api/* modules are exercised
// with a mocked transport, so no browser, server, or database is required.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.js'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
