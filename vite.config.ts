import react from "@vitejs/plugin-react";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import * as path from "path";
import tailwindcss from "tailwindcss";
import * as url from "url";
import fs from "node:fs";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** Monaco expects codicon.ttf at a resolvable URL; copy it beside web.js for the VS Code webview. */
const copyMonacoCodiconPlugin = (): Plugin => ({
  name: "copy-monaco-codicon",
  closeBundle() {
    const outWeb = path.join(__dirname, "out", "web");
    const src = path.join(
      __dirname,
      "node_modules",
      "monaco-editor",
      "min",
      "vs",
      "base",
      "browser",
      "ui",
      "codicons",
      "codicon",
      "codicon.ttf",
    );
    const dest = path.join(outWeb, "codicon.ttf");
    if (fs.existsSync(src)) {
      fs.mkdirSync(outWeb, { recursive: true });
      fs.copyFileSync(src, dest);
    }
  },
});

const curlconverterShellParserShim = (): Plugin => ({
  name: "curlconverter-shell-parser-shim",
  enforce: "pre",
  resolveId(source, importer) {
    if (!importer) {
      return null;
    }
    const normalizedImporter = importer.replace(/\\/g, "/");
    if (!normalizedImporter.includes("curlconverter/dist/src/shell/tokenizer")) {
      return null;
    }
    if (source === "./Parser.js" || source === "./webParser.js") {
      return path.resolve(__dirname, "src/web/curl-web-parser.ts");
    }
    return null;
  },
});

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@wasm-fmt/ruff_fmt"],
  },
  plugins: [
    curlconverterShellParserShim(),
    monacoEditorPlugin({}),
    copyMonacoCodiconPlugin(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@workers": path.resolve(__dirname, "./src/workers/"),
      // UMD build exposes named `parse` for ESM consumers (see json-to-env).
      json5: path.resolve(__dirname, "node_modules/json5/dist/index.js"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    target: "esnext",
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
