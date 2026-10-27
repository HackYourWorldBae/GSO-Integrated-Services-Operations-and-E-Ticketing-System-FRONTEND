import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawApiUrl = env.VITE_API_URL || 'http://localhost:8080/api/v1';
  let proxyTarget = 'http://localhost:8080';
  try {
    const parsed = new URL(rawApiUrl);
    proxyTarget = parsed.origin;
  } catch {
    proxyTarget = 'http://localhost:8080';
  }

  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false, // Security Hardening: Never expose original Vue source files in production builds
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('pdfmake')) return 'vendor-pdfmake';
              if (id.includes('docx-preview') || id.includes('docxtemplater') || id.includes('pizzip')) return 'vendor-docx';
              if (id.includes('html2pdf.js')) return 'vendor-html2pdf';
              if (id.includes('chart.js')) return 'vendor-charts';
              if (id.includes('sweetalert2')) return 'vendor-sweetalert2';
              if (id.includes('flatpickr')) return 'vendor-flatpickr';
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) return 'vendor-core';
              if (id.includes('axios') || id.includes('vuelidate') || id.includes('vue3-toastify')) return 'vendor-utils';
              return 'vendor';
            }
          }
        }
      }
    }
  };
});
