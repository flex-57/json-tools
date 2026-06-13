import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
} satisfies Config
