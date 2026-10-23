import { defineConfig } from 'vite';

export default defineConfig({
  base: '/aula-fotografia-inovalab/',
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: false,
  },
});
