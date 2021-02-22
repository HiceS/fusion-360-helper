// Local file system modules
import fs = require('fs');
import path = require('path');

import * as vscode from 'vscode';
import * as manifest from './defaults/mainfest.json';

/**
 * 1. Find the Fusion 360 Python Addins Folder
 * 2. Create a new folder in that location
 * 3. Generate the Manifest
 * 4. Generate the Template Code
 * 5. (Optionally) Allow people to specify template code links
 */

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

function createFile(filePath: string, fileName: string, contents: string): void{
    fs.writeFile(path.join(filePath, fileName), contents, err => {
        if (err){
            console.error(err);
            vscode.window.showErrorMessage(`Failed to create file ${fileName}`);
        }

        vscode.window.showInformationMessage(`Succesfully created file ${fileName}`);
    });
}