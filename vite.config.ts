import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react'
    ]
  }
})
