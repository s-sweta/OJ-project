import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from 'dotenv';

config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches the deployment folder
    rollupOptions: {
      input: {
        main: 'index.html' // Ensure this matches your entry point
      }
    }
  },
  base: '/' // Adjust this if deploying to a subpath
});
