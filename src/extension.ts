// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getSettings, isToolString } from "./helpers";
import { textSelectionHandler } from "./selectTextProcessor";
import { OptionsProvider } from "./treeProvider";
import { toolArgs } from "./web/types";
import { WebviewManager } from "./webviewManager";

let timeOutsIdDump: any[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let webviewManager: WebviewManager;
  let tool: toolArgs = "json_to_typescript";

  vscode.window.createTreeView("transform-tool-tree", {
    treeDataProvider: new OptionsProvider(),
  });

  const disposable = vscode.commands.registerCommand(
    "transform.start",
    ([type, content]) => {
      console.log("||||||||||||||||||||||||||||||", type, typeof content);
      tool = isToolString("") ? type : tool;
      webviewManager = WebviewManager.getManager();
      currentPanel = webviewManager.getOrCreateWebView(
        context,
        getSettings({ tool, content })
      );

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
          webviewManager.dispose();
        },
        null,
        context.subscriptions
      );
    }
  );
  const disposableProcessSelected = vscode.commands.registerCommand(
    "transform-tools.processSelectedText",
    textSelectionHandler
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposableProcessSelected);

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

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "transform-tools.contextMenuOption",
      async (args) => {
        console.log("==============================================", args);
        vscode.window.showInformationMessage(
          `Context menu option called with: ${args}`
        );
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  timeOutsIdDump.forEach((tid) => clearTimeout(tid));
}
