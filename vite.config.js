import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'SmLogin',
      fileName: (format) => `sm-login.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'firebase/app', 'firebase/auth'],
      output: {
        globals: {
          vue: 'Vue',
          'firebase/app': 'firebase',
          'firebase/auth': 'firebase.auth'
        }
      }
    }
  }
});
