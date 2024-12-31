import * as vscode from "vscode";
import { combinedToolsArray } from "./constants";

export async function textSelectionHandler() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor!");
    return;
  }

  // Get the selected text
  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showWarningMessage("No text selected!");
    return;
  }

  // Show a menu with options
  const selectedOption = await vscode.window.showQuickPick(
    combinedToolsArray.map((val) => val.split("_").join(" ")),
    {
      placeHolder: "Pick an option to transform the selected text",
    }
  );

  if (!selectedOption) {
    vscode.window.showInformationMessage("No option selected!");
    return;
  }

  vscode.commands.executeCommand("transform.start", {
    arguments: [selectedOption.split(" ").join("_"), selectedText],
  });
}
