// Path on windows looks like this: 
// C:/Users/[name]/AppData/Local/Autodesk/webdeploy/production/c1a39fe96c80078ad566b938d0f03989f4b85b09/Python/python.exe

// Lib Path would look like on windows:
// C:/Users/[name]/AppData/Roaming/Autodesk/Autodesk Fusion 360/API/Python/defs

import path = require('path');
import fs = require('fs');
import * as vscode from 'vscode';
import { F_OK } from 'constants';
import {PythonPath} from './pythonPath';
import { window, workspace } from 'vscode';

const PY_PATH_INSTANCE = PythonPath.getInstance();

export function checkPythonSettings(): boolean {
    if (workspace !== undefined) {
        const settings = workspace.getConfiguration('python');
        // check if the found path equals the current one?
        // update the refs if non exist ?
        // add extra command to do it automatically
        return true;
    }else{
        const newLaunch = window.showErrorMessage("Cannot find the Python Settings folders.\nWould you like to create them?", "Yes", "No");
        newLaunch.then(value => {
            if ("Yes"){
                // create a new .vscode folder
                // copy the defaults file into it
                // set the python path
            }
        });
        return false;
    }
}

export function getPythonAutoCompleteLibs(): string {
    return getWindowsRefPath();
}

export function getPythonLib() {
    const winPath = getWindowsPath();

    if (winPath !== ""){
        // async approach
        findInDirs(winPath);
    }
}

function findInDirs(fusPath: string){
    fs.readdir(fusPath, (err, files) => {
        if (err){
            vscode.window.showErrorMessage(`Could not read folder in ${fusPath}`);
            return;
        }

        files.forEach(folder => {
            isPythonInDir(path.join(fusPath, folder));
        });
            
    });
}

function isPythonInDir(dir: string){
    // search for 'python/python.exe' for windows

    const pythonPath = path.join(dir, "Python", "python.exe");

    fs.access(pythonPath, F_OK, err => {
        if (!err){
            // we can assign the new Python interpretur
            PY_PATH_INSTANCE.setPath(pythonPath);
        }
    });
}

/**
 * Function to sync check if Python Path exists,
 * If not delay the intellisense and find the new path
 */
export function checkPythonExistsSync(): boolean {
    if (PY_PATH_INSTANCE.getPath() === ""){
        return false;
    }
    return fs.existsSync(PY_PATH_INSTANCE.getPath());
}

export function checkPathExistsSync(objPath: string): boolean{
    return fs.existsSync(objPath);
}

/**
 * Sync way of getting the correct python folder
 */
export function forceCheckPythonSync() {
    var retPath = "";
    const PY_PATH_INSTANCE = PythonPath.getInstance();
    const fusPath = getWindowsPath();

    const folders = fs.readdirSync(fusPath);

    folders.forEach(folder => {
        const fullPath = path.join(fusPath, folder, 'Python', 'python.exe');

        if (fs.existsSync(fullPath)){
            retPath = fullPath;
        }

    });

    if (retPath === ""){
        vscode.window.showErrorMessage(`Cannot find Fusion 360 libs at path ${retPath}`);
    }else {
        PY_PATH_INSTANCE.setPath(retPath);
    }
    
}

function getWindowsPath(): string {
    if (process.env.APPDATA){
        const fusPath = path.join(process.env.APPDATA, '..', 'Local', 'Autodesk', 'webdeploy', 'production');
        return fusPath;
    }
    vscode.window.showErrorMessage("Cannot find Windows APPDATA Path on this machine");
    return "";
}

function getWindowsRefPath(): string {
    if (process.env.APPDATA){
        // Autodesk/Autodesk Fusion 360/API/Python/defs
        const fusPath = path.join(process.env.APPDATA, 'Autodesk', 'Autodesk Fusion 360', 'API', 'Python', 'defs');
        return fusPath;
    }
    vscode.window.showErrorMessage("Cannot find Windows APPDATA Path on this machine");
    return "";
}