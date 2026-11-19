import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend API (override with API_TARGET, e.g. when the API runs on another port)
const apiTarget = process.env.API_TARGET || 'http://localhost:5000';
// Public website dev server: supplies the default /images used by banner previews
const siteTarget = process.env.SITE_TARGET || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/uploads': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/images': {
        target: siteTarget,
        changeOrigin: true,
      },
    },
  },
});
