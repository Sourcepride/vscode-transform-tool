import * as vscode from "vscode";
import { combinedToolsArray } from "./constants";
import { Settings, toolArgs } from "./web/types";

export function getCurrentTheme() {
  const themeKind = vscode.window.activeColorTheme;
  // Determine if the theme is light or dark based on its name
  switch (themeKind.kind) {
    case vscode.ColorThemeKind.Dark:
      return "dark";
    case vscode.ColorThemeKind.Light:
      return "light";
    case vscode.ColorThemeKind.HighContrast:
      return "constract";
    case vscode.ColorThemeKind.HighContrastLight:
      return "constract-light";

    default:
      return "dark";
  }
}

function getFontSettings() {
  const editorConfig = vscode.workspace.getConfiguration("editor");

  const fontFamily =
    editorConfig.get<string>("fontFamily") ||
    '"Menlo, Consolas, monospace, sans-serif';
  const fontSize = editorConfig.get<number>("fontSize") || 12;
  const fontWeight = editorConfig.get<string>("fontWeight") || "normal";

  return {
    fontFamily,
    fontSize,
    fontWeight,
  };
}

export function getSettings({
  content,
  tool,
}: {
  content?: string;
  tool: toolArgs;
}) {
  const settings: Settings = {
    currentTheme: getCurrentTheme(),
    panels: content ? "1" : "2",
    initialContent: content || "",
    tool,
    ...getFontSettings(),
  };

  return JSON.stringify(settings);
}

export function isToolString(tool: string) {
  return combinedToolsArray.includes(tool as any);
}
