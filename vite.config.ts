import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Base './' is required for GitHub Pages to serve assets correctly from a subpath
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});