import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/payment": "http://localhost:3300",
      "/expense": "http://localhost:3300",
      "/login": "http://localhost:3300",
      "/logout": "http://localhost:3300",
      "/payment:id": "http://localhost:3300",
    },
  },
});
