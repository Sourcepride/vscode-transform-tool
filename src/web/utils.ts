export function editorOptions({
  editable,
  fontFamily,
  fontSize,
  fontWeight,
  renderValidationDecorations,
}: {
  editable?: boolean;
  fontWeight?: string;
  fontFamily?: string;
  fontSize?: number;
  renderValidationDecorations: "on" | "off" | "editable";
}) {
  return {
    fontSize: fontSize || 12,
    readOnly: !editable,
    codeLens: false,
    fontFamily: fontFamily || "Menlo, Consolas, monospace, sans-serif",
    fontWeight,
    minimap: {
      enabled: false,
    },
    quickSuggestions: false, //TODO: FEATURE get value from settings
    lineNumbers: "on", // TODO:VSCODE get value from vscode
    renderValidationDecorations,
  };
}
