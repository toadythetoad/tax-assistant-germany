import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/tesseract.js/, /pdfjs-dist/, /node_modules/],
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['tesseract.js', 'pdfjs-dist'],
  },
});
