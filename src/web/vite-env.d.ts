/// <reference types="vite/client" />

/** Set in `getMainHtmlContent` before `web.js` so curl/tree-sitter WASM uses `asWebviewUri` URLs. */
interface Window {
  __TRANSFORM_TREE_SITTER_WASM__?: string;
  __TRANSFORM_TREE_SITTER_BASH_WASM__?: string;
  __TRANSFORM_RUFF_WASM__?: string;
  /** Set in `getMainHtmlContent`; reapplied in `main.tsx` after `@monaco-editor/loader` runs. */
  __MONACO_WORKER_PATHS__?: Record<string, string>;
}
