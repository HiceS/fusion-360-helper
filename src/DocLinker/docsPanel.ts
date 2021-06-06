// Webview 
// https://code.visualstudio.com/api/extension-capabilities/extending-workbench

import { commands, ExtensionContext, ViewColumn, WebviewPanel, window } from 'vscode';


export class DocumentationPanel {

    public constructor(context: ExtensionContext){
        let currentPanel: WebviewPanel | undefined = undefined;

        commands.registerCommand(
            'fusion-360-helper.docs.internalPanel',
            (url: string | undefined) => {
                if (currentPanel){
                    currentPanel.reveal(ViewColumn.Two);
                }else{
                    currentPanel = window.createWebviewPanel(
                        'docPanel',
                        "Fusion 360 Documentation",
                        ViewColumn.Two,
                        {
                            enableScripts: true
                        }
                    );
                }
                currentPanel.webview.html = DocumentationPanel.getWebViewContent(url);
                currentPanel.onDidDispose (
                    () => {
                        currentPanel = undefined;
                    },
                    null,
                    context.subscriptions
                );
                context.subscriptions.push(currentPanel);
            }
        );
    }

    private static getWebViewContent(strObj: string | undefined) {
        let url = "https://help.autodesk.com/view/fusion360/ENU/?contextId=" + strObj;
        return (
            `<!DOCTYPE html>
            <html lang="en"">
            <head>
                <meta charset="UTF-8">
                <title>Preview</title>
                <style>
                    html { width: 100%; height: 100%; min-height: 100%; display: flex; }
                    body { flex: 1; display: flex; }
                    iframe { flex: 1; border: none; background: white; }
                </style>
            </head>
            <body>
                <iframe src="${url}"></iframe>
            </body>
            </html>`
      );
    }
}