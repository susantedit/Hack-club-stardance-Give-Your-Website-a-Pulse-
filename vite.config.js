import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Hack-club-stardance-Give-Your-Website-a-Pulse-/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        solar: resolve(__dirname, 'solar.html'),
      },
    },
  },
})
