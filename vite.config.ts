import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/zyraxon-ecommerce-mryj6e4r/',
  build: {
    outDir: 'dist',
  },
})
