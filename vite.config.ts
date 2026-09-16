import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/opensky': {
        target: 'https://opensky-network.org/api/states/all',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/opensky/, ''),
      },
    },
  },
})
