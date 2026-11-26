import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Backend API (override with API_TARGET, e.g. when the API runs on another port)
const apiTarget = process.env.API_TARGET || 'http://localhost:5000';

// Opens the connection to the API server while the page's JavaScript is still downloading,
// so the first banner / services request does not wait for DNS + TLS.
function preconnectApi(apiUrl) {
  return {
    name: 'preconnect-api',
    transformIndexHtml() {
      if (!apiUrl) return [];
      return [
        { tag: 'link', attrs: { rel: 'preconnect', href: apiUrl, crossorigin: '' }, injectTo: 'head-prepend' },
        { tag: 'link', attrs: { rel: 'preconnect', href: apiUrl }, injectTo: 'head-prepend' },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react(), preconnectApi((env.VITE_API_URL || '').replace(/\/+$/, ''))],
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
  };
});
