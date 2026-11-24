import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/kvisa-path/',
  plugins: [react()],
  server: {
    port: 5203,
  },
});
