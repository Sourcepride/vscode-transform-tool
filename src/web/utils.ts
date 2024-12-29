export function editorOptions({ editable }: { editable?: boolean }) {
  return {
    fontSize: 14, // TODO:VSCODE get value from vscode
    readOnly: !editable,
    codeLens: false,
    fontFamily: "Menlo, Consolas, monospace, sans-serif", // TODO: VSCODE get value from vscode
    minimap: {
      enabled: false,
    },
    quickSuggestions: false, //TODO: FEATURE get value from settings
    lineNumbers: "on", // TODO:VSCODE get value from vscode
    renderValidationDecorations: "off",
  };
}
