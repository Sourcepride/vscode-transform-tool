// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from "path";
import * as vscode from "vscode";
import { getMainHtmlContent } from ".";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const disposable = vscode.commands.registerCommand("transform.start", () => {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      // If we already have a panel, show it in the target column
      currentPanel.reveal(columnToShowIn);
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        "transform",
        "Transform Tool",
        columnToShowIn || vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      const scriptPath = vscode.Uri.file(
        path.join(context.extensionPath, "out/web/web.js")
      );
      const stylesPath = vscode.Uri.file(
        path.join(context.extensionPath, "out/web/main.css")
      );
      const scriptUri = currentPanel.webview.asWebviewUri(scriptPath);
      const stylesUri = currentPanel.webview.asWebviewUri(stylesPath);

      currentPanel.webview.html = getMainHtmlContent({ scriptUri, stylesUri });
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
