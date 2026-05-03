import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// VS Code webview: the bundled ts.worker cannot resolve AMD foreign modules (require.toUrl /
// FileAccessImpl), which breaks validation and can leave the output editor stuck. We only need
// editing and highlighting here, not IDE-style diagnostics.
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
});
monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
});
monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: false,
});

// Use npm monaco (bundled by Vite) instead of loading from cdn.jsdelivr.net — required for VS Code webview CSP.
loader.config({ monaco });

// `@monaco-editor/loader` resets `MonacoEnvironment` (default CDN paths). Restore webview worker URLs
// from the host HTML so `EditorSimpleWorker` / `FileAccessImpl.toUri` do not run without a resolver.
const monacoPaths = window.__MONACO_WORKER_PATHS__;
if (monacoPaths && typeof monacoPaths === "object") {
  self.MonacoEnvironment = {
    globalAPI: false,
    getWorkerUrl(_moduleId: string, label: string) {
      return monacoPaths[label] ?? monacoPaths["editorWorkerService"]!;
    },
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
