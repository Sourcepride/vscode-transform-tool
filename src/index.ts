import * as vscode from "vscode";

type mainHtmlProps = {
  /** Same value as `webview.cspSource` — required so bundled script/style URLs are allowed under CSP. */
  cspSource: string;
  scriptUri: vscode.Uri;
  stylesUri: vscode.Uri;
  workers: Record<string, vscode.Uri>;
  /** `out/web/tree-sitter*.wasm` as webview URIs for `curl-web-parser` (fetch needs `connect-src ${cspSource}`). */
  treeSitterWasmUri: vscode.Uri;
  treeSitterBashWasmUri: vscode.Uri;
  /** Labels → webview URLs for `out/web/monacoeditorwork/*.bundle.js` (vite-plugin-monaco-editor output). */
  monacoWorkerPaths: Record<string, string>;
  settings: string;
};

export function getMainHtmlContent({
  cspSource,
  scriptUri,
  stylesUri,
  workers: { prettierUri },
  treeSitterWasmUri,
  treeSitterBashWasmUri,
  monacoWorkerPaths,
  settings,
}: mainHtmlProps) {
  const nonce = getNonce();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'wasm-unsafe-eval' ${cspSource}; worker-src ${cspSource} blob:; img-src ${cspSource} data: https: blob:; font-src ${cspSource} https: data:; connect-src ${cspSource} https: data: blob:;">
      <link href="${stylesUri}" rel="stylesheet">
      <script nonce="${nonce}">
            (function () {
              var paths = ${JSON.stringify(monacoWorkerPaths)};
              window.__MONACO_WORKER_PATHS__ = paths;
              self.MonacoEnvironment = {
                globalAPI: false,
                getWorkerUrl: function (_moduleId, label) {
                  return paths[label] || paths["editorWorkerService"];
                },
              };
            })();
            window.prettierUri=${JSON.stringify(String(prettierUri))};
            window.__TRANSFORM_TREE_SITTER_WASM__=${JSON.stringify(String(treeSitterWasmUri))};
            window.__TRANSFORM_TREE_SITTER_BASH_WASM__=${JSON.stringify(String(treeSitterBashWasmUri))};
            window.viewSettings=${settings};
      </script>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>
  `;
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
