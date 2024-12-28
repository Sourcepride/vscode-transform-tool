import * as vscode from "vscode";

type mainHtmlProps = {
  scriptUri: vscode.Uri;
  stylesUri: vscode.Uri;
};

export function getMainHtmlContent({ scriptUri, stylesUri }: mainHtmlProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React Webview</title>
      <link href="${stylesUri}" rel="stylesheet">
    </head>
    <body>
      <div id="root"></div>
      <script src="${scriptUri}"></script>
    </body>
    </html>
  `;
}
