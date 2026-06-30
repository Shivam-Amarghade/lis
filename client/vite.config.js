import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // All /api/* requests → forwarded to the real backend server
      '/api': {
        target: 'http://localhost:5072',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})