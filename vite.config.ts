import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/rock-project/',  // Must match your GitHub repo name
  build: {
    outDir: 'docs',  // GitHub Pages can serve from /docs on main branch
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
