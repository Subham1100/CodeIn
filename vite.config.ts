import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
    port: 5000, // Set port to 5000
    strictPort: true, // Fail if 5000 is unavailable
    open: true, // Auto-open browser for confirmation
  },

  build: {
    sourcemap: true,
  },
});
