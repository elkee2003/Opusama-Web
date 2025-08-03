import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', 'browser-image-compression']
  },
  server: {
    // headers: {
    //   'Cross-Origin-Opener-Policy': 'same-origin',
    //   'Cross-Origin-Embedder-Policy': 'credentialless', 
    // },
    proxy: {
      '/cognito': {
        target: 'https://cognito-identity.eu-north-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/api': {
        target: 'https://opusama-web-nc9b.vercel.app',
        changeOrigin: true,
        secure: false, 
      }
    }
  }
})
