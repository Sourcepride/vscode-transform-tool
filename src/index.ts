import * as vscode from "vscode";

type mainHtmlProps = {
  /** Same value as `webview.cspSource` — required so bundled script/style URLs are allowed under CSP. */
  cspSource: string;
  scriptUri: vscode.Uri;
  stylesUri: vscode.Uri;
  workers: Record<string, vscode.Uri>;
  settings: string;
};

export function getMainHtmlContent({
  cspSource,
  scriptUri,
  stylesUri,
  workers: { prettierUri },
  settings,
}: mainHtmlProps) {
  const nonce = getNonce();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' ${cspSource}; worker-src ${cspSource} blob:; img-src ${cspSource} data: https: blob:; font-src ${cspSource} https: data:; connect-src https: data:;">
      <link href="${stylesUri}" rel="stylesheet">
      <script nonce="${nonce}">
            window.prettierUri=${JSON.stringify(String(prettierUri))};
            window.viewSettings=${settings};
      </script>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>
  `;
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
