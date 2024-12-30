// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from "path";
import * as vscode from "vscode";
import { getMainHtmlContent } from ".";
import { getCurrentTheme, getSettings } from "./helpers";

let timeOutsIdDump: any[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const disposable = vscode.commands.registerCommand("transform.start", () => {
    getCurrentTheme();
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
          retainContextWhenHidden: true,
        }
      );

      const scriptPath = vscode.Uri.file(
        path.join(context.extensionPath, "out/web/web.js")
      );
      const stylesPath = vscode.Uri.file(
        path.join(context.extensionPath, "out/web/main.css")
      );
      // ALL URLS IN OTPUT FOLDER CONVERTED TO VSCODE URI FOR WEBVIEW [css, js scripts,  worker scrpts etc]
      const scriptUri = currentPanel.webview.asWebviewUri(scriptPath);
      const stylesUri = currentPanel.webview.asWebviewUri(stylesPath);
      const prettierUri = currentPanel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(context.extensionPath, "out/web/prettier.worker.js")
        )
      );

      currentPanel.webview.html = getMainHtmlContent({
        scriptUri,
        stylesUri,
        workers: {
          prettierUri,
        },
        settings: getSettings({}),
      });
    }
  });

  context.subscriptions.push(disposable);

  // Handler of  change in vscode configuration
  const disposableChangeListener = vscode.workspace.onDidChangeConfiguration(
    (e) => {
      if (
        e.affectsConfiguration("workbench.colorTheme") ||
        e.affectsConfiguration("editor.fontFamily") ||
        e.affectsConfiguration("editor.fontSize") ||
        e.affectsConfiguration("editor.fontWeight")
      ) {
        // TODO: find a better approach, getting theme from window takes a lil time to propagate
        const tid = setTimeout(() => {
          if (!currentPanel) {
            return;
          }
          currentPanel.webview.postMessage({
            command: "theme",
            payload: getSettings({}),
          });
        }, 1000);

        timeOutsIdDump.push(tid);
      }
    }
  );

  context.subscriptions.push(disposableChangeListener);
}

// This method is called when your extension is deactivated
export function deactivate() {
  timeOutsIdDump.forEach((tid) => clearTimeout(tid));
}
