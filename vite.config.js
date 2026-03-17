import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/streaks': 'http://localhost:8080',
      '/team': 'http://localhost:8080',
      '/player': 'http://localhost:8080',
    },
  },
})
