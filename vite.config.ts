import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/brand-archetype-os/",
  build: {
    target: "es2020",
    outDir: "dist",
  },
  server: {
    port: 5173,
    open: true,
  },
});
