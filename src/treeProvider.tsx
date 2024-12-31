import * as vscode from "vscode";
import { NAV } from "./constants";

export class OptionsProvider implements vscode.TreeDataProvider<Bar> {
  constructor() {}

  getTreeItem(element: Bar): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Bar): Thenable<Bar[]> {
    if (element) {
      const val = NAV[element.label as keyof typeof NAV] || [];
      return Promise.resolve(
        val.map((item) => new Bar(item, vscode.TreeItemCollapsibleState.None))
      );
    } else {
      return Promise.resolve(
        Array.from(Object.keys(NAV)).map(
          (item) => new Bar(item, vscode.TreeItemCollapsibleState.Expanded)
        )
      );
    }
  }
}

class Bar extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label.split("_").join(" "), collapsibleState);
    this.tooltip = label;

    if (Array.from(Object.keys(NAV)).includes(label)) {
      this.iconPath = vscode.ThemeIcon.Folder;
    } else {
      this.tooltip = `convert ${this.label}`;
      this.command = {
        command: "transform.start",
        title: "Start Tool",
        arguments: [label],
      };
    }
  }
}
