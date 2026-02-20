import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // This is important for assets to load correctly
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
      ignored: ['!**/node_modules/**']
    }
  }
})
