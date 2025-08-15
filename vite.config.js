import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', 'browser-image-compression']
  },
  server: {
    proxy: mode === 'development'
      ? {
          '/cognito': {
            target: 'https://cognito-identity.eu-north-1.amazonaws.com',
            changeOrigin: true,
            secure: true,
          },
          '/api': {
            target: 'https://opusama-web.vercel.app/', 
            changeOrigin: true,
            secure: false,
          }
        }
      : {}
  }
}))