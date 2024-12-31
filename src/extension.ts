// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getSettings, isToolString } from "./helpers";
import { OptionsProvider } from "./treeProvider";
import { toolArgs } from "./web/types";
import { WebviewManager } from "./webviewManager";

let timeOutsIdDump: any[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let tool: toolArgs = "json_to_typescript";

  vscode.window.createTreeView("transform-tool-tree", {
    treeDataProvider: new OptionsProvider(),
  });

  const disposable = vscode.commands.registerCommand(
    "transform.start",
    (type) => {
      tool = isToolString(type ?? "") ? type : tool;
      currentPanel = WebviewManager.getManager().getOrCreateWebView(
        context,
        getSettings({ tool })
      );
    }
  );

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
            payload: getSettings({ tool }),
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
