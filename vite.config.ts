import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
