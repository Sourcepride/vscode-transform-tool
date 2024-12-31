import * as path from "path";
import * as vscode from "vscode";
import { getMainHtmlContent } from ".";

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

      this.panel.webview.html = getMainHtmlContent({
        scriptUri,
        stylesUri,
        workers: {
          prettierUri,
        },
        settings,
      });
    }
  }
}
