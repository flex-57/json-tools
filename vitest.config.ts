import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    // Above minifyHTML's own 8s internal safety timeout (see useMinifier.ts)
    // plus headroom for cold module-transform cost on the first dynamic
    // import of html-minifier-terser under parallel test-file contention.
    testTimeout: 12000,
  },
})
