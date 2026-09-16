import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3257,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9006',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:9006',
        changeOrigin: true,
      }
    }
  }
})
