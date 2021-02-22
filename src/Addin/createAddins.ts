// Local file system modules
import fs = require('fs');
import path = require('path');

import * as vscode from 'vscode';

// This is called by the register command in extension.ts
export function generatePythonAddin(){
    vscode.window.showInformationMessage('Hello World from Fusion 360 Helper - Create Python Addin!');
}

export function generateCppAddin(){
    vscode.window.showInformationMessage('Hello World from Fusion 360 Helper - Create CPP Addin!');
}

const addinManifest = `Hello my name is 
MANIFEST
PLZ SAVE ME
`;

const defaultFile = `TEST DEFAULT FILE`;