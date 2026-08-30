import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Relative base works universally on Vercel, GitHub Pages, and local preview
  base: process.env.VERCEL ? '/' : (process.env.BASE_URL || './'),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
