import * as vscode from "vscode";

type mainHtmlProps = {
  scriptUri: vscode.Uri;
  stylesUri: vscode.Uri;
  workers: Record<string, vscode.Uri>;
};

export function getMainHtmlContent({
  scriptUri,
  stylesUri,
  workers: { prettierUri },
}: mainHtmlProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React Webview</title>
      <link href="${stylesUri}" rel="stylesheet">
      <script>
            // Pass worker URI to the webview
            window.prettierUri="${prettierUri}";
      </script>
    </head>
    <body>
      <div id="root"></div>
      <script src="${scriptUri}"></script>
    </body>
    </html>
  `;
}
