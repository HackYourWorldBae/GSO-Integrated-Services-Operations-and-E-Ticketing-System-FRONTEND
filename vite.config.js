import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
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
            if (id.includes('chart.js')) return 'vendor-charts';
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) return 'vendor-core';
            if (id.includes('axios') || id.includes('vuelidate') || id.includes('vue3-toastify')) return 'vendor-utils';
            return 'vendor';
          }
        }
      }
    }
  }
})
