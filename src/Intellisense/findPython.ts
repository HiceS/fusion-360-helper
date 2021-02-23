import path = require('path');
import fs = require('fs');
import { F_OK } from 'constants';
import { window } from 'vscode';

import {getOS, fusionNotInstalledError} from '../utilities';
import * as types from '../types';
import {setPythonPath} from './envFiles';

/**
 * This is the function that updates the settings,
 * It attempts the find the Fusion Python Path and the Fusion adks defs path
 */
export function getPythonLib() {
    let fusPath: string = "";
    let pythonPath: string = "";

    let libraryPath: string = "";

    switch (getOS()) {
        case types.OS.osx:
            /// get osx paths
            fusPath = getOSXPath();
            if (fusPath === ""){
                fusionNotInstalledError();
                return;
            }
            // /Autodesk Fusion 360.app/Contents/Frameworks/Python.framework/Versions/Current/bin/python
            pythonPath = path.join("Autodesk Fusion 360.app", "Contents", "Frameworks", "Python.framework", "Versions", "Current", "bin", "python");
            libraryPath = getOSXRefPath();
            break;
        case types.OS.windows:
            // get windows paths 
            fusPath = getWindowsPath();
            if (fusPath === ""){
                fusionNotInstalledError();
                return;
            }
            pythonPath = path.join("Python", "python.exe");
            libraryPath = getWindowsRefPath();
            break;
        default:
            // do nothing
            return;
    }

    // Gets a list of folders to look through
    fs.readdir(fusPath, (err, files) => {
        if (err){
            window.showErrorMessage(`Could not read folder in ${fusPath}`);
            return;
        }
        let entirePath = "";
        // Looks through each folder in the fusPath
        files.forEach(folder => {
            entirePath = path.join(fusPath, folder, pythonPath);
            // Attempts to access the file to see if it exists
            fs.access(entirePath, F_OK, err => {
                if (!err){
                    // This must be correct
                    setPythonPath(entirePath, libraryPath);
                }
            });
        });
            
    });
}

function getWindowsPath(): string {
    if (process.env.APPDATA){
        const fusPath = path.join(process.env.APPDATA, '..', 'Local', 'Autodesk', 'webdeploy', 'production');
        return fusPath;
    }
    window.showErrorMessage("Cannot find Windows APPDATA Path on this machine");
    return "";
}

function getWindowsRefPath(): string {
    if (process.env.APPDATA){
        // Autodesk/Autodesk Fusion 360/API/Python/defs
        const fusPath = path.join(process.env.APPDATA, 'Autodesk', 'Autodesk Fusion 360', 'API', 'Python', 'defs');
        return fusPath;
    }
    window.showErrorMessage("Cannot find Windows APPDATA Path on this machine");
    return "";
}

function getOSXPath(): string {
    // /Users/[name]/Library/Application Support/Autodesk/webdeploy/production/
    // process.env.HOME + Library
    if (process.env.HOME){
        return path.join(process.env.HOME, 'Library', 'Application Support', 'Autodesk', 'webdeploy', 'production');
    }
    window.showErrorMessage("Cannot find OSX HOME Path on this machine, this is a bug");
    return "";
}

function getOSXRefPath(): string {
    // /Users/[name]/Library/Application Support/Autodesk/Autodesk Fusion 360/API/Python/defs
    // process.env.HOME + Library
    if (process.env.HOME){
        return path.join(process.env.HOME, 'Library', 'Application Support', 'Autodesk', 'Autodesk Fusion 360', 'API', 'Python', 'defs');
    }
    window.showErrorMessage("Cannot find OSX HOME Path on this machine, this is a bug");
    return "";
}