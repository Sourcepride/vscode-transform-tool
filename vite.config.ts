import react from "@vitejs/plugin-react";
import * as path from "path";
import tailwindcss from "tailwindcss";
import * as url from "url";
import { defineConfig } from "vite";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@workers": path.resolve(__dirname, "./src/workers/"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: path.join("out", "web"), // Output for the webview assets
    rollupOptions: {
      input: path.join("src", "web", "main.tsx"),
      output: {
        entryFileNames: "web.js", // The bundled file name
        assetFileNames: "[name][extname]", // Keep original CSS name
      },
    },
  },
  worker: {
    format: "es", // ES modules for the worker
    rollupOptions: {
      output: {
        entryFileNames: "[name].js", // Name workers uniquely
      },
    },
  },
});
