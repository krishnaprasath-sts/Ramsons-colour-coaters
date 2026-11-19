import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend API (override with API_TARGET, e.g. when the API runs on another port)
const apiTarget = process.env.API_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/uploads': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/dashboard/uploads': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/sendMail.php': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
