import * as path from "path";
import * as vscode from "vscode";
import { getMainHtmlContent } from ".";

/** Same label aliases as vite-plugin-monaco-editor `getWorkPath` + monaco `getWorker` callers. */
function monacoWorkerPathMap(
  webview: vscode.Webview,
  extensionPath: string
): Record<string, string> {
  const dir = path.join(extensionPath, "out/web/monacoeditorwork");
  const uri = (file: string) =>
    String(webview.asWebviewUri(vscode.Uri.file(path.join(dir, file))));
  const editor = uri("editor.worker.bundle.js");
  const css = uri("css.worker.bundle.js");
  const html = uri("html.worker.bundle.js");
  const json = uri("json.worker.bundle.js");
  const ts = uri("ts.worker.bundle.js");
  return {
    editorWorkerService: editor,
    css,
    scss: css,
    less: css,
    html,
    handlebars: html,
    razor: html,
    json,
    typescript: ts,
    javascript: ts,
  };
}

export class WebviewManager {
  private static webManager: WebviewManager;
  private panel: vscode.WebviewPanel | undefined = undefined;

  // FOR SINGLETON PURPOSE
  private constructor() {}

  static getManager() {
    if (this.webManager) {
      return this.webManager;
    }
    this.webManager = new WebviewManager();
    return this.webManager;
  }

  getOrCreateWebView(
    context: vscode.ExtensionContext,
    settings: string,
    openBesides?: boolean
  ) {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (this.panel) {
      // If we already have a panel, show it in the target column
      this.panel.reveal(columnToShowIn);
      this.update(context, settings);
      return this.panel;
    } else {
      const column = openBesides
        ? vscode.ViewColumn.Beside
        : columnToShowIn || vscode.ViewColumn.One;

      this.panel = vscode.window.createWebviewPanel(
        "transform",
        "Transform Tool",
        column,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, "out", "web"),
          ],
        }
      );

      this.update(context, settings);
      return this.panel;
    }
  }

  dispose() {
    this.panel = undefined;
  }

  private update(context: vscode.ExtensionContext, settings: string) {
    if (this.panel) {
      this.panel.iconPath = vscode.Uri.file(
        path.join(context.extensionPath, "assets/logo.png")
      );

      const scriptPath = vscode.Uri.file(
        path.join(context.extensionPath, "out/web/web.js")
      );
      const stylesPath = vscode.Uri.file(
        path.join(context.extensionPath, "out/web/main.css")
      );

      // ALL URLS IN OTPUT FOLDER CONVERTED TO VSCODE URI FOR WEBVIEW [css, js scripts,  worker scrpts etc]
      const scriptUri = this.panel.webview.asWebviewUri(scriptPath);
      const stylesUri = this.panel.webview.asWebviewUri(stylesPath);
      const prettierUri = this.panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(context.extensionPath, "out/web/prettier.worker.js")
        )
      );
      const treeSitterWasmUri = this.panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(context.extensionPath, "out/web/tree-sitter.wasm")
        )
      );
      const treeSitterBashWasmUri = this.panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(context.extensionPath, "out/web/tree-sitter-bash.wasm")
        )
      );
      const monacoWorkerPaths = monacoWorkerPathMap(
        this.panel.webview,
        context.extensionPath
      );

      this.panel.webview.html = getMainHtmlContent({
        cspSource: this.panel.webview.cspSource,
        scriptUri,
        stylesUri,
        workers: {
          prettierUri,
        },
        treeSitterWasmUri,
        treeSitterBashWasmUri,
        monacoWorkerPaths,
        settings,
      });
    }
  }
}
