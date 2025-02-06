import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get the base url from the environment variable
const base = process.env.BASE_URL || '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  envDir: './',
  envPrefix: 'VITE_',
  base: base,
})
