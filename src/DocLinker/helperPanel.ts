// Webview 
// https://code.visualstudio.com/api/extension-capabilities/extending-workbench

import * as vscode from "vscode";

export class HelpPanel {
    public static currentPanel: HelpPanel | undefined;
    public static readonly viewType = "Fusion 360 Help";
}