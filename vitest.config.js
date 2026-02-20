import { defineConfig } from 'vitest/config'
import tailwindcss from "@tailwindcss/postcss"
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      reporter: ['text'],
      exclude: [
        'node_modules/',
        'src/tests/setup.js',
        'src/tests/mocks/**'
      ]
    }
  }
})